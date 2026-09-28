import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

dotenv.config();

const ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const BUCKET_NAME = process.env.R2_BUCKET_NAME || "vedaarna-products";
const CDN_DOMAIN = process.env.R2_CDN_DOMAIN || "https://cdn.vedaarnastudio.com";

if (!ACCOUNT_ID || !ACCESS_KEY_ID || !SECRET_ACCESS_KEY) {
  console.error(
    "Missing R2 credentials. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY in .env",
  );
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});

const PHOTOS_DIR = path.resolve(process.cwd(), "src/assets/Photo_Shoots");

async function uploadFile(fileName: string) {
  const filePath = path.join(PHOTOS_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: `products/${fileName}`,
    Body: fileBuffer,
    ContentType: contentType,
  });

  await s3.send(command);
  console.log(`✓ Uploaded: ${fileName} -> ${CDN_DOMAIN}/products/${fileName}`);
}

// Design numbers to upload — update this range as new batches arrive.
// Designs 0001–0027 are already live in PostgreSQL & CDN.
// Designs 0028–0034 are in 'Draft' status and ready for CDN upload.
const DESIGN_RANGE = { from: 28, to: 34 };

function isInRange(fileName: string): boolean {
  // Extract the 4-digit design number from filenames like VS-SUT-2PC-0012-PYL-26-01-FR.png
  const match = fileName.match(/-(\d{4})-/);
  if (!match) return false;
  const num = parseInt(match[1], 10);
  return num >= DESIGN_RANGE.from && num <= DESIGN_RANGE.to;
}

async function main() {
  console.log(`Starting R2 upload from: ${PHOTOS_DIR}`);
  console.log(`Target Bucket: ${BUCKET_NAME}`);
  console.log(`CDN URL: ${CDN_DOMAIN}`);
  console.log(
    `Design range: ${String(DESIGN_RANGE.from).padStart(4, "0")}–${String(DESIGN_RANGE.to).padStart(4, "0")}\n`,
  );

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`Photos directory not found at: ${PHOTOS_DIR}`);
    process.exit(1);
  }

  const allFiles = fs.readdirSync(PHOTOS_DIR).filter((f) => /\.(png|jpe?g|webp)$/i.test(f));
  const files = allFiles.filter(isInRange);

  console.log(
    `Found ${allFiles.length} total images; uploading ${files.length} in design range.\n`,
  );

  let count = 0;
  for (const file of files) {
    try {
      await uploadFile(file);
      count++;
    } catch (err) {
      console.error(`✗ Error uploading ${file}:`, err);
    }
  }

  console.log(
    `\n🎉 Upload completed! ${count}/${files.length} images uploaded to ${CDN_DOMAIN}/products/`,
  );
}

main().catch(console.error);
