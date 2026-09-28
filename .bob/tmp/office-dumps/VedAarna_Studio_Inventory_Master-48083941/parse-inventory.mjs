import { readFileSync } from "fs";

const lines = readFileSync(
  ".bob/tmp/office-dumps/VedAarna_Studio_Inventory_Master-48083941/data.txt",
  "utf8",
)
  .trim()
  .split("\n");

// Build column map from header row
const colMap = {};
const products = [];
let currentProduct = null;

for (const line of lines) {
  if (!line.trim()) continue;
  if (!line.startsWith("[/SKU Master/")) continue;

  const tabIdx = line.indexOf("\t");
  if (tabIdx === -1) continue;
  const header = line.slice(0, tabIdx);
  const cellPart = line.slice(tabIdx + 1);

  const rowMatch = header.match(/row\[(\d+)\]/);
  if (!rowMatch) continue;
  const rowNum = parseInt(rowMatch[1]);

  const record = {};
  for (const cell of cellPart.split("\t")) {
    const eqIdx = cell.indexOf("=");
    if (eqIdx === -1) continue;
    const key = cell.slice(0, eqIdx);
    const val = cell.slice(eqIdx + 1);
    const col = key.replace(/\d+$/, "");
    record[col] = val;
  }

  if (rowNum === 1) {
    // Header row
    for (const [col, name] of Object.entries(record)) {
      colMap[col] = name;
    }
    console.log("Column Map:", JSON.stringify(colMap, null, 2));
    continue;
  }

  if (rowNum === 2) continue; // skip sub-header if any

  // Only process rows with a Design No
  const designNo = record["B"]; // adjust after seeing colMap
  if (!designNo || designNo.trim() === "") continue;

  products.push({ row: rowNum, ...record });
}

console.log(`\nTotal product rows found: ${products.length}`);
console.log("\nFirst 5 rows sample:");
products.slice(0, 5).forEach((p) => console.log(JSON.stringify(p)));
