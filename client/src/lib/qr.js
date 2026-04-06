import QRCode from 'qrcode';

export async function generateQR(text) {
  return QRCode.toDataURL(text, {
    width: 280,
    margin: 2,
    color: { dark: '#1a1a2e', light: '#ffffff' }
  });
}
