/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración standalone requerida para Docker
  output: 'standalone',
  
  // Configuración de imágenes remotas si las necesitas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Deshabilitar telemetría
  telemetry: {
    enabled: false,
  },
};

module.exports = nextConfig;
