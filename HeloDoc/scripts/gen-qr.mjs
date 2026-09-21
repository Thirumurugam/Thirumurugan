import https from 'https';
import fs from 'fs';

const appUrl = 'http://10.224.90.137:5000';
const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(appUrl)}&format=png&margin=20&color=1e40af`;

console.log('Fetching QR code for:', appUrl);

const file = fs.createWriteStream('dist/helodoc-qr.png');
https.get(qrApiUrl, (res) => {
  res.pipe(file);
  file.on('finish', () => {
    file.close();
    console.log('✅ QR code saved to dist/helodoc-qr.png');
  });
}).on('error', (e) => {
  console.error('Error downloading QR:', e.message);
  // Fallback: just use white QR
  const fallbackUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(appUrl)}&format=png&margin=20`;
  const file2 = fs.createWriteStream('dist/helodoc-qr.png');
  https.get(fallbackUrl, (res2) => {
    res2.pipe(file2);
    file2.on('finish', () => {
      file2.close();
      console.log('✅ QR code saved (fallback)');
    });
  });
});
