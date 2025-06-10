// static/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 0. CONFIGURATION & CONSTANTES
    // -------------------------------------------------------------------------
    const BACKEND_BASE_URL = ''; // Chemin relatif si servi par Flask
    const CSS_CLASSES = {
        // Message container and individual messages
        MESSAGE_AREA: 'chatgpt-messages-area', // ID: chatMessagesDisplayArea
        MESSAGE_WRAPPER: 'chatgpt-message',
        USER_MESSAGE: 'user-message',
        BOT_MESSAGE: 'bot-message',
        SYSTEM_MESSAGE: 'system-message', // For disclaimers, info
        ERROR_MESSAGE: 'error-message',   // For displaying errors as messages
        AVATAR: 'avatar',
        MESSAGE_CONTENT: 'message-content',
        // Specific content types
        BOT_AVATAR_CONTENT: '🤖', // Placeholder, can be an <img> tag
        // Input area
        USER_INPUT: 'userInput',
        SEND_BUTTON: 'sendButton',
        CHAT_FORM: 'chatForm',
        // Toolbar buttons
        NEW_CHAT_BUTTON: 'newChatButton', // Corrected from newChatBtn
        UPLOAD_IMAGE_BUTTON: 'uploadImageButton', // Corrected from addImage3dBtn
        CAPTURE_IMAGE_BUTTON: 'captureImageForChatButton', // Corrected from imageChatBtn
        RECORD_AUDIO_BUTTON: 'recordAudioButton', // Corrected from micBtn
        THUMBS_UP_BUTTON: 'thumbsUpButton',
        THUMBS_DOWN_BUTTON: 'thumbsDownButton',
        // Disclaimer
        DISCLAIMER_AREA_ID: 'disclaimer-area',
        // Typing indicator
        TYPING_INDICATOR_MESSAGE: 'typing-indicator-message', // Classe pour le conteneur du message d'indicateur
        TYPING_DOTS_CONTAINER: 'typing-dots-container',     // Classe pour le conteneur des points
    };

    // -------------------------------------------------------------------------
    // 1. SÉLECTEURS DOM
    // -------------------------------------------------------------------------
    const userInput = document.getElementById('userInput');
    const sendButton = document.getElementById('sendButton');
    const chatForm = document.getElementById('chatForm');
    const chatMessagesDisplayArea = document.getElementById('chatMessagesDisplayArea');
    const newChatButton = document.getElementById(CSS_CLASSES.NEW_CHAT_BUTTON);
    const disclaimerElement = document.getElementById(CSS_CLASSES.DISCLAIMER_AREA_ID);

    // Toolbar buttons
    const uploadImageButton = document.getElementById(CSS_CLASSES.UPLOAD_IMAGE_BUTTON);
    const captureImageForChatButton = document.getElementById(CSS_CLASSES.CAPTURE_IMAGE_BUTTON);
    const recordAudioButton = document.getElementById(CSS_CLASSES.RECORD_AUDIO_BUTTON);
    const thumbsUpBtn = document.getElementById('thumbsUpBtn');
    const thumbsDownBtn = document.getElementById('thumbsDownBtn');

    // -------------------------------------------------------------------------
    // 2. ÉTAT DE L'APPLICATION
    // -------------------------------------------------------------------------
    let currentJobIdFor3D = null;
    let isRecognizingSpeech = false;
    let typingIndicatorElement = null; // Pour suivre l'élément de l'indicateur de frappe

    // -------------------------------------------------------------------------
    // 3. FONCTIONS UTILITAIRES (UI, API, etc.)
    // -------------------------------------------------------------------------

    /**
     * Fait défiler la zone de chat vers le bas.
     */
    function scrollToBottom() {
        if (chatMessagesDisplayArea) {
            chatMessagesDisplayArea.scrollTop = chatMessagesDisplayArea.scrollHeight;
        }
    }

    /**
     * Crée un élément de message HTML pour le chat.
     * @param {string} type - Type de message ('user', 'bot', 'system', 'error').
     * @param {string} text - Contenu textuel du message.
     * @param {string} [imageUrl=null] - URL de l'image à afficher (pour les messages utilisateur).
     * @returns {HTMLElement} L'élément de message créé.
     */
    function createMessageElement(type, text, imageUrl = null) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add(CSS_CLASSES.MESSAGE_WRAPPER);

        const messageContentDiv = document.createElement('div');
        messageContentDiv.classList.add(CSS_CLASSES.MESSAGE_CONTENT);

        // Gérer le texte (permettre le retour à la ligne)
        const textParagraph = document.createElement('p');
        textParagraph.textContent = text;
        messageContentDiv.appendChild(textParagraph);

        if (imageUrl) {
            const imgNode = document.createElement('img');
            imgNode.src = imageUrl;
            imgNode.alt = "Image jointe";
            imgNode.style.maxWidth = '100%'; // Simple style pour l'image
            imgNode.style.marginTop = '10px';
            imgNode.style.borderRadius = '4px';
            messageContentDiv.appendChild(imgNode);
        }

        switch (type) {
            case 'user':
                messageWrapper.classList.add(CSS_CLASSES.USER_MESSAGE);
                // ChatGPT style n'a généralement pas d'avatar pour l'utilisateur
                break;
            case 'bot':
            case 'system': // Le disclaimer peut utiliser le style bot
            case 'error': // Les erreurs peuvent aussi utiliser le style bot
                messageWrapper.classList.add(CSS_CLASSES.BOT_MESSAGE); // Ou une classe spécifique si design différent
                if (type === 'error') messageWrapper.classList.add(CSS_CLASSES.ERROR_MESSAGE);
                if (type === 'system') messageWrapper.classList.add(CSS_CLASSES.SYSTEM_MESSAGE);

                const avatarDiv = document.createElement('div');
                avatarDiv.classList.add(CSS_CLASSES.AVATAR);
                avatarDiv.textContent = CSS_CLASSES.BOT_AVATAR_CONTENT; // Peut être une image via CSS
                messageWrapper.appendChild(avatarDiv);
                break;
            case 'typing':
                messageWrapper.classList.add(CSS_CLASSES.BOT_MESSAGE); // Style similaire à un message de bot
                messageWrapper.classList.add(CSS_CLASSES.TYPING_INDICATOR_MESSAGE);

                const botAvatarDiv = document.createElement('div');
                botAvatarDiv.classList.add(CSS_CLASSES.AVATAR);
                botAvatarDiv.textContent = CSS_CLASSES.BOT_AVATAR_CONTENT;
                messageWrapper.appendChild(botAvatarDiv);

                const typingDotsContent = document.createElement('div');
                typingDotsContent.classList.add(CSS_CLASSES.MESSAGE_CONTENT); // Pour l'alignement
                // Les points eux-mêmes (seront stylisés et animés en CSS)
                typingDotsContent.innerHTML = `<div class="${CSS_CLASSES.TYPING_DOTS_CONTAINER}"><span></span><span></span><span></span></div>`;
                messageWrapper.appendChild(typingDotsContent);
                return messageWrapper; // Pas besoin d'ajouter messageContentDiv pour 'typing'
        }
        messageWrapper.appendChild(messageContentDiv);
        return messageWrapper;
    }
    /**
     * Ajoute un message à la zone de chat et fait défiler.
     * @param {string} type - Type de message ('user', 'bot', 'system', 'error').
     * @param {string} text - Contenu textuel.
     * @param {string} [imageUrl=null] - URL de l'image.
     */
    function appendMessageToChat(type, text, imageUrl = null) {
        if (!chatMessagesDisplayArea) return;
        const messageElement = createMessageElement(type, text, imageUrl);
        chatMessagesDisplayArea.appendChild(messageElement);
        scrollToBottom();
    }

    /**
     * Redimensionne le textarea en fonction de son contenu.
     */
    function resizeTextarea() {
        if (!userInput) return;
        userInput.style.height = 'auto'; // Réinitialiser pour obtenir la bonne scrollHeight
        userInput.style.height = `${userInput.scrollHeight}px`;
    }

    /**
     * Affiche l'indicateur de frappe du bot.
     */
    function showTypingIndicator() {
        if (!chatMessagesDisplayArea) return;
        // S'assurer qu'il n'y a pas d'indicateur existant
        hideTypingIndicator();

        typingIndicatorElement = createMessageElement('typing', ''); // Le texte est non pertinent ici
        chatMessagesDisplayArea.appendChild(typingIndicatorElement);
        scrollToBottom();
    }

    /**
     * Masque l'indicateur de frappe du bot.
     */
    function hideTypingIndicator() {
        if (typingIndicatorElement && typingIndicatorElement.parentNode) {
            typingIndicatorElement.remove();
            typingIndicatorElement = null;
        }
    }

    // -------------------------------------------------------------------------
    // 4. LOGIQUE PRINCIPALE DU CHAT
    // -------------------------------------------------------------------------

    /**
     * Gère l'envoi d'un message (texte et/ou image) au backend.
     * @param {string} messageText - Le texte du message.
     * @param {string} [imageBase64=null] - L'image encodée en base64.
     */
    async function handleSendMessage(messageText, imageBase64 = null) {
        const textToSend = (messageText || "").trim();
        const imageToSend = imageBase64;

        if (!textToSend && !imageToSend) return; // Ne rien faire si vide

        const displayUserText = textToSend || (imageToSend ? "Image à analyser..." : "");
        appendMessageToChat('user', displayUserText, imageToSend);
        userInput.value = ''; // Vide le champ après envoi
        if (sendButton) sendButton.disabled = true; // Désactiver pendant la saisie et l'envoi
        resizeTextarea(); // Réajuste la taille du textarea

        showTypingIndicator();

        // const originalSendButtonDisabledState = sendButton ? sendButton.disabled : false; // Non nécessaire si on se base sur le contenu de userInput
        try {
            const payload = {};
            if (textToSend) payload.message = textToSend;
            if (imageToSend) payload.image_b64 = imageToSend;
            const response = await fetch(`${BACKEND_BASE_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: "Erreur inconnue du serveur." }));
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }

            const data = await response.json();
            hideTypingIndicator(); // Cacher avant d'afficher la vraie réponse
            appendMessageToChat('bot', data.reply);

        } catch (error) {
            hideTypingIndicator(); // Cacher aussi en cas d'erreur
            console.error('Erreur lors de l_envoi du message au backend:', error);
            appendMessageToChat('error', `Désolé, une erreur est survenue: ${error.message}`);
        } finally {
            if (sendButton) {
                sendButton.disabled = userInput.value.trim() === ''; // Réactiver si userInput est vide, sinon laisser l'event listener de userInput gérer
            }
        }
    }

    /**
     * Affiche le disclaimer initial dans la zone de chat.
     */
    function displayInitialDisclaimer() {
        if (disclaimerElement && disclaimerElement.textContent) {
            const disclaimerText = disclaimerElement.textContent.trim();
            if (disclaimerText) {
                appendMessageToChat('system', disclaimerText);
            }
            disclaimerElement.style.display = 'none'; // Cacher le disclaimer original après l'avoir affiché dans le chat
        }
    }

    // -------------------------------------------------------------------------
    // 5. GESTIONNAIRES DE FONCTIONNALITÉS (Toolbar, Uploads, etc.)
    // -------------------------------------------------------------------------

    function setupNewChatButton() {
        if (newChatButton) {
            newChatButton.addEventListener('click', () => {
                if (chatMessagesDisplayArea) chatMessagesDisplayArea.innerHTML = ''; // Vide les messages
                displayInitialDisclaimer(); // Réaffiche le disclaimer
                if (userInput) userInput.value = '';
                resizeTextarea();
                currentJobIdFor3D = null;
                console.log("Nouveau chat initié.");
                // Optionnel: Envoyer une requête au backend pour réinitialiser la session serveur
                // fetch(`${BACKEND_BASE_URL}/reset_chat_session`, { method: 'POST' });
            });
        }
    }

    // --- Gestionnaire de fichier caché pour les uploads ---
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Peut être ajusté si d'autres types sont nécessaires
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput); // Doit être dans le DOM pour fonctionner
    let currentFileActionHandler = null;

    function setupFileInputs() {
        if (uploadImageButton) { // Pour 3D
            uploadImageButton.addEventListener('click', () => {
                currentFileActionHandler = handle3DUpload;
                fileInput.click();
            });
        }

        if (captureImageForChatButton) { // Pour image dans le chat
            captureImageForChatButton.addEventListener('click', () => {
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
            displayInitialDisclaimer();
            currentFileActionHandler = null; // Réinitialiser l'action
        });
    }

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
        appendMessageToChat('user', `Téléchargement de: ${file.name} pour traitement 3D...`);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/upload_and_start_3d_process`, {
                method: 'POST',
                body: formData
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            appendMessageToChat('bot', `${data.message} ID du job: ${data.job_id}`);
            currentJobIdFor3D = data.job_id;
            if (currentJobIdFor3D) {
                setTimeout(() => check3DModelStatus(currentJobIdFor3D), 5000); // Vérifier après 5s
            }
        } catch (error) {
            console.error('Erreur upload pour 3D:', error);
            appendMessageToChat('error', `Erreur traitement 3D: ${error.message}`);
        }
    }

    async function check3DModelStatus(jobId) {
        if (!jobId) return;
        appendMessageToChat('system', `Vérification statut 3D (Job: ${jobId})...`);
        try {
            const response = await fetch(`${BACKEND_BASE_URL}/get_3d_model_details/${jobId}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                if (response.status === 202 && errorData.status === 'processing') {
                     appendMessageToChat('system', 'Modèle 3D en traitement. Prochaine vérification dans 10s.');
                     setTimeout(() => check3DModelStatus(jobId), 10000);
                     return;
                }
                throw new Error(errorData.error || `Erreur HTTP: ${response.status}`);
            }
            const data = await response.json();
            if (data.status === 'completed') {
                appendMessageToChat('bot', `Modèle 3D prêt !`);

                // Créer un conteneur spécifique pour le model-viewer dans un message de bot
                const modelViewerMessage = createMessageElement('bot', ''); // Texte vide, le contenu sera le model-viewer
                const contentDiv = modelViewerMessage.querySelector(`.${CSS_CLASSES.MESSAGE_CONTENT}`);
                if (contentDiv) contentDiv.innerHTML = ''; // Vider le <p> initial

                const modelViewerElement = document.createElement('model-viewer');
                modelViewerElement.src = data.model_url;
                modelViewerElement.alt = "Modèle 3D " + (data.filename || jobId);
                modelViewerElement.setAttribute('auto-rotate', '');
                modelViewerElement.setAttribute('camera-controls', '');
                modelViewerElement.style.width = '100%';
                modelViewerElement.style.height = '300px'; // Hauteur exemple
                if (contentDiv) contentDiv.appendChild(modelViewerElement);

                const downloadLink = document.createElement('a');
                downloadLink.href = data.model_url;
                downloadLink.textContent = "Télécharger le modèle";
                downloadLink.target = "_blank";
                downloadLink.style.cssText = "display:block; margin-top:10px; text-align:center;";
                if (contentDiv) contentDiv.appendChild(downloadLink);
                
                if (chatMessagesDisplayArea) chatMessagesDisplayArea.appendChild(modelViewerMessage);
                scrollToBottom();

                // Charger le script model-viewer si pas déjà fait
                if (!document.querySelector('script[src^="https://ajax.googleapis.com/ajax/libs/model-viewer"]')) {
                    const scriptMV = document.createElement('script');
                    scriptMV.type = 'module';
                    scriptMV.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
                    document.head.appendChild(scriptMV);
                }
            } else if (data.status === 'processing') {
                 appendMessageToChat('system', 'Modèle 3D en traitement. Prochaine vérification dans 10s.');
                 setTimeout(() => check3DModelStatus(jobId), 10000);
            } else {
                appendMessageToChat('error', `Statut 3D : ${data.status || 'Inconnu'}. Erreur: ${data.error || 'Non spécifié'}`);
            }
        } catch (error) {
            console.error('Erreur statut 3D:', error);
            appendMessageToChat('error', `Erreur statut 3D: ${error.message}`);
        }
    }

    function setupSpeechRecognition() {
        if (recordAudioButton) {
            recordAudioButton.addEventListener('click', () => {
            if (isRecognizingSpeech) {
                // Logique pour arrêter la reconnaissance si nécessaire (non implémenté ici)
                return;
            }
            if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
                appendMessageToChat('system', 'Reconnaissance vocale non supportée par ce navigateur.');
                return;
            }
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            recognition.lang = 'fr-FR';
            recognition.interimResults = false;
            recognition.onstart = () => {
                isRecognizingSpeech = true;
                appendMessageToChat('system', '🎙️ Parlez maintenant...');
                recordAudioButton.disabled = true; // Désactiver pendant l'écoute
                // Ajouter un style visuel pour indiquer l'écoute (ex: icône qui pulse)
                recordAudioButton.classList.add('recording');
            };
            recognition.onresult = (event) => {
                const speechResult = event.results[0][0].transcript;
                if (userInput) userInput.value = speechResult;
                handleSendMessage(speechResult); // Envoyer directement après reconnaissance
            };
            recognition.onend = () => {
                isRecognizingSpeech = false;
                recordAudioButton.disabled = false;
                recordAudioButton.classList.remove('recording');
                // appendMessageToChat('system', 'Reconnaissance vocale terminée.'); // Optionnel
            };
            recognition.onerror = (event) => {
                isRecognizingSpeech = false;
                recordAudioButton.disabled = false;
                recordAudioButton.classList.remove('recording');
                appendMessageToChat('error', `Erreur reconnaissance vocale: ${event.error}`);
            };
            recognition.start();
            });
        }
    }

    function setupFeedbackButtons() {
        function handleFeedback(isPositive) {
            // Trouver le dernier message du bot (non-système, non-erreur)
            const botMessages = Array.from(chatMessagesDisplayArea.querySelectorAll(`.${CSS_CLASSES.MESSAGE_WRAPPER}.${CSS_CLASSES.BOT_MESSAGE}`))
                                     .filter(el => !el.classList.contains(CSS_CLASSES.SYSTEM_MESSAGE) && !el.classList.contains(CSS_CLASSES.ERROR_MESSAGE));

            if (botMessages.length > 0) {
                const lastBotMessageElement = botMessages[botMessages.length - 1];
                const lastBotResponseText = lastBotMessageElement.querySelector(`.${CSS_CLASSES.MESSAGE_CONTENT} p`)?.textContent || "Message précédent du bot";

                console.log(`Feedback ${isPositive ? 'positif' : 'négatif'} pour : "${lastBotResponseText}"`);
                appendMessageToChat('system', `Merci pour votre feedback ${isPositive ? 'positif ! 👍' : 'négatif. Nous allons nous améliorer. 👎'}`);
                // TODO: Envoyer ce feedback au backend avec `lastBotResponseText` et `isPositive`
                // fetch(`${BACKEND_BASE_URL}/feedback`, { method: 'POST', body: JSON.stringify({ message: lastBotResponseText, feedback: isPositive ? 'positive' : 'negative' }), headers: {'Content-Type': 'application/json'} });
            } else {
                appendMessageToChat('system', "Il n'y a pas de message récent pour donner un feedback.");
            }
        }
        if (thumbsUpBtn) thumbsUpBtn.addEventListener('click', () => handleFeedback(true));
        if (thumbsDownBtn) thumbsDownBtn.addEventListener('click', () => handleFeedback(false));
    }

    // -------------------------------------------------------------------------
    // 6. INITIALISATION
    // -------------------------------------------------------------------------
    if (chatForm) {
        chatForm.addEventListener('submit', (event) => {
            event.preventDefault();
            if (userInput) handleSendMessage(userInput.value);
        });
    }
    if (userInput) {
        userInput.addEventListener('input', resizeTextarea);
        // Gérer l'état du bouton d'envoi en fonction du contenu de l'input
        userInput.addEventListener('input', () => {
            resizeTextarea();
            if (sendButton) {
                sendButton.disabled = userInput.value.trim() === '';
            }
        });
        resizeTextarea(); // Appel initial au cas où il y a du texte pré-rempli
        if (sendButton) sendButton.disabled = userInput.value.trim() === ''; // État initial du bouton
    }

    setupNewChatButton();
    setupFileInputs();
    setupSpeechRecognition();
    setupFeedbackButtons();

    displayInitialDisclaimer();
});