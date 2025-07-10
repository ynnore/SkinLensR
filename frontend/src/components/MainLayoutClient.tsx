// src/app/MainLayoutClient.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';

interface MainLayoutClientProps {
  children: React.ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <main
        style={{
          flexGrow: 1,
          marginLeft: `var(${isSidebarOpen ? '--sidebar-width-open' : '--sidebar-width-closed'})`,
          transition: `margin-left var(--transition-speed) ease`,
          padding: '20px',
          boxSizing: 'border-box',
          width: `calc(100% - var(${isSidebarOpen ? '--sidebar-width-open' : '--sidebar-width-closed'}))`,
          overflowY: 'auto',
        }}
      >
        {children}
      </main>
    </div>
  );
}