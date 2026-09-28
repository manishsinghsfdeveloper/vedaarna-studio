/**
 * Upload Women_Of_VedAarna client photos to Cloudflare R2.
 *
 * Creates the folder:  vedaarna-products / Women_Of_VedAarna/
 *
 * After upload, images are served at:
 *   https://cdn.vedaarnastudio.com/Women_Of_VedAarna/Client_Pic1.png
 *
 * USAGE:
 *   npx tsx scripts/upload-women-images-to-r2.ts
 *
 * Requires in .env (or .env.local):
 *   R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY
 *   R2_BUCKET_NAME  (default: vedaarna-products)
 *   R2_CDN_DOMAIN   (default: https://cdn.vedaarnastudio.com)
 */

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

// Source folder: src/assets/Women_Of_VedAarna/
const PHOTOS_DIR = path.resolve(process.cwd(), "src/assets/Women_Of_VedAarna");
// R2 destination prefix — this becomes the "folder" in the bucket
const R2_PREFIX = "Women_Of_VedAarna";

async function uploadFile(fileName: string): Promise<string> {
  const filePath = path.join(PHOTOS_DIR, fileName);
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(fileName).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".jpg" || ext === ".jpeg"
        ? "image/jpeg"
        : "application/octet-stream";

  const r2Key = `${R2_PREFIX}/${fileName}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: r2Key,
    Body: fileBuffer,
    ContentType: contentType,
    // Cache for 1 year — these images won't change
    CacheControl: "public, max-age=31536000, immutable",
  });

  await s3.send(command);
  const cdnUrl = `${CDN_DOMAIN}/${r2Key}`;
  console.log(`✓ ${fileName}  →  ${cdnUrl}`);
  return cdnUrl;
}

async function main() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("  VedAarna — Women Of VedAarna Image Upload");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`  Source : ${PHOTOS_DIR}`);
  console.log(`  Bucket : ${BUCKET_NAME}`);
  console.log(`  Prefix : ${R2_PREFIX}/`);
  console.log(`  CDN    : ${CDN_DOMAIN}/${R2_PREFIX}/`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  if (!fs.existsSync(PHOTOS_DIR)) {
    console.error(`✗ Source directory not found: ${PHOTOS_DIR}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(PHOTOS_DIR)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort(); // upload in alphabetical order (Client_Pic1 … Client_Pic14)

  if (files.length === 0) {
    console.error("✗ No image files found in the source directory.");
    process.exit(1);
  }

  console.log(`Found ${files.length} images to upload:\n`);

  const cdnUrls: Record<string, string> = {};
  let uploaded = 0;

  for (const file of files) {
    try {
      cdnUrls[file] = await uploadFile(file);
      uploaded++;
    } catch (err) {
      console.error(`✗ Error uploading ${file}:`, err);
    }
  }

  console.log(
    `\n🎉 Done! ${uploaded}/${files.length} images uploaded to ${CDN_DOMAIN}/${R2_PREFIX}/`,
  );

  // Print the ready-to-paste CDN URL map for copy/paste into the source code
  console.log("\n── Copy these CDN URLs into your components ──\n");
  for (const [file, url] of Object.entries(cdnUrls)) {
    const varName = file.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9]/g, "_");
    console.log(`// ${varName}`);
    console.log(`"${url}",`);
  }
}

main().catch(console.error);
