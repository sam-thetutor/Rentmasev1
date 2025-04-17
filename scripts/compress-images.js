import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = path.join(__dirname, '../src/rentmase_frontend/public/images');
const OUTPUT_DIR = path.join(__dirname, '../src/rentmase_frontend/dist/images');

async function compressImage(inputPath, outputPath) {
  try {
    // Create all parent directories of the output file
    const outputDir = path.dirname(outputPath);
    fs.mkdirSync(outputDir, { recursive: true });

    await sharp(inputPath)
      .resize(1200, 1200, { // Max dimensions
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: 80 }) // Convert to WebP with 80% quality
      .toFile(outputPath.replace(/\.(png|jpg|jpeg)$/, '.webp'));
    
    console.log(`Compressed: ${inputPath} -> ${outputPath}`);
  } catch (error) {
    console.error(`Error compressing ${inputPath}:`, error);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const inputPath = path.join(dirPath, file);
    const relativePath = path.relative(INPUT_DIR, dirPath);
    const outputPath = path.join(OUTPUT_DIR, relativePath, file);
    
    if (fs.statSync(inputPath).isDirectory()) {
      processDirectory(inputPath);
    } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
      compressImage(inputPath, outputPath);
    }
  });
}

// Ensure base output directory exists
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

processDirectory(INPUT_DIR); 