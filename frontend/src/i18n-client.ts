// src/i18n-client.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',

    resources: {
      en: {
        translation: {
          sidebar: {
            beta: "Beta",
            scan: "Scan",
            dashboard: "Dashboard",
            files: "Files",
            connections: "Connections",
            pay: "Pay",
            settings: "Settings",
            terms: "Terms",
            privacy: "Privacy Policy"
          },
          chat: {
            placeholder: "Type your message..."
          },
          helpPage: {
            title: "Help Center – Kiwi-Ops",
            description: "Find answers, FAQs and support contacts here.",
            faqTitle: "Frequently Asked Questions",
            faqIntro: "Here are the most common questions from our agents.",
            question1: "How do I change my secret code?",
            answer1: "Go to Account Settings and select 'Change Secret Code'.",
            question2: "How to contact Command HQ?",
            answer2: "Use the secure channel in the Connections section.",
            viewAllFaq: "View all FAQs",
            contactTitle: "Contact HQ Support",
            contactIntro: "Didn’t find your answer? Our team is ready to assist.",
            contactGeneral: "General inquiries",
            contactTech: "Technical issues",
            contactAccounts: "Accreditation questions",
            contactDisclaimer: "All communications are handled with maximum discretion.",
            footer: "Assistance protocol active."
          }
        }
      },

      fr: {
        translation: {
          sidebar: {
            beta: "Bêta",
            scan: "Scanner",
            dashboard: "Tableau de Bord",
            files: "Fichiers",
            connections: "Connexions",
            pay: "Paiements",
            settings: "Paramètres",
            terms: "Conditions",
            privacy: "Confidentialité"
          },
          chat: {
            placeholder: "Écrivez votre message..."
          },
          helpPage: {
            title: "Centre d’assistance – Kiwi-Ops",
            description: "Accédez à la documentation, aux FAQ et aux canaux de support.",
            faqTitle: "Questions fréquentes",
            faqIntro: "Voici les réponses aux questions les plus posées par nos agents.",
            question1: "Comment changer mon code secret ?",
            answer1: "Allez dans les paramètres du compte et sélectionnez 'Modifier le code secret'.",
            question2: "Comment contacter le Commandement ?",
            answer2: "Utilisez le canal sécurisé dans la section 'Connexions'.",
            viewAllFaq: "Voir toutes les FAQ",
            contactTitle: "Contacter le support HQ",
            contactIntro: "Si vous n’avez pas trouvé votre réponse, notre équipe est prête à vous aider.",
            contactGeneral: "Demandes générales",
            contactTech: "Problèmes techniques",
            contactAccounts: "Questions d’accréditation",
            contactDisclaimer: "Toutes les communications sont traitées avec la plus haute discrétion.",
            footer: "Protocole d’assistance actif."
          }
        }
      },

      mi: {
        translation: {
          sidebar: {
            beta: "Pēta",
            scan: "Matawai",
            dashboard: "Papātohu",
            files: "Kōnae",
            connections: "Hononga",
            pay: "Utu",
            settings: "Tautuhinga",
            terms: "Ture",
            privacy: "Tūmataitinga"
          },
          chat: {
            placeholder: "Tuhia tō karere..."
          },
          helpPage: {
            title: "Pokapū Āwhina – Kiwi-Ops",
            description: "Rapua ngā whakautu, ngā FAQ me ngā āwhina tautoko i konei.",
            faqTitle: "Ngā Pātai Auau",
            faqIntro: "Anei ngā pātai tino auau a ngā āpiha.",
            question1: "Me pēhea taku huri i taku waehere muna?",
            answer1: "Haere ki ngā tautuhinga pūkete, tīpakohia 'Hurihia te waehere muna'.",
            question2: "Me pēhea te whakapā atu ki te Tari Matua?",
            answer2: "Whakamahia te ara haumaru kei te wāhanga 'Hononga'.",
            viewAllFaq: "Tirohia katoa ngā FAQ",
            contactTitle: "Whakapā ki te Tautoko Tari Matua",
            contactIntro: "Kāore i kitea tō whakautu? Kei konei te rōpū ki te āwhina.",
            contactGeneral: "Ngā pātai whānui",
            contactTech: "Raru hangarau",
            contactAccounts: "Ngā pātai whakamanatanga",
            contactDisclaimer: "Ka tiakina katoatia ngā kōrero katoa.",
            footer: "Kei te mahi te kawa āwhina."
          }
        }
      }
    },

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;