'use client';

import { usePathname } from 'next/navigation';
import Navbar from "./Navbar";

const DynamicDiv = () => {
  const pathname = usePathname();

  return (
    <div style={{ position: pathname.startsWith('/catalogo') ? 'relative' : 'absolute', top: 0, left: 0, width: '100%', zIndex: 10 }}>
         <Navbar />
    </div>
  );
};

export default DynamicDiv;