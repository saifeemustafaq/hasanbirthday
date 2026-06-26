const QRCode = require('qrcode');
const { Resvg } = require('@resvg/resvg-js');
const fs = require('fs');
const path = require('path');

// #1–#15 → /winner/1 … /winner/15
// #16    → homepage (the "general" link)
const entries = [
  ...Array.from({ length: 15 }, (_, i) => ({
    label: `#${i + 1}`,
    url: `https://hasangolwala.netlify.app/winner/${i + 1}`,
    folder: `winner-${String(i + 1).padStart(2, '0')}`,
  })),
  {
    label: '#16',
    url: 'https://hasangolwala.netlify.app/',
    folder: 'winner-16',
  },
];

/**
 * Takes a plain QR SVG string and returns a new SVG with a bold
 * label (e.g. "#3") centred below the QR code.
 */
function svgWithLabel(svgString, label) {
  const match = svgString.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  if (!match) throw new Error('Could not parse SVG viewBox');

  const w = parseFloat(match[1]);
  const h = parseFloat(match[2]);
  const textAreaH = h * 0.14;        // ~14% of QR height for the label strip
  const newH = h + textAreaH;
  const fontSize = textAreaH * 0.70; // font fills ~70% of the strip height

  return svgString
    .replace(
      /viewBox="0 0 [\d.]+ [\d.]+"/,
      `viewBox="0 0 ${w} ${newH}"`
    )
    .replace(
      '</svg>',
      `<rect x="0" y="${h}" width="${w}" height="${textAreaH}" fill="#ffffff"/>` +
      `<text ` +
        `x="${w / 2}" ` +
        `y="${h + textAreaH * 0.82}" ` +
        `font-size="${fontSize}" ` +
        `font-family="Arial, Helvetica, sans-serif" ` +
        `font-weight="bold" ` +
        `text-anchor="middle" ` +
        `fill="#000000"` +
      `>${label}</text></svg>`
    );
}

/**
 * Rasterises an SVG string to a PNG Buffer at the given width (px).
 * Uses @resvg/resvg-js — pure WASM, no native deps required.
 */
function svgToPng(svgString, widthPx = 600) {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: 'width', value: widthPx },
  });
  return resvg.render().asPng();
}

async function main() {
  const outputRoot = path.join(__dirname, 'qr_codes');

  for (const entry of entries) {
    const dir = path.join(outputRoot, entry.folder);
    fs.mkdirSync(dir, { recursive: true });

    const plainSvg = await QRCode.toString(entry.url, {
      type: 'svg',
      margin: 4,
      color: { dark: '#000000', light: '#ffffff' },
    });

    const labeledSvg = svgWithLabel(plainSvg, entry.label);

    fs.writeFileSync(path.join(dir, 'qr.svg'), plainSvg);
    fs.writeFileSync(path.join(dir, 'qr-labeled.svg'), labeledSvg);
    fs.writeFileSync(path.join(dir, 'qr.png'), svgToPng(plainSvg));
    fs.writeFileSync(path.join(dir, 'qr-labeled.png'), svgToPng(labeledSvg));

    console.log(`  ${entry.folder}  ${entry.label}  ${entry.url}`);
  }

  console.log(`\nDone — 64 files written to qr/qr_codes/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
