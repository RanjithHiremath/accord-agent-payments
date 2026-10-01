const demoForm = document.querySelector('#demo-form');
const runtimeStatus = document.querySelector('#runtime-status');
const resultsPanel = document.querySelector('#demo-results');
const executionStatus = document.querySelector('#execution-status');
const runDemoButton = document.querySelector('#run-demo');
function createElement(tagName, className, content) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  if (content !== undefined) element.textContent = String(content);
  return element;
}
function formatTestEth(amountWei) {
  if (amountWei === undefined || amountWei === null) return undefined;
  const smallestUnits = BigInt(amountWei);
  const unitsPerEth = 1000000000000000000n;
  const wholeEth = smallestUnits / unitsPerEth;
  const fractionalEth = (smallestUnits % unitsPerEth).toString().padStart(18, '0').replace(/0+$/, '');
  return `${wholeEth}${fractionalEth ? `.${fractionalEth}` : ''} Test ETH`;
}
async function checkRuntime() {
  try {
    const response = await fetch('/api/health');
    if (!response.ok) throw new Error('Local runtime unavailable');
    const health = await response.json();
    runtimeStatus.textContent = health.ok === false ? 'Local runtime needs attention. Running an exchange will show the error.' : 'Local runtime connected · Test ETH only';
  } catch {
    runtimeStatus.textContent = 'Local runtime unavailable. Start the project with npm start.';
  }
}
function showResults(exchange) {
  resultsPanel.replaceChildren();
  resultsPanel.append(createElement('p', 'demo-summary', exchange.summary || 'Exchange finished.'));
  const stepList = createElement('ol', 'execution-steps');
  for (const step of exchange.steps || []) {
    const stepItem = createElement('li');
    stepItem.append(createElement('span', 'step-status', ['error', 'failed'].includes(step.status) ? '!' : '✓'));
    const stepDescription = createElement('div');
    stepDescription.append(createElement('strong', '', step.name), createElement('p', '', step.detail));
    stepItem.append(stepDescription);
    stepList.append(stepItem);
  }
  resultsPanel.append(stepList);
  if (exchange.result) {
    resultsPanel.append(createElement('h3', '', 'Dataset summary'));
    const resultGrid = createElement('div', 'result-grid');
    for (const [fieldName, label] of [['count', 'Count'], ['sum', 'Sum'], ['min', 'Minimum'], ['max', 'Maximum']]) {
      const resultCell = createElement('div');
      resultCell.append(createElement('span', '', label), createElement('strong', '', exchange.result[fieldName]));
      resultGrid.append(resultCell);
    }
    resultsPanel.append(resultGrid);
  }
  const receiptPanel = createElement('div', 'receipt-details');
  receiptPanel.append(createElement('h3', '', exchange.transactionHash ? 'Payment receipt' : 'Exchange details'));
  const receiptFields = createElement('dl');
  for (const [label, value] of [['Network', exchange.network], ['Currency', exchange.currency], ['Transaction', exchange.transactionHash], ['Block', exchange.blockNumber], ['Offer ID', exchange.quoteId], ['Buyer', exchange.buyer], ['Seller', exchange.seller], ['Payment', formatTestEth(exchange.amountWei)], ['Network fee', formatTestEth(exchange.gasCostWei)], ['Payment (wei)', exchange.amountWei], ['Fee (wei)', exchange.gasCostWei], ['Reused payment', exchange.reused === undefined ? undefined : exchange.reused ? 'Yes — no second payment' : 'No'], ['Duration', exchange.durationMs === undefined ? undefined : `${exchange.durationMs} ms`]]) {
    if (value !== undefined && value !== null) receiptFields.append(createElement('dt', '', label), createElement('dd', '', value));
  }
  receiptPanel.append(receiptFields);
  if (exchange.amountWei !== undefined) receiptPanel.append(createElement('p', 'small muted', 'Wei is the smallest unit of ETH: 1 ETH equals 1,000,000,000,000,000,000 wei. These amounts are valueless development money.'));
  resultsPanel.append(receiptPanel);
}
demoForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const rawValues = document.querySelector('#dataset-values').value.split(',').map(value => value.trim());
  const values = rawValues.map(Number);
  document.querySelector('#demo-placeholder').hidden = true;
  resultsPanel.hidden = false;
  if (rawValues.some(value => !/^\d+$/.test(value)) || values.length > 100 || values.some(value => !Number.isSafeInteger(value) || value > 1000000)) {
    resultsPanel.replaceChildren(createElement('p', 'error-message', 'Enter 1–100 whole numbers between 0 and 1,000,000, separated by commas.'));
    executionStatus.textContent = 'CHECK YOUR NUMBERS';
    return;
  }
  runDemoButton.disabled = true;
  runDemoButton.textContent = 'Running exchange…';
  executionStatus.textContent = 'RUNNING LOCALLY';
  resultsPanel.replaceChildren(createElement('p', 'muted', 'The buyer is requesting an offer and checking the payment rules. Observed results will appear when the exchange finishes.'));
  try {
    const response = await fetch('/api/demo', {method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({scenario:document.querySelector('#scenario').value, values})});
    const exchange = await response.json();
    if (!response.ok || exchange.ok === false) throw new Error(exchange.error || exchange.summary || 'The exchange did not complete.');
    showResults(exchange);
    executionStatus.textContent = exchange.scenario === 'budget' ? 'BUDGET PROTECTED' : 'EXECUTION COMPLETE';
  } catch (error) {
    resultsPanel.replaceChildren(createElement('p', 'error-message', error.message || 'Could not reach the local runtime.'));
    executionStatus.textContent = 'EXCHANGE INTERRUPTED';
  } finally {
    runDemoButton.disabled = false;
    const decorativeArrow = createElement('span', '', '↗');
    decorativeArrow.setAttribute('aria-hidden', 'true');
    runDemoButton.replaceChildren(document.createTextNode('Run exchange '), decorativeArrow);
  }
});
checkRuntime();
