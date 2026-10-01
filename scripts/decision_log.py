#!/usr/bin/env python3
"""Validate an append-only decision ledger and render its linked Markdown views."""
import argparse
import json
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LOGS = ROOT / 'logs'
STATUSES = {'proposed', 'accepted', 'investigated', 'tested', 'rejected', 'deferred'}
RELATIONS = {'depends_on', 'informed_by', 'constrains', 'implements', 'supersedes', 'motivated_by'}
REQUIRED = {'id', 'slug', 'title', 'created_at', 'status', 'authority', 'purpose',
            'question', 'options', 'recommendation', 'rationale', 'evidence',
            'uncertainties', 'revisit_when', 'links', 'evaluation', 'context', 'terms', 'example'}


def load_and_validate_decision_records():
    source_catalog = json.loads((LOGS / 'sources.json').read_text())
    decision_records = [json.loads(line) for line in (LOGS / 'ledger.jsonl').read_text().splitlines() if line.strip()]
    if not decision_records:
        raise ValueError('Ledger is empty')
    record_ids = [decision_record['id'] for decision_record in decision_records]
    if len(record_ids) != len(set(record_ids)):
        raise ValueError('Duplicate record ID')
    records_by_id = {decision_record['id']: decision_record for decision_record in decision_records}
    connected_record_ids = {field_name: set() for field_name in record_ids}
    earlier_record_ids = set()
    for source_id, source in source_catalog.items():
        if not re.fullmatch(r'SRC-\d{4}', source_id):
            raise ValueError(f'Invalid source ID: {source_id}')
        for field_name in ('title', 'kind', 'locator', 'consulted_on', 'scope'):
            if not isinstance(source.get(field_name), str) or not source[field_name]:
                raise ValueError(f'{source_id}: missing source field {field_name}')
        datetime.strptime(source['consulted_on'], '%Y-%m-%d')
        if source['kind'] == 'web' and not source['locator'].startswith('https://'):
            raise ValueError(f'{source_id}: web sources require HTTPS URLs')
    for decision_record in decision_records:
        missing = REQUIRED - decision_record.keys()
        if missing:
            raise ValueError(f"{decision_record['id']}: missing {sorted(missing)}")
        record_id = decision_record['id']
        if not re.fullmatch(r'(DEC|RES|EXP|OPS)-\d{4}', record_id):
            raise ValueError(f'Invalid record ID: {record_id}')
        if not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', decision_record['slug']):
            raise ValueError(f'{record_id}: invalid descriptive slug')
        if decision_record['status'] not in STATUSES:
            raise ValueError(f'{record_id}: invalid status')
        recorded_at = datetime.fromisoformat(decision_record['created_at'].replace('Z', '+00:00'))
        if recorded_at.tzinfo is None:
            raise ValueError(f'{record_id}: timestamp needs timezone')
        for field_name in ('title', 'authority', 'purpose', 'question', 'recommendation', 'revisit_when', 'context', 'example'):
            if not isinstance(decision_record[field_name], str) or not decision_record[field_name].strip():
                raise ValueError(f'{record_id}: empty {field_name}')
        if not decision_record['options'] or not decision_record['rationale'] or not decision_record['evidence']:
            raise ValueError(f'{record_id}: options, reasons and evidence are required')
        if not isinstance(decision_record['terms'], dict) or not decision_record['terms'] or any(not isinstance(field_value, str) or not field_value.strip() for field_value in decision_record['terms'].values()):
            raise ValueError(f'{record_id}: local definitions are required')
        evaluation_fields = {'method', 'prior_accepted_choice', 'prior_watchlist', 'fresh_information',
                             'candidate_count', 'trial_count', 'effective_trial_count', 'coherence', 'promotion_gate'}
        if not isinstance(decision_record['evaluation'], dict) or evaluation_fields - decision_record['evaluation'].keys():
            raise ValueError(f'{record_id}: incomplete evaluation record')
        for option in decision_record['options']:
            if any(not option.get(required_field) for required_field in ('name', 'tradeoff', 'mark')):
                raise ValueError(f'{record_id}: incomplete option')
            if option['mark'] not in {'accept', 'watch', 'reject', 'needs_replay', 'decay_watch'}:
                raise ValueError(f'{record_id}: invalid option mark')
        for evidence in decision_record['evidence']:
            if evidence.get('source') not in source_catalog or not evidence.get('supports'):
                raise ValueError(f'{record_id}: invalid evidence source')
        for relationship in decision_record['links']:
            related_record_id = relationship.get('target')
            if related_record_id not in records_by_id or related_record_id == record_id or relationship.get('relation') not in RELATIONS:
                raise ValueError(f'{record_id}: invalid relationship {relationship}')
            if relationship['relation'] == 'supersedes' and related_record_id not in earlier_record_ids:
                raise ValueError(f'{record_id}: supersession must target an earlier record')
            connected_record_ids[record_id].add(related_record_id)
            connected_record_ids[related_record_id].add(record_id)
        earlier_record_ids.add(record_id)
    reachable_record_ids, pending_record_ids = set(), [record_ids[0]]
    while pending_record_ids:
        record_id = pending_record_ids.pop()
        if record_id not in reachable_record_ids:
            reachable_record_ids.add(record_id)
            pending_record_ids.extend(connected_record_ids[record_id] - reachable_record_ids)
    if reachable_record_ids != set(record_ids):
        raise ValueError(f'Disconnected records: {set(record_ids) - reachable_record_ids}')
    return decision_records, source_catalog


