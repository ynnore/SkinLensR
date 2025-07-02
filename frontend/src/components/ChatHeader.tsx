// src/components/ChatHeader.tsx
'use client';

import React from 'react';
import { FaBars } from 'react-icons/fa';
import styles from './ChatHeader.module.css';

interface ChatHeaderProps {
  toggleSidebar: () => void;
}

export default function ChatHeader({ toggleSidebar }: ChatHeaderProps) {
  return (
    <header className={styles.chatHeader}>
      <button className={styles.menuButton} onClick={toggleSidebar}>
        <FaBars />
      </button>
      {/* Vous pourriez ajouter un titre ou d'autres contrôles ici plus tard */}
    </header>
  );
}