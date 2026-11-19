'use strict';
const result = document.getElementById('result');
addEventListener('securitypolicyviolation', event => {
  result.textContent += JSON.stringify({
    directive: event.violatedDirective, source: event.sourceFile,
    line: event.lineNumber, column: event.columnNumber, sample: event.sample
  }) + '\n';
});
document.createElement('div');
const select = document.createElement('select');
select.setAttribute('aria-label', 'Native dropdown');
for (const text of ['One', 'Two']) {
  const option = document.createElement('option');
  option.textContent = text;
  select.append(option);
}
document.body.append(select);
result.textContent += 'Native dropdown created. Any violation is listed below.\n';