def record_page_filename(decision_record):
    return f"{decision_record['id']}-{decision_record['slug']}.md"


def render_decision_network(decision_records, source_catalog):
    records_by_id = {decision_record['id']: decision_record for decision_record in decision_records}
    generated_pages = {}
    index_lines = ['# Decision network', '',
             'Generated from the append-only ledger. Proposals are not accepted architecture.', '',
             '[Project goal](../GOAL.md) · [How to use the logs](README.md) · [Source catalog](SOURCES.md)', '',
             '| Record | Status | Purpose |', '| --- | --- | --- |']
    for decision_record in decision_records:
        index_lines.append(f"| [{decision_record['id']} — {decision_record['title']}](records/{record_page_filename(decision_record)}) | {decision_record['status']} | {decision_record['purpose']} |")
        page_lines = [f"# {decision_record['id']} — {decision_record['title']}", '',
                 f"Status: **{decision_record['status']}** · Recorded: {decision_record['created_at']}", '',
                 f"Decision authority: {decision_record['authority']}", '',
                 '[Network index](../INDEX.md) · [Source catalog](../SOURCES.md)', '',
                 '## Background — read this first', '', decision_record['context'], '',
                 '## Terms used in this record', '']
        page_lines += [f'- **{term}:** {meaning}' for term, meaning in decision_record['terms'].items()]
        page_lines += ['', '## Concrete example', '', decision_record['example'], '',
                 '## Why this log exists', '', decision_record['purpose'], '',
                 '## Question', '', decision_record['question'], '', '## Available options', '',
                 '| Option | Tradeoff | Current mark |', '| --- | --- | --- |']
        for option_record in decision_record['options']:
            page_lines.append(f"| {option_record['name']} | {option_record['tradeoff']} | {option_record['mark']} |")
        page_lines += ['', '## Recommendation or decision', '', decision_record['recommendation'], '',
                  '## Reasons', ''] + [f'- {reason}' for reason in decision_record['rationale']]
        page_lines += ['', '## Evidence and references', '']
        for evidence_record in decision_record['evidence']:
            source_record = source_catalog[evidence_record['source']]
            anchor = evidence_record['source'].lower()
            page_lines.append(f"- [{evidence_record['source']} — {source_record['title']}](../SOURCES.md#{anchor}): {evidence_record['supports']}")
        page_lines += ['', '## Uncertainties and next evidence needed', '']
        page_lines += [f'- {field_value}' for field_value in decision_record['uncertainties']] or ['None recorded.']
        page_lines += ['', '## Revisit when', '', decision_record['revisit_when'], '', '## Connected records', '']
        for relationship in decision_record['links']:
            related_record = records_by_id[relationship['target']]
            page_lines.append(f"- **{relationship['relation']}** → [{related_record['id']} — {related_record['title']}]({record_page_filename(related_record)})")
        for related_record in decision_records:
            for relationship in related_record['links']:
                if relationship['target'] == decision_record['id']:
                    page_lines.append(f"- ← **{relationship['relation']}** from [{related_record['id']} — {related_record['title']}]({record_page_filename(related_record)})")
        page_lines += ['', '## How this conclusion was reached', '']
        labels = {'method': 'Method', 'prior_accepted_choice': 'Previously accepted choice',
                  'prior_watchlist': 'Previously unresolved candidates', 'fresh_information': 'New evidence',
                  'candidate_count': 'Options compared (not an exhaustive search)', 'trial_count': 'Tests run',
                  'effective_trial_count': 'Independent successful tests', 'coherence': 'Consistency with earlier records',
                  'promotion_gate': 'What this permits next'}
        for field_name, label in labels.items():
            value = decision_record['evaluation'][field_name]
            if value is None:
                value = 'None'
            elif isinstance(value, list):
                value = '; '.join(str(field_value) for field_value in value) or 'None'
            page_lines.append(f'- **{label}:** {value}')
        page_lines.append('')
        generated_pages[LOGS / 'records' / record_page_filename(decision_record)] = '\n'.join(page_lines)
    index_lines += ['', '## Relationship map', '',
              'Arrows read “source depends on / is informed by / implements target”. Each record page also lists incoming links.', '',
              '```mermaid', 'flowchart TD']
    for decision_record in decision_records:
        graph_node_id = decision_record['id'].replace('-', '_')
        label = f"{decision_record['id']}: {decision_record['title']} ({decision_record['status']})".replace('"', "'")
        index_lines.append(f'    {graph_node_id}["{label}"]')
    for decision_record in decision_records:
        for relationship in decision_record['links']:
            index_lines.append(f"    {decision_record['id'].replace('-', '_')} -->|{relationship['relation']}| {relationship['target'].replace('-', '_')}")
    index_lines += ['```', '']
    generated_pages[LOGS / 'INDEX.md'] = '\n'.join(index_lines)
    source_catalog_lines = ['# Source catalog', '', 'Sources support the stated claims, not every recommendation in a linked record.', '']
    for source_id, source_record in source_catalog.items():
        source_catalog_lines += [f'## {source_id}', '', f"**{source_record['title']}**", '',
                    f"Type: {source_record['kind']} · Consulted: {source_record['consulted_on']}", '']
        source_catalog_lines += [f"[Primary source]({source_record['locator']})" if source_record['kind'] == 'web' else source_record['locator'], '', source_record['scope'], '']
        citing_records = [decision_record for decision_record in decision_records if any(evidence_record['source'] == source_id for evidence_record in decision_record['evidence'])]
        source_catalog_lines += ['Used by: ' + ', '.join(f"[{decision_record['id']}](records/{record_page_filename(decision_record)})" for decision_record in citing_records), '']
    generated_pages[LOGS / 'SOURCES.md'] = '\n'.join(source_catalog_lines)
    return generated_pages


def main():
    argument_parser = argparse.ArgumentParser(description=__doc__)
    argument_parser.add_argument('--check', action='store_true', help='Validate all records and verify generated views are current')
    command_arguments = argument_parser.parse_args()
    try:
        decision_records, source_catalog = load_and_validate_decision_records()
        generated_pages = render_decision_network(decision_records, source_catalog)
        extras = set((LOGS / 'records').glob('*.md')) - set(generated_pages)
        if extras:
            raise ValueError(f'Unexpected record pages: {sorted(str(generated_path) for generated_path in extras)}')
        if command_arguments.check:
            stale = [str(generated_path.relative_to(ROOT)) for generated_path, page_content in generated_pages.items() if not generated_path.exists() or generated_path.read_text() != page_content]
            if stale:
                raise ValueError(f'Generated views need regeneration: {stale}')
        else:
            for path, content in generated_pages.items():
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content)
        edges = sum(len(decision_record['links']) for decision_record in decision_records)
        print(f'Validated {len(decision_records)} records, {len(source_catalog)} sources, and {edges} links; views are current.')
    except (ValueError, KeyError, TypeError, OSError) as validation_error:
        argument_parser.exit(1, f'Log validation failed: {validation_error}\n')


if __name__ == '__main__':
    main()
