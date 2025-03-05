/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
      // domains: ['i.ytimg.com'], // Removendo a restrição de domínios
      remotePatterns: [ // Adicionando remotePatterns para aceitar qualquer domínio
        {
          protocol: 'http',
          hostname: '**',
          port: '',
          pathname: '**',
        },
        {
          protocol: 'https',
          hostname: '**',
          port: '',
          pathname: '**',
        },
      ],
    },
  };

export default nextConfig;