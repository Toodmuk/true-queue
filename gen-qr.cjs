const QRCode = require('qrcode')
const url = process.argv[2] || 'https://true-service-flow.vercel.app'
const out = process.argv[3] || 'qr-true-service-flow.png'
QRCode.toFile(
  out,
  url,
  { width: 720, margin: 3, color: { dark: '#111111', light: '#ffffff' }, errorCorrectionLevel: 'M' },
  (err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    console.log('QR written:', out, '->', url)
  },
)
