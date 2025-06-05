// src/components/MainLayoutClient.tsx
"use client";

import { useState, useEffect, ReactNode } from 'react';
import Sidebar from '@/components/Sidebar'; // Assurez-vous que ce chemin est correct et que Sidebar.tsx existe
import { FaBars } from 'react-icons/fa';   // Assurez-vous que react-icons est installé et ce chemin correct

// Si vous avez d'autres fournisseurs de contexte (Providers) qui doivent s'exécuter côté client,
// c'est ici que vous les importeriez et les utiliseriez.
// Par exemple :
// import { ThemeProvider } from 'next-themes';
// import { SessionProvider } from "next-auth/react";

interface MainLayoutClientProps {
  children: ReactNode;
}

export default function MainLayoutClient({ children }: MainLayoutClientProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Mettez à true ou false par défaut selon votre souhait

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (!isMounted) {
    // Vous pourriez retourner un spinner de chargement global ici,
    // ou simplement null pour que rien ne s'affiche tant que le client n'est pas prêt.
    return null;
  }

  return (
    <>
      {/*
        Si vous aviez des fournisseurs de contexte, vous les placeriez ici,
        enveloppant la div principale ou directement le {children} selon le besoin.
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <SessionProvider>
      */}

      <div className="flex h-screen bg-gray-100"> {/* Layout de base avec flex */}
        {/* Assurez-vous que votre composant Sidebar est bien un composant client s'il a de l'interactivité interne */}
        <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white shadow-md p-4">
            <div className="flex items-center">
              <button
                onClick={toggleSidebar}
                className="text-gray-600 focus:outline-none focus:text-gray-800 md:hidden mr-4" // Bouton visible sur mobile/petits écrans, caché sur md et plus
              >
                <FaBars size={24} />
              </button>
              <h1 className="text-xl font-semibold text-gray-700">SkinLensr App</h1>
            </div>
          </header>

          <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
            {children}
          </main>

          {/* Vous pouvez ajouter un footer ici si nécessaire */}
          {/*
          <footer className="bg-gray-200 text-center p-4 text-sm text-gray-600">
            © {new Date().getFullYear()} SkinLensr
          </footer>
          */}
        </div>
      </div>

      {/*
          </SessionProvider>
        </ThemeProvider>
      */}
    </>
  );
}
