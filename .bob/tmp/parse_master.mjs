import fs from "fs";

const lines = fs
  .readFileSync(".bob/tmp/office-dumps/inventory_copy-a96f61d8/data.txt", "utf8")
  .replace(/\r/g, "")
  .trim()
  .split("\n");

const designs = [];
let header = null;

for (const line of lines) {
  if (line.startsWith("=== Sheet:")) continue;
  const match = line.match(/^\[\/[^\/]+\/row\[(\d+)\]\]\s*(.*)$/);
  if (!match) continue;
  const rowNum = parseInt(match[1], 10);
  const rowData = match[2];

  const cells = rowData.split("\t");
  const record = {};
  for (const c of cells) {
    const eqIdx = c.indexOf("=");
    if (eqIdx !== -1) {
      const colLetter = c.slice(0, eqIdx).replace(/\d+$/, "");
      const val = c.slice(eqIdx + 1).trim();
      record[colLetter] = val;
    }
  }

  if (rowNum === 1) {
    header = record;
    continue;
  }

  const dNo = record["A"];
  if (dNo && /^\d+$/.test(dNo)) {
    const dNum = parseInt(dNo, 10);
    if (!designs.some((d) => d.designNo === dNum)) {
      designs.push({
        designNo: dNum,
        modelNo: record["R"] || "",
        name: record["T"] || "",
        garment: record["B"] || "",
        type: record["D"] || "",
        fabric: record["E"] || "",
        color: record["G"] || "",
        sizes: record["I"] || "",
        mrp: record["U"] || "",
        selling: record["V"] || "",
        photoshootStatus: record["X"] || "",
        websiteStatus: record["Y"] || "",
        frontImg: record["Z"] || "",
        sideImg: record["AA"] || "",
        backImg: record["AB"] || "",
        candidImg: record["AC"] || "",
        walkingImg: record["AD"] || "",
        seatedImg: record["AE"] || "",
        fabricImg: record["AF"] || "",
        detailImg: record["AG"] || "",
      });
    }
  }
}

designs.sort((a, b) => a.designNo - b.designNo);

console.log("Total unique designs in Excel sheet:", designs.length);
console.log("\n=== ALL DESIGNS BREAKDOWN ===");
designs.forEach((d) => {
  const dStr = String(d.designNo).padStart(4, "0");
  console.log(
    `Design ${dStr} | Status: [${d.websiteStatus}] | Photoshoot: [${d.photoshootStatus}] | ${d.modelNo} | ${d.name} | ₹${d.selling}/₹${d.mrp}`,
  );
});

const live = designs.filter((d) => d.websiteStatus.toLowerCase() === "live");
const draft = designs.filter((d) => d.websiteStatus.toLowerCase() === "draft");

console.log(`\nLive count: ${live.length}`);
console.log(`Draft count: ${draft.length}`);
