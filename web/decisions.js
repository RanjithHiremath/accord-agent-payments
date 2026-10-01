const recordList = document.querySelector('#record-list');
const recordDetail = document.querySelector('#record-detail');
const searchInput = document.querySelector('#record-search');
const recordFilter = document.querySelector('#record-filter');
const recordCount = document.querySelector('#record-count');
const graphContainer = document.querySelector('#network-graph');
let decisionRecords = [];
let sourceCatalog = {};
let selectedRecordId = '';
function element(tagName, className, content) {
  const result = document.createElement(tagName);
  if (className) result.className = className;
  if (content !== undefined) result.textContent = String(content);
  return result;
}
function appendSection(title, content) {
  if (content === undefined || content === null || content === '') return;
  recordDetail.append(element('h3', '', title));
  if (Array.isArray(content)) {
    const list = element('ul');
    for (const item of content) list.append(element('li', '', typeof item === 'string' ? item : JSON.stringify(item)));
    recordDetail.append(list);
  } else recordDetail.append(element('p', '', typeof content === 'string' ? content : JSON.stringify(content)));
}
function makeRecordLink(recordId, label) {
  const button = element('button', 'record-link', label || recordId);
  button.type = 'button';
  button.addEventListener('click', () => selectRecord(recordId, true));
  return button;
}
function selectRecord(recordId, scrollToRecord = false) {
  const record = decisionRecords.find(candidate => candidate.id === recordId);
  if (!record) return;
  selectedRecordId = record.id;
  history.replaceState(null, '', `#${encodeURIComponent(record.id)}`);
  recordDetail.replaceChildren(element('p', 'eyebrow', `${record.id} / ${record.status}`), element('h2', '', record.title), element('p', 'record-metadata', `${record.created_at} · ${record.authority}`));
  appendSection('The background', record.context);
  appendSection('Why this record exists', record.purpose);
  appendSection('The question', record.question);
  if (record.terms) {
    recordDetail.append(element('h3', '', 'Terms, in ordinary language'));
    const definitions = element('dl');
    for (const [term, explanation] of Object.entries(record.terms)) definitions.append(element('dt', '', term), element('dd', '', explanation));
    recordDetail.append(definitions);
  }
  appendSection('A concrete example', record.example);
  recordDetail.append(element('h3', '', 'Options considered'));
  for (const option of record.options || []) {
    const optionPanel = element('div', 'record-option');
    optionPanel.append(element('strong', '', option.name), element('p', '', option.tradeoff), element('span', 'small muted', `Assessment: ${String(option.mark).replaceAll('_', ' ')}`));
    recordDetail.append(optionPanel);
  }
  appendSection('Recommendation', record.recommendation);
  appendSection('Reasons', record.rationale);
  if (record.evidence?.length) {
    recordDetail.append(element('h3', '', 'Evidence and supporting sources'));
    for (const evidence of record.evidence) {
      const source = sourceCatalog[evidence.source];
      const evidenceParagraph = element('div', 'evidence-entry');
      evidenceParagraph.append(element('p', '', evidence.supports));
      evidenceParagraph.append(document.createElement('br'));
      if (source) {
        const locator = source.locator || source.url || '';
        let sourceAddress;
        try { sourceAddress = new URL(locator); } catch { /* Local evidence is intentionally not a web link. */ }
        if (sourceAddress && ['https:', 'http:'].includes(sourceAddress.protocol)) {
          const sourceLink = element('a', '', `${evidence.source} · ${source.title}`);
          sourceLink.href = sourceAddress.href;
          sourceLink.target = '_blank';
          sourceLink.rel = 'noopener noreferrer';
          evidenceParagraph.append(sourceLink);
        } else evidenceParagraph.append(element('span', 'small muted', `${evidence.source} · ${source.title} — ${locator}`));
        evidenceParagraph.append(element('span', 'small muted', ` · Consulted ${source.consulted_on || source.access_date || 'date not supplied'}`));
        if (source.scope) evidenceParagraph.append(element('p', 'small muted', source.scope));
      } else evidenceParagraph.append(element('span', 'small muted', evidence.source));
      recordDetail.append(evidenceParagraph);
    }
  }
  appendSection('What remains uncertain', record.uncertainties);
  appendSection('When to revisit', record.revisit_when);
  if (record.evaluation) {
    recordDetail.append(element('h3', '', 'How this was evaluated'));
    const evaluationFields = {method:'Method',trial_count:'Recorded trials',coherence:'Review notes',promotion_gate:'Limits of this conclusion'};
    for (const [fieldName, label] of Object.entries(evaluationFields)) {
      if (record.evaluation[fieldName] !== undefined) recordDetail.append(element('p', '', `${label}: ${record.evaluation[fieldName]}`));
    }
  }
  recordDetail.append(element('h3', '', 'Connected records'));
  for (const relation of record.links || []) {
    const relatedRecord = decisionRecords.find(candidate => candidate.id === relation.target);
    recordDetail.append(makeRecordLink(relation.target, `${relation.relation.replaceAll('_', ' ')} → ${relation.target}${relatedRecord ? ` · ${relatedRecord.title}` : ''}`));
  }
  for (const incomingRecord of decisionRecords) {
    for (const incomingLink of incomingRecord.links || []) {
      if (incomingLink.target === record.id) recordDetail.append(makeRecordLink(incomingRecord.id, `← ${incomingRecord.id} ${incomingLink.relation.replaceAll('_', ' ')} this record`));
    }
  }
  for (const selectionButton of recordList.querySelectorAll('button')) selectionButton.setAttribute('aria-pressed', String(selectionButton.dataset.recordId === selectedRecordId));
  for (const graphNode of graphContainer.querySelectorAll('[role=button]')) graphNode.setAttribute('aria-pressed', String(graphNode.dataset.recordId === selectedRecordId));
  if (scrollToRecord) recordDetail.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block:'start'});
}
function drawGraph(visibleRecords) {
  graphContainer.replaceChildren();
  if (!visibleRecords.length) return;
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const graph = document.createElementNS(svgNamespace, 'svg');
  graph.setAttribute('viewBox', '0 0 1100 330');
  graph.setAttribute('role', 'group');
  graph.setAttribute('aria-label', 'Interactive map of the visible decision records');
  const positions = new Map();
  const groups = ['DEC', 'RES', 'EXP', 'OPS'];
  groups.forEach((prefix, groupIndex) => {
    const recordsInGroup = visibleRecords.filter(record => record.id.startsWith(prefix));
    recordsInGroup.forEach((record, recordIndex) => {
      const angle = recordsInGroup.length === 1 ? 0 : recordIndex / recordsInGroup.length * Math.PI * 2;
      const centerHorizontal = 150 + groupIndex * 265;
      positions.set(record.id, {horizontal:centerHorizontal + Math.cos(angle) * Math.min(100, 25 + recordsInGroup.length * 8), vertical:170 + Math.sin(angle) * 105});
    });
    const groupLabel = document.createElementNS(svgNamespace, 'text');
    groupLabel.setAttribute('x', 150 + groupIndex * 265);
    groupLabel.setAttribute('y', 23);
    groupLabel.setAttribute('text-anchor', 'middle');
    groupLabel.textContent = `${{DEC:'DECISIONS',RES:'RESEARCH',EXP:'EXPERIMENTS',OPS:'OPERATIONS'}[prefix]} / ${recordsInGroup.length}`;
    graph.append(groupLabel);
  });
  for (const record of visibleRecords) {
    const sourcePosition = positions.get(record.id);
    for (const link of record.links || []) {
      const targetPosition = positions.get(link.target);
      if (!targetPosition) continue;
      const edge = document.createElementNS(svgNamespace, 'line');
      for (const [attribute, value] of Object.entries({x1:sourcePosition.horizontal,y1:sourcePosition.vertical,x2:targetPosition.horizontal,y2:targetPosition.vertical})) edge.setAttribute(attribute, value);
      graph.append(edge);
    }
  }
  for (const record of visibleRecords) {
    const position = positions.get(record.id);
    const node = document.createElementNS(svgNamespace, 'g');
    node.setAttribute('role', 'button');
    node.setAttribute('tabindex', '0');
    node.setAttribute('aria-label', `${record.id}: ${record.title}`);
    node.setAttribute('aria-pressed', String(record.id === selectedRecordId));
    node.dataset.recordId = record.id;
    const dot = document.createElementNS(svgNamespace, 'circle');
    dot.setAttribute('cx', position.horizontal);
    dot.setAttribute('cy', position.vertical);
    dot.setAttribute('r', 8);
    const label = document.createElementNS(svgNamespace, 'text');
    label.setAttribute('x', position.horizontal);
    label.setAttribute('y', position.vertical + 22);
    label.setAttribute('text-anchor', 'middle');
    label.textContent = record.id;
    node.append(dot,label);
    node.addEventListener('click', () => selectRecord(record.id, true));
    node.addEventListener('keydown', event => { if (['Enter',' '].includes(event.key)) { event.preventDefault(); selectRecord(record.id, true); }});
    graph.append(node);
  }
  graphContainer.append(graph);
}
function filterRecords() {
  const searchPhrase = searchInput.value.toLocaleLowerCase().trim();
  const visibleRecords = decisionRecords.filter(record => (recordFilter.value === 'all' || record.id.startsWith(recordFilter.value)) && JSON.stringify(record).toLocaleLowerCase().includes(searchPhrase));
  recordCount.textContent = `${visibleRecords.length} of ${decisionRecords.length} records · Historical entries retain their original status. Later records may replace their conclusions.`;
  recordList.replaceChildren();
  for (const record of visibleRecords) {
    const recordButton = element('button', 'record-button');
    recordButton.type = 'button';
    recordButton.dataset.recordId = record.id;
    recordButton.setAttribute('aria-pressed', String(record.id === selectedRecordId));
    recordButton.append(element('span', '', `${record.id} · ${record.status}`), element('strong', '', record.title));
    recordButton.addEventListener('click', () => selectRecord(record.id, window.innerWidth < 761));
    recordList.append(recordButton);
  }
  if (!visibleRecords.length) recordList.append(element('p', 'empty-state', 'No records match. Try a broader term or select all record types.'));
  drawGraph(visibleRecords);
}
async function loadRecords() {
  try {
    const response = await fetch('/api/logs');
    if (!response.ok) throw new Error('Decision records are unavailable. Start the local runtime and reload this page.');
    const responseData = await response.json();
    decisionRecords = responseData.records;
    sourceCatalog = responseData.sources;
    selectedRecordId = decodeURIComponent(location.hash.slice(1)) || decisionRecords[0]?.id;
    filterRecords();
    selectRecord(selectedRecordId);
  } catch (error) {
    recordCount.textContent = 'Could not load the decision network.';
    recordList.append(element('p', 'error-message', error.message));
  }
}
searchInput.addEventListener('input', filterRecords);
recordFilter.addEventListener('change', filterRecords);
loadRecords();
