// src/app/page.tsx
'use client'; // Nécessaire pour les hooks React côté client

import { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import styles from './Page.module.css'; // <--- ASSUREZ-VOUS QUE CET IMPORT EST LÀ

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai' | 'system';
}

export default function ChatPage() {
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSendDisabled, setIsSendDisabled] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState<boolean>(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Pour l'auto-scroll

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;
    setUserInput(value);
    setIsSendDisabled(value.trim() === "");
  };

  const addMessageToList = (text: string, sender: Message['sender']) => {
    const newMessage: Message = {
      id: Date.now().toString() + `-${sender}`,
      text,
      sender,
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSendDisabled || !userInput.trim()) return;
    
    const currentMessageText = userInput;
    addMessageToList(currentMessageText, 'user');
    setUserInput("");
    setIsSendDisabled(true);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentMessageText }),
      });
      if (!response.ok) throw new Error(`Erreur API chat: ${response.status}`);
      const aiData = await response.json();
      addMessageToList(aiData.reply || "Pas de réponse de l'IA.", 'ai');
    } catch (error) {
      console.error("Erreur chat:", error);
      addMessageToList(`Désolé, une erreur est survenue lors du chat. ${error instanceof Error ? error.message : String(error)}`, 'system');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelectedForDetection = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    addMessageToList(`Analyse de l'image : ${file.name}...`, 'system');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://localhost:5000/api/detect-skin", {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Réponse invalide du serveur' }));
        throw new Error(errorData.error || `Erreur de détection: ${response.status}`);
      }
      
      const data = await response.json();
      
      let resultHtml = `<h3>Résultats de la Détection :</h3>`;
      resultHtml += `<p><strong>Maladie/Condition :</strong> ${data.disease || 'N/A'}</p>`;
      resultHtml += `<p><strong>Précision :</strong> ${data.accuracy ? `${data.accuracy}%` : 'N/A'}</p>`;
      resultHtml += `<p><strong>Suggestion :</strong> ${data.medicine || 'N/A'}</p>`;
      if (data.render_page_url) {
        // Utilisation de classes globales pour le HTML injecté
        resultHtml += `<p class="mt-4-global"><a href="${data.render_page_url}" target="_blank" class="link-style-global">Voir le Jumeau Numérique</a></p>`;
      } else if (data.render_error) {
        resultHtml += `<p class="mt-4-global text-red-500-global">Jumeau Numérique: ${data.render_error}</p>`;
      }
      addMessageToList(resultHtml, 'ai');

    } catch (error) {
      console.error("Erreur lors de l'analyse de l'image:", error);
      addMessageToList(`Erreur d'analyse de l'image: ${error instanceof Error ? error.message : String(error)}`, 'system');
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };
  
  const openCameraModal = async () => {
    setCapturedImage(null);
    setIsCameraModalOpen(true);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        addMessageToList("Votre navigateur ne supporte pas l'accès à la caméra.", 'system');
        setIsCameraModalOpen(false);
      }
    } catch (err) {
      console.error("Erreur d'accès à la caméra:", err);
      let errorMessage = "Erreur d'accès à la caméra.";
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") errorMessage = "Permission d'accès à la caméra refusée. Veuillez vérifier les paramètres de votre navigateur.";
        else if (err.name === "NotFoundError") errorMessage = "Aucune caméra compatible n'a été trouvée.";
      }
      addMessageToList(errorMessage, 'system');
      setIsCameraModalOpen(false);
    }
  };

  const closeCameraModal = () => {
    if (stream) stream.getTracks().forEach(track => track.stop());
    setStream(null);
    setIsCameraModalOpen(false);
    setCapturedImage(null);
  };

  const handleCapturePhoto = () => {
    if (videoRef.current && canvasRef.current && stream) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth; 
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageDataUrl);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
      }
    }
  };

  const handleSendCapturedPhoto = async () => {
    if (!capturedImage) return;
    addMessageToList("Analyse de la photo capturée...", 'system');
    setIsLoading(true);
    setIsCameraModalOpen(false);

    const fetchRes = await fetch(capturedImage);
    const blob = await fetchRes.blob();
    const file = new File([blob], "captured_photo.jpg", { type: "image/jpeg" });
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch("http://localhost:5000/api/detect-skin", {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: 'Réponse invalide du serveur'}));
        throw new Error(errorData.error || `Erreur de détection (photo capturée): ${response.status}`);
      }
      const data = await response.json();
      let resultHtml = `<h3>Résultats de la Détection (Photo Capturée) :</h3>`;
      resultHtml += `<p><strong>Maladie/Condition :</strong> ${data.disease || 'N/A'}</p>`;
      resultHtml += `<p><strong>Précision :</strong> ${data.accuracy ? `${data.accuracy}%` : 'N/A'}</p>`;
      resultHtml += `<p><strong>Suggestion :</strong> ${data.medicine || 'N/A'}</p>`;
      if (data.render_page_url) {
        resultHtml += `<p class="mt-4-global"><a href="${data.render_page_url}" target="_blank" class="link-style-global">Voir le Jumeau Numérique</a></p>`;
      } else if (data.render_error) {
        resultHtml += `<p class="mt-4-global text-red-500-global">Jumeau Numérique: ${data.render_error}</p>`;
      }
      addMessageToList(resultHtml, 'ai');
    } catch (error) {
      console.error("Erreur lors de l'analyse de la photo capturée:", error);
      addMessageToList(`Erreur d'analyse de la photo capturée: ${error instanceof Error ? error.message : String(error)}`, 'system');
    } finally {
      setIsLoading(false);
      setCapturedImage(null);
    }
  };

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  const handleUpload3DImage = () => console.log("Upload Image 3D cliqué - à implémenter");
  const handleRecordAudio = () => console.log("Record Audio cliqué - à implémenter");
  const handleThumbsUp = () => console.log("Thumbs Up cliqué - à implémenter");
  const handleThumbsDown = () => console.log("Thumbs Down cliqué - à implémenter");
  const handleNewChat = () => {
    setMessages([]);
    setUserInput("");
    setIsSendDisabled(true);
    closeCameraModal();
  };

  const getMessageBubbleClassName = (sender: Message['sender']) => {
    let className = styles.messageBubble;
    if (sender === 'user') {
      className += ` ${styles.messageUser}`;
    } else if (sender === 'ai') {
      className += ` ${styles.messageAi}`;
    } else if (sender === 'system') {
      className += ` ${styles.messageSystem}`;
    }
    return className;
  };


  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelectedForDetection}
        accept="image/*"
        style={{ display: 'none' }}
      />
      
      {isCameraModalOpen && (
        // Ces classes sont globales ou définies dans globals.css
        <div className="camera-modal-overlay">
          <div className="camera-modal-content">
            <h2>Prendre une photo</h2>
            {!capturedImage && stream && (
              <video ref={videoRef} autoPlay playsInline muted className="webcam-preview"></video>
            )}
            {capturedImage && (
              <img src={capturedImage} alt="Photo capturée" className="captured-image-preview" />
            )}
            <div className="camera-modal-actions">
              {!capturedImage && stream && (
                <button onClick={handleCapturePhoto} className="btn-capture">Capturer</button>
              )}
              {capturedImage && (
                <button onClick={handleSendCapturedPhoto} className="btn-send-capture">Analyser cette photo</button>
              )}
              <button onClick={closeCameraModal} className="btn-close-modal">Annuler</button>
            </div>
          </div>
          <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
      )}

      <div className={styles.chatContainer}>
        <aside className={styles.sidebar}>
          <button id="newChatButton" className={styles.sidebarButton} onClick={handleNewChat}>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
            </svg>
            SkinLensR
          </button>
          <div className={styles.sidebarFooter}>
            {/* Liens ou informations supplémentaires */}
          </div>
        </aside>

        <main className={styles.chatMainArea}>
          <div className={styles.mainChatHeader}>
            <div className={styles.headerBrandName}>SkinLensR AI</div>
            <div className={styles.userProfileIconContainer}>
              <div className={styles.userProfileIcon}>U</div>
            </div>
          </div>
          
          <div id="chatMessagesDisplayArea" className={styles.chatgptMessagesArea}>
            {messages.length === 0 && !isLoading && !isCameraModalOpen && (
              <div className={styles.emptyChatContainer} id="emptyChatPlaceholder">
                <h2>Que pouvons-nous faire pour vous ?</h2>
                <p className={styles.disclaimerText}>
                  Ceci est une IA expérimentale. Les informations peuvent être incorrectes ou incomplètes. Vérifiez toujours les informations importantes.
                  Pour l'analyse 3D, veuillez téléverser une image claire de l'objet sur un fond neutre.
                </p>
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={getMessageBubbleClassName(msg.sender)}>
                <div dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
            <div ref={messagesEndRef} /> {/* Pour l'auto-scroll */}
            {isLoading && (
              <div className={`${styles.messageBubble} ${styles.messageSystem}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div className={styles.spinner}></div> {/* Spinner CSS pur */}
                  <span style={{ marginLeft: '8px' }}>Traitement en cours...</span>
                </div>
              </div>
            )}
          </div>

          <div className={styles.chatInputArea}>
            <form id="chatForm" className={styles.chatForm} onSubmit={handleSubmit}>
              <div className={styles.inputWrapper}>
                <textarea
                  id="userInput"
                  placeholder="Envoyer un message ou utiliser les outils..."
                  rows={1}
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                    }
                  }}
                ></textarea>
                <button
                  id="sendButton"
                  type="submit"
                  title="Envoyer le message"
                  disabled={isSendDisabled || isLoading}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5z"/>
                  </svg>
                </button>
              </div>
              <div className={styles.toolbar}>
                <button type="button" id="uploadImageButton" title="Télécharger une image (pour analyse)" onClick={handleUploadImageClick}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                    <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                  </svg>
                </button>
                <button type="button" id="captureImageForChatButton" title="Prendre une photo pour analyse" onClick={openCameraModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                </button>
                <button type="button" id="upload3DImageButton" title="Télécharger une image pour modèle 3D" onClick={handleUpload3DImage}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8.186 1.113a.5.5 0 0 0-.372 0L1.846 3.5 8 5.961 14.154 3.5 8.186 1.113zM15 4.239l-6.5 2.6v7.922l6.5-2.6V4.24zM7.5 14.762V6.838L1 4.239v7.923l6.5 2.6zM7.154 6.232L8 6.5l.846-.268L8 5.961 7.154 6.232z"/>
                  </svg>
                </button>
                <button type="button" id="recordAudioButton" title="Enregistrer l'audio" onClick={handleRecordAudio}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0V3z"/>
                    <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5z"/>
                  </svg>
                </button>
                <div className={styles.feedbackButtons}>
                  <button type="button" id="thumbsUpBtn" title="Feedback positif" onClick={handleThumbsUp}>👍</button>
                  <button type="button" id="thumbsDownBtn" title="Feedback négatif" onClick={handleThumbsDown}>👎</button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}