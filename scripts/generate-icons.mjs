import sharp from "sharp";
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const sizes = [192, 512];

async function generate() {
	// Create an SVG icon: a rounded square with a checkmark
	const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#6366f1"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="96" fill="url(#bg)"/>
  <g transform="translate(256,256) scale(0.65) translate(-256,-256)">
    <path d="M128 288l96 96 160-160" fill="none" stroke="white" stroke-width="48" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
</svg>`;

	for (const size of sizes) {
		const pngBuffer = await sharp(Buffer.from(svgIcon))
			.resize(size, size)
			.png()
			.toBuffer();
		writeFileSync(join(publicDir, `pwa-${size}x${size}.png`), pngBuffer);
		console.log(`✓ Generated pwa-${size}x${size}.png`);
	}
}

generate().catch(console.error);
