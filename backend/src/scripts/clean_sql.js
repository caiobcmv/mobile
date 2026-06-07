const fs = require('fs');
const path = require('path');

const files = [
  path.join(__dirname, '..', '..', 'data_insert.sql'),
  path.join(__dirname, '..', '..', '..', 'banco_atv_complementares', 'seed.sql')
];

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`File does not exist: ${filePath}`);
    return;
  }
  
  console.log(`Checking file: ${filePath}`);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Regex to match from "INSERT INTO audit_logs" or "-- AUDIT_LOGS" up to the next table section or end of file
  // Since SQL inserts end with a semicolon, we can remove the block starting from INSERT INTO audit_logs up to the semicolon.
  const regex = /INSERT\s+INTO\s+audit_logs[\s\S]*?;/gi;
  
  if (regex.test(content)) {
    console.log(`Found INSERT INTO audit_logs in ${filePath}. Removing it...`);
    content = content.replace(regex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Successfully cleaned: ${filePath}`);
  } else {
    console.log(`No INSERT INTO audit_logs found in ${filePath}`);
  }
}

files.forEach(cleanFile);
