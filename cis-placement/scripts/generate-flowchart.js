const fs = require('fs');
const path = require('path');

const modelPath = path.join(__dirname, '..', 'src', 'components', 'model.json');
const outPath = path.join(__dirname, '..', 'diagrams', 'flowchart.mmd');

function idify(s, fallback) {
  if (!s) return fallback || 'node';
  return String(s)
    .replace(/<[^>]*>/g, '')
    .replace(/[`"']/g, '')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
}

function labelEscape(s) {
  if (!s) return '';
  return String(s)
    .replace(/\n/g, ' ')
    .replace(/\[/g, '(')
    .replace(/\]/g, ')')
    .replace(/\{/g, '(')
    .replace(/\}/g, ')')
    .replace(/"/g, "'")
    .slice(0, 120);
}

const raw = fs.readFileSync(modelPath, 'utf8');
const model = JSON.parse(raw);
const pages = model.pages || [];

let lines = [];
lines.push('flowchart TD');
lines.push('  Start([Start])');

// create nodes and include question titles for each page
const pageIds = pages.map((p, i) => {
  const title = p.title || p.name || `page_${i}`;
  const id = idify(title, `page_${i}`);

  // collect question titles (skip html/expression elements)
  const questions = (p.elements || [])
    .filter(e => e && e.type && e.type !== 'html' && e.type !== 'expression')
    .map(e => e.title || e.name || e.label || '')
    .filter(Boolean)
    .map(q => labelEscape(q).slice(0, 80));

  let label = labelEscape(title);
  if (questions.length) {
    label += '<br/>' + questions.map(q => `• ${q}`).join('<br/>');
  }

  lines.push(`  ${id}["${label}"]`);
  return { id, title, visibleIf: p.visibleIf };
});

// link start to first page
if (pageIds.length > 0) {
  lines.push(`  Start --> ${pageIds[0].id}`);
}

for (let i = 0; i < pageIds.length; i++) {
  const cur = pageIds[i];
  const next = pageIds[i + 1];
  if (cur.visibleIf) {
    const decId = `dec_${i}`;
    const cond = labelEscape(cur.visibleIf);
    lines.push(`  ${decId}{"${cond}"}`);
    // find previous node to point to this decision
    const prevId = i === 0 ? 'Start' : pageIds[i - 1].id;
    lines.push(`  ${prevId} --> ${decId}`);
    // Create explicit yes/no intermediate nodes to avoid arrow-label syntax
    const yesNode = `${decId}_yes`;
    const noNode = `${decId}_no`;
    lines.push(`  ${yesNode}["yes"]`);
    lines.push(`  ${noNode}["no"]`);
    lines.push(`  ${decId} --> ${yesNode}`);
    lines.push(`  ${yesNode} --> ${cur.id}`);
    if (next) {
      lines.push(`  ${decId} --> ${noNode}`);
      lines.push(`  ${noNode} --> ${next.id}`);
    } else {
      lines.push(`  ${decId} --> ${noNode}`);
      lines.push(`  ${noNode} --> Finish([Finish])`);
    }
  } else {
    // simple sequential link from previous to current (if prev exists)
    if (i > 0) {
      const prevId = pageIds[i - 1].id;
      lines.push(`  ${prevId} --> ${cur.id}`);
    }
    // if last page, link to finish
    if (!next) {
      lines.push(`  ${cur.id} --> Finish([Finish])`);
    }
  }
}

// Add some styling
lines.push('  style Start fill:#f9f,stroke:#333,stroke-width:1px');
lines.push('  style Finish fill:#9f9,stroke:#333,stroke-width:1px');

const out = lines.join('\n') + '\n';
// ensure diagrams dir exists
const dir = path.dirname(outPath);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(outPath, out, 'utf8');
console.log('Wrote', outPath);
