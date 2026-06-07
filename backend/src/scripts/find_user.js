const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', '..', 'data_insert.sql'),
  path.join(__dirname, '..', '..', '..', 'banco_atv_complementares', 'seed.sql')
];

files.forEach(filePath => {
  if (!fs.existsSync(filePath)) return;
  console.log(`Searching in: ${filePath}`);
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('natalia.rocha') || line.includes('viviane.assis')) {
      console.log(`Line ${idx + 1}: ${line.substring(0, 300)}...`);
    }
  });
});
