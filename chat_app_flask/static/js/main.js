// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Sélecteurs d'éléments principaux
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatForm = document.getElementById('chatForm');
    const chatMessagesDisplay = document.getElementById('chatMessages'); // Zone où les messages s'affichent
    const newChatBtn = document.getElementById('newChatBtn');
    const disclaimerText = document.querySelector('.disclaimer-chat-area p').textContent.trim();

    // Sélecteurs des boutons de la toolbar
    const addImage3dBtn = document.getElementById('addImage3dBtn');
    const imageChatBtn = document.getElementById('imageChatBtn');
    const micBtn = document.getElementById('micBtn');
    const thumbsUpBtn = document.getElementById('thumbsUpBtn');
    const thumbsDownBtn = document.getElementById('thumbsDownBtn');
    // ... autres boutons de la toolbar si nécessaire ...

    const backendBaseUrl = ''; // Chemin relatif si servi par Flask

    let currentJobIdFor3D = null;

    // Fonction pour afficher le disclaimer initial
    function displayInitialDisclaimer() {
        if (disclaimerText) {
            appendChatMessage('bot-disclaimer-bubble', disclaimerText);
        }
    }

    // Fonction pour ajouter un message (utilisateur ou bot) à la zone de chat
    function appendChatMessage(bubbleClass, text, imageUrl = null) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message-bubble', bubbleClass);

        const textContentDiv = document.createElement('div');
        textContentDiv.style.whiteSpace = "pre-wrap";
        textContentDiv.textContent = text;
        messageDiv.appendChild(textContentDiv);

        if (imageUrl) {
            const imgNode = document.createElement('img');
            imgNode.src = imageUrl;
            imgNode.alt = "Image jointe";
            messageDiv.appendChild(imgNode);
        }
        chatMessagesDisplay.appendChild(messageDiv);
        chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight; // Scroll vers le bas
    }

    // Gérer l'envoi du message
    async function handleSendMessage(messageText, imageBase64 = null) {
        const textToSend = (messageText || "").trim();
        const imageToSend = imageBase64;

        if (!textToSend && !imageToSend) return; // Ne rien faire si vide

        const displayUserText = textToSend || (imageToSend ? "Image à analyser..." : "");
        appendChatMessage('user-message-bubble', displayUserText, imageToSend); // Affiche l'image si imageToSend est fourni
        userInput.value = ''; // Vide le champ après envoi

        try {
            const payload = {};
            if (textToSend) payload.message = textToSend;
            if (imageToSend) payload.image_b64 = imageToSend;

            const response = await fetch(`${backendBaseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erreur inconnue du serveur." }));
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            appendChatMessage('bot-message-bubble', data.reply);

        } catch (error) {
            console.error('Erreur lors de l_envoi du message au backend:', error);
            appendChatMessage('bot-message-bubble', `Désolé, une erreur est survenue: ${error.message}`);
        }
    }

    // Écouteur pour le formulaire de chat
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Empêche le rechargement de la page
        handleSendMessage(userInput.value);
    });

    // Bouton Nouveau Chat
    if (newChatBtn) {
        newChatBtn.addEventListener('click', () => {
            chatMessagesDisplay.innerHTML = ''; // Vide les messages
            displayInitialDisclaimer();
            userInput.value = '';
            currentJobIdFor3D = null;
            console.log("Nouveau chat initié.");
            // Optionnel: Envoyer une requête au backend pour réinitialiser la session serveur
            // fetch(`${backendBaseUrl}/reset_chat_session`, { method: 'POST' });
        });
    }
    
    // --- Input de fichier caché pour les uploads ---
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
    let currentFileActionHandler = null; 

    // Clic sur le bouton + (Upload pour 3D)
    if (addImage3dBtn) {
        addImage3dBtn.addEventListener('click', () => {
            currentFileActionHandler = handle3DUpload;
            fileInput.click();
        });
    }

    // Clic sur le bouton Image pour Chat
    if (imageChatBtn) {
        imageChatBtn.addEventListener('click', () => {
            currentFileActionHandler = handleImageForChat;
            fileInput.click();
        });
    }
    
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && currentFileActionHandler) {
            currentFileActionHandler(file);
        }
        fileInput.value = ''; // Réinitialiser pour permettre de sélectionner le même fichier
        currentFileActionHandler = null; // Réinitialiser l'action
    });

    function handleImageForChat(file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const userMessageForImage = userInput.value.trim() || "Peux-tu décrire cette image ?";
            userInput.value = ''; 
            handleSendMessage(userMessageForImage, e.target.result); // e.target.result est l'image en base64
        }
        reader.readAsDataURL(file);
    }

    async function handle3DUpload(file) {
        const formData = new FormData();
        formData.append('image', file);
        appendChatMessage('user-message-bubble', `Téléchargement de: ${file.name} pour traitement 3D...`);
        try {
            const response = await fetch(`${backendBaseUrl}/upload_and_start_3d_process`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            appendChatMessage('bot-message-bubble', `${data.message} ID du job: ${data.job_id}`);
            currentJobIdFor3D = data.job_id;
            if (currentJobIdFor3D) {
                setTimeout(() => check3DModelStatus(currentJobIdFor3D), 5000); // Vérifier après 5s
            }
        } catch (error) {
            console.error('Erreur upload pour 3D:', error);
            appendChatMessage('bot-message-bubble', `Erreur traitement 3D: ${error.message}`);
        }
    }

    async function check3DModelStatus(jobId) {
        if (!jobId) return;
        appendChatMessage('bot-message-bubble', `Vérification statut 3D (Job: ${jobId})...`);
        try {
            const response = await fetch(`${backendBaseUrl}/get_3d_model_details/${jobId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 202 && errorData.status === 'processing') {
                     appendChatMessage('bot-message-bubble', 'Modèle 3D en traitement. Prochaine vérification dans 10s.');
                     setTimeout(() => check3DModelStatus(jobId), 10000);
                     return;
                }
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'completed') {
                appendChatMessage('bot-message-bubble', `Modèle 3D prêt !`);
                const modelContainer = document.createElement('div'); // Conteneur pour model-viewer et lien
                modelContainer.classList.add('message-bubble', 'bot-message-bubble');

                const modelViewerElement = document.createElement('model-viewer');
                modelViewerElement.src = data.model_url;
                modelViewerElement.alt = "Modèle 3D " + (data.filename || jobId);
                modelViewerElement.setAttribute('auto-rotate', '');
                modelViewerElement.setAttribute('camera-controls', '');
                modelContainer.appendChild(modelViewerElement);

                const downloadLink = document.createElement('a');
                downloadLink.href = data.model_url;
                downloadLink.textContent = "Télécharger le modèle";
                downloadLink.target = "_blank";
                downloadLink.style.cssText = "display:block; margin-top:10px; text-align:center;";
                modelContainer.appendChild(downloadLink);
                
                chatMessagesDisplay.appendChild(modelContainer);
                chatMessagesDisplay.scrollTop = chatMessagesDisplay.scrollHeight;

                // Charger le script model-viewer si pas déjà fait
                if (!document.querySelector('script[src^="https://ajax.googleapis.com/ajax/libs/model-viewer"]')) {
                    const scriptMV = document.createElement('script');
                    scriptMV.type = 'module';
                    scriptMV.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
                    document.head.appendChild(scriptMV);
                }
            } else if (data.status === 'processing') {
                 appendChatMessage('bot-message-bubble', 'Modèle 3D en traitement. Prochaine vérification dans 10s.');
                 setTimeout(() => check3DModelStatus(jobId), 10000);
            } else {
                appendChatMessage('bot-message-bubble', `Statut 3D : ${data.status || 'Inconnu'}. Erreur: ${data.error || 'Non spécifié'}`);
            }
        } catch (error) {
            console.error('Erreur statut 3D:', error);
            appendChatMessage('bot-message-bubble', `Erreur statut 3D: ${error.message}`);
        }
    }

    // Reconnaissance Vocale (Micro)
    if (micBtn) {
        micBtn.addEventListener('click', () => {
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                appendChatMessage('bot-message-bubble', 'Reconnaissance vocale non supportée.');
                return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'fr-FR';
            recognition.interimResults = false;
            recognition.onstart = () => {
                appendChatMessage('bot-message-bubble', 'Parlez maintenant...');
                micBtn.disabled = true;
            };
            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                userInput.value = speechResult;
                handleSendMessage(speechResult); // Envoyer directement après reconnaissance
            };
            recognition.onend = () => {
                micBtn.disabled = false;
                appendChatMessage('bot-message-bubble', 'Reconnaissance vocale terminée.');
            };
            recognition.onerror = (event) => {
                micBtn.disabled = false;
                appendChatMessage('bot-message-bubble', `Erreur reconnaissance vocale: ${event.error}`);
            };
            recognition.start();
        });
    }

    // Feedback (Pouces)
    function handleFeedback(isPositive) {
        const botMessages = chatMessagesDisplay.querySelectorAll('.bot-message-bubble:not(.bot-disclaimer-bubble)');
        if (botMessages.length > 0) {
            const lastBotResponse = botMessages[botMessages.length - 1].textContent;
            console.log(`Feedback ${isPositive ? 'positif' : 'négatif'} pour : "${lastBotResponse}"`);
            appendChatMessage('bot-message-bubble', `Merci pour votre feedback ${isPositive ? 'positif ! 👍' : 'négatif. Nous allons nous améliorer. 👎'}`);
            // TODO: Envoyer ce feedback au backend
        }
    }
    if (thumbsUpBtn) thumbsUpBtn.addEventListener('click', () => handleFeedback(true));
    if (thumbsDownBtn) thumbsDownBtn.addEventListener('click', () => handleFeedback(false));

    // Initialiser l'affichage du disclaimer
    displayInitialDisclaimer();
});