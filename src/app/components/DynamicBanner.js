// src/app/components/DynamicBanner.js
'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import backgroundLP from '../../../public/backgroundLP.png'; // Import from public directory using /
// Import other banner images as needed (bannerImageCatalogo, bannerImageContato, bannerImageDefault)

const DynamicBanner = () => {
  const pathname = usePathname();

  let bannerImage;

  switch (pathname) {
    case '/':
      bannerImage = backgroundLP;
      break;
    case '/catalogo':
      // Import and assign your catalogo banner image here
      // For example: import bannerCatalogo from '/bannerCatalogo.png';
      // bannerImage = bannerCatalogo;
      bannerImage = null; // Placeholder - replace with your actual image and import
      break;
    case '/contato':
      // Import and assign your contato banner image here
      // For example: import bannerContato from '/bannerContato.png';
      // bannerImage = bannerContato;
      bannerImage = null; // Placeholder - replace with your actual image and import
      break;
    default:
      // Import and assign your default banner image here
      // For example: import bannerDefault from '/bannerDefault.png';
      // bannerImage = bannerDefault;
      bannerImage = null; // Placeholder - replace with your actual image and import
  }

  if (!bannerImage) {
    return null; // Or render a default if needed
  }

  return (
    <div style={{ width: '100%', overflow: 'hidden' }}>
      <Image
        src={bannerImage}
        alt="Banner"
        style={{ width: '100%', height: 'auto' }}
        priority
      />
    </div>
  );
};

export default DynamicBanner;