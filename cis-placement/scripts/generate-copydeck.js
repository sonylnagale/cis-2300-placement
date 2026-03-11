const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '..', 'src', 'components', 'model.json');
const outPath = path.join(__dirname, '..', 'copy-deck.rtf');

function rtfEscape(s) {
  if (s === null || s === undefined) return '';
  return String(s)
    .replace(/\\/g, '\\\\')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\n/g, '\\par ');
}

const raw = fs.readFileSync(modelPath, 'utf8');
const model = JSON.parse(raw);
const pages = model.pages || [];

let rtf = '';
rtf += '{\\rtf1\\ansi\\deff0{\\fonttbl{\\f0 Arial;}}\n';
rtf += '\\f0\\fs24\n';
rtf += rtfEscape('Copy Deck - CIS 2300 Self-Placement') + '\\par\\par\n';

pages.forEach((p, idx) => {
  const pageTitle = p.title || p.name || `page_${idx+1}`;
  rtf += '{\\b ' + rtfEscape(pageTitle) + '}\\par\\par\n';

  if (p.elements && p.elements.length) {
    p.elements.forEach((el, j) => {
      const elType = el.type || '';
      const elName = el.name || '';
      const elTitle = el.title || '';

      rtf += '{\\i ' + rtfEscape(elType + (elName ? ' — ' + elName : '')) + '}\\par\n';

      if (el.title) {
        rtf += rtfEscape('Question: ' + el.title) + '\\par\n';
      }

      if (el.html) {
        // strip simple tags for readability
        const text = el.html.replace(/<[^>]+>/g, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/&amp;/g, '&');
        rtf += rtfEscape(text) + '\\par\n';
      }

      if (el.choices && Array.isArray(el.choices)) {
        rtf += rtfEscape('Choices:') + '\\par\n';
        el.choices.forEach(choice => {
          const text = choice.text || choice.value || JSON.stringify(choice);
          rtf += rtfEscape('  - ' + text) + '\\par\n';
        });
      }

      if (el.expression) {
        rtf += rtfEscape('Expression: ' + el.expression) + '\\par\n';
      }

      rtf += '\\par\n';
    });
  }

  rtf += '\\par\n';
});

rtf += '\\par\\par Generated from src/components/model.json\\par\n';
rtf += '}\n';

fs.writeFileSync(outPath, rtf, 'utf8');
console.log('Wrote', outPath);
