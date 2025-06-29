// src/components/icons/KiwiIcon.tsx

import React from 'react';

// Ce composant contient un chemin SVG propre et complet pour une silhouette de kiwi.
const KiwiIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    {...props}
  >
    <path d="M14.5,10.5a1.5,1.5,0,1,0,1.5,1.5A1.5,1.5,0,0,0,14.5,10.5Zm9.21,5.55c-1.37,2-4.5,4-11.71,4S-0.2,18,1.29,16.05l1.41-1.41c1,1.17,3.37,2.61,9.3,2.61s8.29-1.44,9.3-2.61l1.41,1.41ZM13,12a1,1,0,1,1-1-1A1,1,0,0,1,13,12ZM14.75,8.5a1.5,1.5,0,0,0-3.5,0L9.84,9.91a3.45,3.45,0,0,1,4.32,0Z" />
  </svg>
);

export default KiwiIcon;