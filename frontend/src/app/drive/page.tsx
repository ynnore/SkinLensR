'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from './drive.module.css';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { LanguageCode } from '@/types';

// Icônes supplémentaires nécessaires
import { FaCloudUploadAlt, FaFolderOpen, FaLink, FaSearch, FaCamera, FaSpinner } from 'react-icons/fa';
// Pour "Kiwi-Ops Social Media", une icône comme FaRss, FaTwitter, FaInstagram, ou une icône personnalisée serait appropriée.
// Ici, j'utilise FaLink comme placeholder, mais vous pourriez vouloir la changer.
import { FaNewspaper } from 'react-icons/fa'; // Exemple d'icône pour Social Media

// Définition des types pour la recherche et les fichiers (simplifié)
interface SearchResult {
  title: string;
  summary: string;
  sources: string[];
}

interface FileInfo {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  uploadedAt: string;
}

// Objet de traduction pour cette page
const driveTranslations = {
  headline: {
    en: "Kiwi-Ops Drive",
    fr: "Drive Kiwi-Ops",
    mi: "Tōku Pūmanawa Ngū",
    hi: "मेरी गुप्त ड्राइव",
    ga: "Mo Dhriofa Rúnda",
    gd: "Mo Dhraibh Dhìomhair",
    'en-AU': "Kiwi-Ops Drive",
    'en-CA': "Kiwi-Ops Drive",
    'fr-CA': "Drive Kiwi-Ops",
    'en-NZ': "Kiwi-Ops Drive",
    'en-ZA': "Kiwi-Ops Drive",
    af: "My Geheime Dryf",
  },
  description: {
    en: "Secure and intelligent storage for your classified mission files. Upload, organize, search, and analyze your data.",
    fr: "Stockage sécurisé et intelligent pour vos dossiers de mission classifiés. Téléchargez, organisez, recherchez et analysez vos données.",
    mi: "He wāhi rongoa haumaru me te mohio mō ō kōnae misioni huna. Tukuna ake, whakarōpū, rapua, me tātari ō raraunga.",
    hi: "आपकी वर्गीकृत मिशन फ़ाइलों के लिए सुरक्षित और बुद्धिमान भंडारण। अपने डेटा को अपलोड करें, व्यवस्थित करें, खोजें और विश्लेषण करें।",
    ga: "Stóráil shlán agus chliste do chomhaid misean aicmithe. Uaslódáil, eagraigh, déan cuardach, agus déan anailís ar do shonraí.",
    gd: "Stòras tèarainte agus spaideil airson do fhaidhlichean misean clasaichte. Luchdaich suas, eagraich, rannsaich, agus dèan mion-sgrùdadh air an dàta agad.",
    'en-AU': "Secure and intelligent storage for your classified mission files. Upload, organize, search, and analyze your data.",
    'en-CA': "Secure and intelligent storage for your classified mission files. Upload, organize, search, and analyze your data.",
    'fr-CA': "Stockage sécurisé et intelligent pour vos dossiers de mission classifiés. Téléchargez, organisez, recherchez et analysez vos données.",
    'en-NZ': "Secure and intelligent storage for your classified mission files. Upload, organize, search, and analyze your data.",
    'en-ZA': "Secure and intelligent storage for your classified mission files. Upload, organize, search, and analyze your data.",
    af: "Veilige en intelligente stoorplek vir u geklassifiseerde missielêers. Laai, organiseer, soek en analiseer u data.",
  },
  kiwiOpsExploreTab: {
    en: "Kiwi-Ops Explore",
    fr: "Kiwi-Ops Explore",
    mi: "Kiwi-Ops Tirotiro",
    hi: "कीवी-ऑप्स एक्सप्लोर",
    ga: "Kiwi-Ops Iniúchadh",
    gd: "Kiwi-Ops Rannsachadh",
    'en-AU': "Kiwi-Ops Explore",
    'en-CA': "Kiwi-Ops Explore",
    'fr-CA': "Kiwi-Ops Explore",
    'en-NZ': "Kiwi-Ops Explore",
    'en-ZA': "Kiwi-Ops Explore",
    af: "Kiwi-Ops Verken",
  },
  // --- NOUVELLES TRADUCTIONS POUR LES AUTRES ONGLET ---
  kiwiOpsUploadTab: {
    en: "Kiwi-Ops Upload",
    fr: "Kiwi-Ops Upload",
    mi: "Kiwi-Ops Tukunga",
    hi: "कीवी-ऑप्स अपलोड",
    ga: "Kiwi-Ops Uaslódáil",
    gd: "Kiwi-Ops Luchdaich Suas",
    'en-AU': "Kiwi-Ops Upload",
    'en-CA': "Kiwi-Ops Upload",
    'fr-CA': "Kiwi-Ops Upload",
    'en-NZ': "Kiwi-Ops Upload",
    'en-ZA': "Kiwi-Ops Upload",
    af: "Kiwi-Ops Laai Op",
  },
  kiwiOpsSocialMediaTab: {
    en: "Kiwi-Ops Social Media",
    fr: "Kiwi-Ops Social Media",
    mi: "Kiwi-Ops Pāpāho Pāpori",
    hi: "कीवी-ऑप्स सोशल मीडिया",
    ga: "Kiwi-Ops Na Meáin Shóisialta",
    gd: "Kiwi-Ops Meadhanan Sòisealta",
    'en-AU': "Kiwi-Ops Social Media",
    'en-CA': "Kiwi-Ops Social Media",
    'fr-CA': "Kiwi-Ops Médias Sociaux",
    'en-NZ': "Kiwi-Ops Social Media",
    'en-ZA': "Kiwi-Ops Social Media",
    af: "Kiwi-Ops Sosiale Media",
  },
  // --- FIN NOUVELLES TRADUCTIONS ---
  searchPlaceholder: {
    en: "Search Drive & Web...",
    fr: "Rechercher dans Drive et sur le Web...",
    mi: "Rapua Drive me Web...",
    hi: "ड्राइव और वेब खोजें...",
    ga: "Cuardaigh Drive & Gréasán...",
    gd: "Rannsaich Drive & Lìn...",
    'en-AU': "Search Drive & Web...",
    'en-CA': "Search Drive & Web...",
    'fr-CA': "Rechercher dans Drive et sur le Web...",
    'en-NZ': "Search Drive & Web...",
    'en-ZA': "Search Drive & Web...",
    af: "Soek Drive & Web...",
  },
  uploadSelectFile: {
    en: "Select File",
    fr: "Sélectionner un Fichier",
    mi: "Tīpakohia he Kōnae",
    hi: "फ़ाइल चुनें",
    ga: "Roghnaigh Comhad",
    gd: "Tagh Faidhle",
    'en-AU': "Select File",
    'en-CA': "Select File",
    'fr-CA': "Sélectionner un Fichier",
    'en-NZ': "Select File",
    'en-ZA': "Select File",
    af: "Kies Lêer",
  },
  uploadTakePhoto: {
    en: "Take Photo",
    fr: "Prendre une Photo",
    mi: "Tangohia he Whakaahua",
    hi: "फोटो लें",
    ga: "Tóg Grianghraf",
    gd: "Gabh Dealbh",
    'en-AU': "Take Photo",
    'en-CA': "Take Photo",
    'fr-CA': "Prendre une Photo",
    'en-NZ': "Take Photo",
    'en-ZA': "Take Photo",
    af: "Neem Foto",
  },
  myDrivePlaceholder: {
    en: "Your files will appear here. Search for information across your documents and the web.",
    fr: "Vos fichiers apparaîtront ici. Recherchez des informations dans vos documents et sur le web.",
    mi: "Ka puta mai ō kōnae ki konei. Rapua ngā mōhiohio puta noa i ō tuhinga me te paetukutuku.",
    hi: "आपकी फ़ाइलें यहां दिखाई देंगी। अपने दस्तावेज़ों और वेब पर जानकारी खोजें।",
    ga: "Beidh do chomhaid le feiceáil anseo. Cuardaigh faisnéis thar do dhoiciméid agus an gréasán.",
    gd: "Bidh na faidhlichean agad a’ nochdadh an seo. Lorg fiosrachadh tro na sgrìobhainnean agad agus an lìon.",
    'en-AU': "Your files will appear here. Search for information across your documents and the web.",
    'en-CA': "Your files will appear here. Search for information across your documents and the web.",
    'fr-CA': "Vos fichiers apparaîtront ici. Recherchez des informations dans vos documents et sur le web.",
    'en-NZ': "Your files will appear here. Search for information across your documents and the web.",
    'en-ZA': "Your files will appear here. Search for information across your documents and the web.",
    af: "U lêers sal hier verskyn. Soek na inligting oor u dokumente en die web.",
  },
  connectorsPlaceholder: {
    en: "Connect your cloud storage or other services to integrate them into your Drive.",
    fr: "Connectez vos stockages cloud ou autres services pour les intégrer à votre Drive.",
    mi: "Hononga atu i tō rokiroki kapua, i ētahi atu ratonga rānei hei whakauru atu ki tō Pūmanawa.",
    hi: "अपनी क्लाउड स्टोरेज या अन्य सेवाओं को अपने ड्राइव में एकीकृत करने के लिए कनेक्ट करें।",
    ga: "Ceangail do stóráil scamall nó seirbhísí eile chun iad a chomhtháthú i do Thiomáint.",
    gd: "Ceangail do stòradh sgòthan no seirbheisean eile gus an amalachadh a-steach do do Draibh.",
    'en-AU': "Connect your cloud storage or other services to integrate them into your Drive.",
    'en-CA': "Connect your cloud storage or other services to integrate them into your Drive.",
    'fr-CA': "Connectez vos stockages cloud ou autres services pour les intégrer à votre Drive.",
    'en-NZ': "Connect your cloud storage or other services to integrate them into your Drive.",
    'en-ZA': "Connect your cloud storage or other services to integrate them into your Drive.",
    af: "Koppel u wolkberging of ander dienste om dit in u Dryf te integreer.",
  },
  loading: {
    en: "Loading...",
    fr: "Chargement...",
    mi: "Kei te utaina...",
    hi: "लोड हो रहा है...",
    ga: "Ag luchtú...",
    gd: "A' luchdachadh...",
    'en-AU': "Loading...",
    'en-CA': "Loading...",
    'fr-CA': "Chargement...",
    'en-NZ': "Loading...",
    'en-ZA': "Loading...",
    af: "Laai...",
  },
  noResults: {
    en: "No results found.",
    fr: "Aucun résultat trouvé.",
    mi: "Karekau he hua i kitea.",
    hi: "कोई परिणाम नहीं मिला।",
    ga: "Ní bhfuarthas aon torthaí.",
    gd: "Cha deachaidh toraidhean sam bith a lorg.",
    'en-AU': "No results found.",
    'en-CA': "No results found.",
    'fr-CA': "Aucun résultat trouvé.",
    'en-NZ': "No results found.",
    'en-ZA': "No results found.",
    af: "Geen resultate gevind nie.",
  }
};

