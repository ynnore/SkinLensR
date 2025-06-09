"use client";

import { useState } from 'react';
import styles from './page.module.css';
import { FaPaperclip, FaImage, FaKeyboard, FaMicrophone, FaUser, FaRobot } from 'react-icons/fa';

const ChatInterface = () => {
  const mockMessages = [
    { role: 'user', content: 'test' },
    { role: 'assistant', content: 'Il semble que vous effectuez un test. Si vous avez besoin d\'assistance, n\'hésitez pas à me le faire savoir.' }
  ];

  return (
    <div className={styles.chatContainer}>
      <header className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <span>Scan</span>
          <h1>App Development on Nano Jetson Orin</h1>
        </div>
        <div className={styles.headerRight}>
          <button className={styles.moreButton}>...</button>
          <button className={styles.shareButton}>3d</button>
        </div>
      </header>
      
      <div className={styles.messagesArea}>
        {mockMessages.map((msg, index) => (
          <div key={index} className={`${styles.messageBubble} ${msg.role === 'user' ? styles.userMessage : styles.assistantMessage}`}>
            <div className={styles.avatar}>
              {msg.role === 'user' ? <FaUser /> : <div className={styles.robotAvatar}>H</div>}
            </div>
            <p className={styles.messageContent}>{msg.content}</p>
          </div>
        ))}
      </div>
      
      <footer className={styles.pageFooter}>
        <div className={styles.inputWrapper}>
          <button className={styles.iconButton}><FaPaperclip /></button>
          <input type="text" placeholder="Type your message..." />
        </div>
        <div className={styles.footerActions}>
          <button className={styles.iconButton}><FaImage /></button>
          <button className={styles.iconButton}><FaKeyboard /></button>
          <button className={styles.iconButton}><FaMicrophone /></button>
          <div className={styles.moderateDropdown}><span>Moderate</span><span>▼</span></div>
          <button className={styles.sendButton}>↑</button>
        </div>
      </footer>
    </div>
  );
};

export default function HomePage() {
  return (
    <div className={styles.mainPageContainer}>
      <ChatInterface />
    </div>
  );
}