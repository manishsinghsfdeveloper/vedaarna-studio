import { readFileSync } from "fs";

const lines = readFileSync(
  ".bob/tmp/office-dumps/VedAarna_Studio_Inventory_Master-48083941/data.txt",
  "utf8",
)
  .trim()
  .split("\n");

const colMap = {};
const products = [];

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
    const val = cell.slice(eqIdx + 1).trim();
    const col = key.replace(/\d+$/, "");
    record[col] = val;
  }

  if (rowNum === 1) {
    for (const [col, name] of Object.entries(record)) {
      colMap[col] = name;
    }
    continue;
  }

  if (rowNum === 2) continue; // skip if sub-header

  const modelNo = record["R"];
  if (!modelNo || modelNo.trim() === "") continue;

  // Extract design number from model number like VS-SUT-3PC-0012-PYL-26 -> 0012
  const designMatch = modelNo.match(/-(\d{4})-/);
  const designNo = designMatch ? parseInt(designMatch[1]) : 0;

  products.push({
    row: rowNum,
    designNo,
    garmentType: record["B"] || "",
    typeCode: record["C"] || "",
    setType: record["D"] || "",
    fabric: record["E"] || "",
    fabricCode: record["F"] || "",
    color: record["G"] || "",
    colorCode: record["H"] || "",
    sizes: record["I"] || "",
    year: record["J"] || "",
    pattern: record["K"] || "",
    neckType: record["L"] || "",
    description: record["M"] || "",
    pocket: record["N"] || "",
    stock: record["O"] || "",
    hsnCode: record["P"] || "",
    gst: record["Q"] || "",
    modelNumber: record["R"] || "",
    sellableSku: record["S"] || "",
    productName: record["T"] || "",
    mrp: record["U"] || "",
    sellingPrice: record["V"] || "",
    cost: record["W"] || "",
    photoshootStatus: record["X"] || "",
    websiteStatus: record["Y"] || "",
    img01Front: record["Z"] || "",
    img02Side: record["AA"] || "",
    img03Back: record["AB"] || "",
    img04Candid: record["AC"] || "",
    img05Walking: record["AD"] || "",
    img06Seated: record["AE"] || "",
    imgFabricCloseup: record["AF"] || "",
    imgDetail: record["AG"] || "",
  });
}

// Sort by design number
products.sort((a, b) => a.designNo - b.designNo);

console.log(`Total products: ${products.length}\n`);

// Separate by website status
const liveProducts = products.filter((p) => p.websiteStatus === "Live");
const draftProducts = products.filter((p) => p.websiteStatus === "Draft");

console.log(`=== LIVE Products (${liveProducts.length}) ===`);
liveProducts.forEach((p) => {
  console.log(
    `  Design ${String(p.designNo).padStart(4, "0")} | ${p.modelNumber} | ${p.productName}`,
  );
});

console.log(`\n=== DRAFT Products (${draftProducts.length}) - Need to go Live ===`);
draftProducts.forEach((p) => {
  console.log(
    `  Design ${String(p.designNo).padStart(4, "0")} | ${p.modelNumber} | ${p.productName}`,
  );
  console.log(
    `    Garment: ${p.garmentType} (${p.setType}) | Fabric: ${p.fabric} | Color: ${p.color}`,
  );
  console.log(`    Sizes: ${p.sizes} | MRP: ₹${p.mrp} | Selling: ₹${p.sellingPrice}`);
  console.log(
    `    Images: FR=${p.img01Front || "MISSING"}, SD=${p.img02Side || "MISSING"}, BK=${p.img03Back || "MISSING"}`,
  );
  console.log(
    `            CD=${p.img04Candid || "MISSING"}, WK=${p.img05Walking || "MISSING"}, ST=${p.img06Seated || "MISSING"}`,
  );
  console.log(`            FB=${p.imgFabricCloseup || "N/A"}, DT=${p.imgDetail || "N/A"}`);
  console.log(`    Photoshoot Status: ${p.photoshootStatus}`);
  console.log("");
});

// Products with Design 0012-0028
const newProducts = products.filter((p) => p.designNo >= 12 && p.designNo <= 28);
console.log(`\n=== Products Design 0012-0028 (${newProducts.length}) ===`);
newProducts.forEach((p) => {
  const status = p.websiteStatus;
  console.log(`  [${status}] Design ${String(p.designNo).padStart(4, "0")} | ${p.modelNumber}`);
  console.log(`    Name: ${p.productName}`);
  console.log(`    Photoshoot: ${p.photoshootStatus}`);
});

// All images needed for draft products
console.log("\n=== All image filenames for DRAFT products ===");
draftProducts.forEach((p) => {
  const imgs = [
    p.img01Front,
    p.img02Side,
    p.img03Back,
    p.img04Candid,
    p.img05Walking,
    p.img06Seated,
    p.imgFabricCloseup,
    p.imgDetail,
  ].filter(Boolean);
  imgs.forEach((img) => console.log(img));
});