function getDriveTranslation<K extends keyof typeof driveTranslations>(key: K, lang: LanguageCode): string {
  const translations = driveTranslations[key] as Record<string, string>;
  return translations?.[lang] || translations?.en || '';
}

// Met à jour le type pour les onglets
type ActiveTab = 'kiwiOpsExplore' | 'kiwiOpsUpload' | 'kiwiOpsSocialMedia';

const DrivePage: React.FC = () => {
  const { language } = useLanguage();
  const { theme } = useTheme();

  // Initialisation de l'onglet actif avec la nouvelle valeur
  const [activeTab, setActiveTab] = useState<ActiveTab>('kiwiOpsExplore');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [myFiles, setMyFiles] = useState<FileInfo[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const performSearch = async () => {
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    setIsLoadingSearch(true);
    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchTerm }),
      });
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data.results || []);
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsLoadingSearch(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      performSearch();
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileUpload = async (fileToUpload: File) => {
    if (!fileToUpload) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('file', fileToUpload);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Upload failed');
      const result = await response.json();
      console.log("Upload successful:", result);
      setMyFiles(prevFiles => [...prevFiles, { id: result.id, name: fileToUpload.name, type: 'file', size: fileToUpload.size, uploadedAt: new Date().toISOString() }]);
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const encryptFileClientSide = async (file: File): Promise<ArrayBuffer | null> => {
    console.log("Simulating client-side encryption for:", file.name);
    return new ArrayBuffer(file.size);
  };

  const handleUploadButtonClick = async () => {
    if (!selectedFile) {
      fileInputRef.current?.click();
      return;
    }
    handleFileUpload(selectedFile);
  };

  const backgroundColor = theme === 'dark' ? '#1f2937' : '#ffffff';
  const textColor = theme === 'dark' ? '#E0E0E0' : '#111827';
  const cardBgColor = theme === 'dark' ? '#2A2A3A' : '#F8F8F8';
  const borderColor = theme === 'dark' ? '#555555' : '#e5e7eb';
  const highlightColor = theme === 'dark' ? '#0070f3' : '#0070f3';
  const highlightColorLight = theme === 'dark' ? 'rgba(0,112,243,0.3)' : 'rgba(0,112,243,0.1)';

  return (
    <div
      className={styles.container}
      style={{
        '--kiwi-background-page': backgroundColor,
        '--kiwi-text-primary': textColor,
        '--kiwi-background-card': cardBgColor,
        '--kiwi-border-color': borderColor,
        '--kiwi-highlight-color': highlightColor,
        '--kiwi-highlight-color-light': highlightColorLight,
      } as React.CSSProperties}
    >
      <h1 className={styles.headline}>{getDriveTranslation('headline', language)}</h1>
      <p className={styles.description}>{getDriveTranslation('description', language)}</p>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder={getDriveTranslation('searchPlaceholder', language)}
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <FaSearch className={styles.searchIcon} onClick={performSearch} />
      </div>

      {searchTerm && searchResults.length > 0 && (
        <div className={`${styles.tabContent} ${styles.resultsContent}`}>
          <div className={styles.tabPanel}>
            <h3 className={styles.resultsTitle}>Search Results</h3>
            {searchResults.map((result, index) => (
              <div key={index} className={styles.resultCard}>
                <h4>{result.title}</h4>
                <p>{result.summary}</p>
                <div className={styles.sources}>
                  <strong>Sources:</strong>
                  <ul>
                    {result.sources.map((source, srcIndex) => (
                      <li key={srcIndex}><a href={source} target="_blank" rel="noopener noreferrer">{source}</a></li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {searchTerm && !isLoadingSearch && searchResults.length === 0 && (
        <div className={`${styles.tabContent} ${styles.resultsContent}`}>
          <div className={styles.tabPanel}>
             <p className={styles.placeholderText}>{getDriveTranslation('noResults', language)}</p>
          </div>
        </div>
      )}
      {isLoadingSearch && (
         <div className={`${styles.tabContent} ${styles.resultsContent}`}>
          <div className={styles.tabPanel}>
             <p className={styles.placeholderText}><FaSpinner className={styles.spinnerIcon} /> {getDriveTranslation('loading', language)}</p>
          </div>
        </div>
      )}

      <div className={styles.tabsContainer}>
        {/* Kiwi-Ops Explore (anciennement My Drive) */}
        <button
          className={`${styles.tabButton} ${activeTab === 'kiwiOpsExplore' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('kiwiOpsExplore')}
        >
          <FaFolderOpen className={styles.tabIcon} />
          {getDriveTranslation('kiwiOpsExploreTab', language)}
        </button>
        {/* Kiwi-Ops Upload */}
        <button
          className={`${styles.tabButton} ${activeTab === 'kiwiOpsUpload' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('kiwiOpsUpload')}
        >
          <FaCloudUploadAlt className={styles.tabIcon} />
          {getDriveTranslation('kiwiOpsUploadTab', language)} {/* Utilisation de la nouvelle traduction */}
        </button>
        {/* Kiwi-Ops Social Media (anciennement Connectors) */}
        <button
          className={`${styles.tabButton} ${activeTab === 'kiwiOpsSocialMedia' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('kiwiOpsSocialMedia')}
        >
          <FaNewspaper className={styles.tabIcon} /> {/* Icône pour "Social Media" */}
          {getDriveTranslation('kiwiOpsSocialMediaTab', language)} {/* Utilisation de la nouvelle traduction */}
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'kiwiOpsExplore' && (
          <div className={styles.tabPanel}>
            {myFiles.length === 0 ? (
              <p className={styles.placeholderText}>{getDriveTranslation('myDrivePlaceholder', language)}</p>
            ) : (
              <div className={styles.fileList}>
                {myFiles.map(file => (
                  <div key={file.id} className={styles.fileItem}>
                    <FaFolderOpen className={styles.fileIcon} />
                    <span className={styles.fileName}>{file.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'kiwiOpsUpload' && (
          <div className={styles.tabPanel}>
            <div className={styles.uploadOptions}>
              <button
                className={`${styles.uploadButton} ${styles.fileButton}`}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                <FaFolderOpen className={styles.tabIcon} />
                {getDriveTranslation('uploadSelectFile', language)}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
                accept="image/*, application/pdf, .txt, .doc, .docx, .ppt, .pptx, .xls, .xlsx"
              />

              <label
                htmlFor="camera-input"
                className={`${styles.uploadButton} ${styles.cameraButton}`}
              >
                <FaCamera className={styles.tabIcon} />
                {getDriveTranslation('uploadTakePhoto', language)}
              </label>
              <input
                id="camera-input"
                type="file"
                capture="environment"
                accept="image/*"
                ref={cameraInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>

            {selectedFile && (
              <div className={styles.previewContainer}>
                {filePreview && (
                  <div className={styles.filePreviewWrapper}>
                    <p>Preview:</p>
                    {selectedFile.type.startsWith('image/') ? (
                      <img src={filePreview} alt="File Preview" className={styles.filePreview} />
                    ) : (
                      <div className={styles.filePreviewPlaceholder}>
                        {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                      </div>
                    )}
                  </div>
                )}
                <button
                  className={styles.uploadButtonPrimary}
                  onClick={handleUploadButtonClick}
                  disabled={uploading || !selectedFile}
                >
                  {uploading ? getDriveTranslation('loading', language) : 'Upload & Process'}
                </button>
              </div>
            )}

            {!selectedFile && (
              <p className={styles.placeholderText}>{getDriveTranslation('uploadPlaceholder', language)}</p>
            )}
          </div>
        )}

        {activeTab === 'kiwiOpsSocialMedia' && (
          <div className={styles.tabPanel}>
            {/* Remplacer le placeholder par le contenu spécifique de "Kiwi-Ops Social Media" */}
            <p className={styles.placeholderText}>Connect and manage your social media accounts here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DrivePage;