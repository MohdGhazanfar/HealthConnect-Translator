/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    RESPONSIVE_VOICE_KEY: process.env.RESPONSIVE_VOICE_KEY,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://code.responsivevoice.org; connect-src 'self' https://texttospeech.responsivevoice.org; media-src 'self' blob: https://texttospeech.responsivevoice.org"
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig 