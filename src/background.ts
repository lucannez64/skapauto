// Service worker pour l'extension
import { auth, get_all, loadClientFromFile } from './lib/client';
import { type ClientEx, type Uuid, type Password } from './lib/decoder';

// Importer la bibliothèque pour générer des codes TOTP
// Note: Il faudra ajouter cette dépendance au projet avec npm install otplib
import * as OTPAuth from "otpauth";

// Interface pour les paramètres TOTP
interface TOTPParams {
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
}

// Constante pour la durée de validité du client (1 heure en millisecondes)
const CLIENT_EXPIRATION_TIME = 60 * 60 * 1000; // 1 heure

// Stocker le client en mémoire
let currentClient: ClientEx | null = null;
// Stocker les mots de passe en mémoire
let cachedPasswords: Password[] | null = null;

// Fonction pour exporter le token de session depuis le module client
export function setSessionToken(token: string) {
  // Stocker le token dans le stockage local
  chrome.storage.local.set({ 'sessionToken': token }, () => {
    console.log('Token de session sauvegardé dans le stockage local');
  });
}

// Fonction pour restaurer le token de session
export function getSessionToken(): Promise<string | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['sessionToken'], (result) => {
      resolve(result.sessionToken || null);
    });
  });
}

// Fonction pour stocker le client de manière sécurisée avec une expiration d'une heure
function storeClientSecurely(client: ClientEx): Promise<void> {
  const expirationTime = Date.now() + CLIENT_EXPIRATION_TIME;
  
  return new Promise((resolve) => {
    // Utiliser chrome.storage.session pour un stockage sécurisé en mémoire
    chrome.storage.session.set({
      'secureClient': {
        client: client,
        expirationTime: expirationTime
      }
    }, () => {
      console.log('Client stocké de manière sécurisée avec expiration dans 1 heure');
      resolve();
    });
  });
}

// Fonction pour stocker les mots de passe de manière sécurisée avec une expiration d'une heure
function storePasswordsSecurely(passwords: Password[]): Promise<void> {
  const expirationTime = Date.now() + CLIENT_EXPIRATION_TIME;
  
  return new Promise((resolve) => {
    // Utiliser chrome.storage.session pour un stockage sécurisé en mémoire
    chrome.storage.session.set({
      'securePasswords': {
        passwords: passwords,
        expirationTime: expirationTime
      }
    }, () => {
      console.log('Mots de passe stockés de manière sécurisée avec expiration dans 1 heure');
      resolve();
    });
  });
}

// Fonction pour récupérer le client stocké s'il est toujours valide
async function getSecureClient(): Promise<ClientEx | null> {
  return new Promise((resolve) => {
    chrome.storage.session.get(['secureClient'], (result) => {
      if (result.secureClient && result.secureClient.expirationTime > Date.now()) {
        console.log('Client récupéré du stockage sécurisé');
        resolve(result.secureClient.client);
      } else {
        if (result.secureClient) {
          console.log('Client expiré, suppression du stockage');
          chrome.storage.session.remove(['secureClient']);
        }
        resolve(null);
      }
    });
  });
}

// Fonction pour récupérer les mots de passe stockés s'ils sont toujours valides
async function getSecurePasswords(): Promise<Password[] | null> {
  return new Promise((resolve) => {
    chrome.storage.session.get(['securePasswords'], (result) => {
      if (result.securePasswords && result.securePasswords.expirationTime > Date.now()) {
        console.log('Mots de passe récupérés du stockage sécurisé');
        resolve(result.securePasswords.passwords);
      } else {
        if (result.securePasswords) {
          console.log('Mots de passe expirés, suppression du stockage');
          chrome.storage.session.remove(['securePasswords']);
        }
        resolve(null);
      }
    });
  });
}

// Écouter les messages du popup ou des scripts de contenu
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message reçu dans le background:', message);
  
  // Traiter les différents types de messages
  switch (message.action) {
    case 'loadClient':
      // Charger le client à partir d'un fichier
      if (message.fileData) {
        const arrayBuffer = base64ToArrayBuffer(message.fileData);
        const client = loadClientFromFile(arrayBuffer);
        if (client) {
          currentClient = client;
          // Stocker le client dans le stockage local pour le récupérer après un redémarrage
          chrome.storage.local.set({ 'currentClient': client }, () => {
            console.log('Client sauvegardé dans le stockage local');
          });
          sendResponse({ success: true, message: 'Client chargé avec succès' });
        } else {
          sendResponse({ success: false, message: 'Échec du chargement du client' });
        }
      }
      break;
      
    case 'authenticate':
      // Authentifier le client
      if (currentClient && currentClient.id.id) {
        auth(currentClient.id.id!, currentClient.c)
          .then(result => {
            if (result.error) {
              sendResponse({ success: false, message: result.error });
            } else {
              // Mettre à jour le client avec la clé secrète
              if (currentClient && result.client) {
                currentClient.c = result.client;
                // Stocker le client mis à jour dans le stockage local
                chrome.storage.local.set({ 'currentClient': currentClient }, () => {
                  console.log('Client authentifié sauvegardé dans le stockage local');
                });
                
                // Stocker le client de manière sécurisée avec expiration
                storeClientSecurely(currentClient)
                  .then(() => {
                    console.log('Client authentifié stocké de manière sécurisée');
                  });
              }
              sendResponse({ success: true, message: 'Authentification réussie' });
            }
          })
          .catch(error => {
            sendResponse({ success: false, message: error.toString() });
          });
        return true; // Indique que la réponse sera envoyée de manière asynchrone
      } else {
        sendResponse({ success: false, message: 'Client ou UUID manquant' });
      }
      break;
      
    case 'getPasswords':
      // D'abord vérifier si nous avons des mots de passe en cache
      getSecurePasswords().then(passwords => {
        if (passwords) {
          // Utiliser les mots de passe en cache
          cachedPasswords = passwords;
          console.log('Utilisation des mots de passe en cache');
          sendResponse({ success: true, passwords: passwords });
        } else if (currentClient && currentClient.id.id) {
          // Récupérer tous les mots de passe depuis le serveur
          get_all(currentClient.id.id!, currentClient.c)
            .then(result => {
              if (result.error) {
                sendResponse({ success: false, message: result.error });
              } else {
                // Stocker les mots de passe en cache
                const passwords = result.passwords;
                if (passwords && passwords.length > 0) {
                  cachedPasswords = passwords;
                  // Stocker les mots de passe de manière sécurisée
                  storePasswordsSecurely(passwords)
                    .then(() => {
                      console.log('Mots de passe stockés de manière sécurisée');
                    });
                }
                console.log('Mots de passe récupérés:', passwords);
                sendResponse({ 
                  success: true, 
                  passwords: passwords
                });
              }
            })
            .catch(error => {
              sendResponse({ success: false, message: error.toString() });
            });
        } else {
          sendResponse({ success: false, message: 'Client ou UUID manquant' });
        }
      });
      return true; // Indique que la réponse sera envoyée de manière asynchrone
      
    case 'saveSessionToken':
      // Sauvegarder le token de session
      if (message.token) {
        setSessionToken(message.token);
        sendResponse({ success: true, message: 'Token de session sauvegardé' });
      } else {
        sendResponse({ success: false, message: 'Token de session manquant' });
      }
      break;

    case 'checkSecureClient':
      // Vérifier si un client sécurisé est disponible
      getSecureClient()
        .then(client => {
          if (client) {
            currentClient = client;
            sendResponse({ success: true, message: 'Client sécurisé disponible' });
          } else {
            sendResponse({ success: false, message: 'Aucun client sécurisé disponible' });
          }
        });
      return true; // Indique que la réponse sera envoyée de manière asynchrone

    case 'checkSecurePasswords':
      // Vérifier si des mots de passe sécurisés sont disponibles
      getSecurePasswords()
        .then(passwords => {
          if (passwords && passwords.length > 0) {
            cachedPasswords = passwords;
            sendResponse({ success: true, passwords: passwords });
          } else {
            sendResponse({ success: false, message: 'Aucun mot de passe sécurisé disponible' });
          }
        });
      return true; // Indique que la réponse sera envoyée de manière asynchrone

    case 'classifyFields':
      console.log('Demande de classification des champs');
      classifyFormFields()
        .then(fields => {
          sendResponse({ success: true, fields });
        })
        .catch(error => {
          console.error('Erreur lors de la classification des champs:', error);
          sendResponse({ success: false, message: error.message });
        });
      return true; // Indique que la réponse sera envoyée de manière asynchrone

    case 'generateTOTP':
      // Générer un code TOTP
      if (message.params) {
        try {
          const code = generateTOTPCode(message.params);
          sendResponse({ success: true, code: code });
        } catch (error) {
          console.error('Erreur lors de la génération du code TOTP:', error);
          sendResponse({ success: false, message: error.toString() });
        }
      } else {
        sendResponse({ success: false, message: 'Paramètres TOTP manquants' });
      }
      break;

    default:
      sendResponse({ success: false, message: 'Action non reconnue' });
  }

  return true; // Indique que la réponse sera envoyée de manière asynchrone
});

// Fonction utilitaire pour convertir une chaîne base64 en ArrayBuffer
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// Restaurer le client depuis le stockage local ou sécurisé au démarrage
async function initializeClient() {
  // D'abord, essayer de récupérer le client sécurisé (qui a une durée de vie d'une heure)
  const secureClient = await getSecureClient();
  
  if (secureClient) {
    currentClient = secureClient;
    console.log('Client restauré depuis le stockage sécurisé');
    
    // Récupérer également les mots de passe sécurisés
    const securePasswords = await getSecurePasswords();
    if (securePasswords) {
      cachedPasswords = securePasswords;
      console.log('Mots de passe restaurés depuis le stockage sécurisé');
    }
  } else {
    // Si pas de client sécurisé, essayer le stockage local
    chrome.storage.local.get(['currentClient'], (result) => {
      if (result.currentClient) {
        currentClient = result.currentClient;
        console.log('Client restauré depuis le stockage local');
      }
    });
  }
  
  // Restaurer le token de session
  chrome.storage.local.get(['sessionToken'], (result) => {
    if (result.sessionToken) {
      console.log('Token de session restauré depuis le stockage local');
      // Informer le module client du token de session
      chrome.runtime.sendMessage({ 
        action: 'restoreSessionToken', 
        token: result.sessionToken 
      });
    }
  });
}

// Initialiser le client au démarrage
initializeClient();

// Afficher un message lorsque le service worker est installé
console.log('Service worker SkapAuto installé');

// Exporter une fonction vide pour que le bundler ne se plaigne pas
export {};

// Fonction pour classifier les champs de formulaire sur la page active
async function classifyFormFields(): Promise<any> {
  return new Promise((resolve, reject) => {
    // Obtenir l'onglet actif
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs || tabs.length === 0) {
        reject(new Error('Aucun onglet actif trouvé'));
        return;
      }
      
      const activeTab = tabs[0];
      if (!activeTab.id) {
        reject(new Error('L\'onglet actif n\'a pas d\'ID'));
        return;
      }
      
      // Envoyer un message au script de contenu pour classifier les champs
      chrome.tabs.sendMessage(
        activeTab.id,
        { action: 'classifyFields' },
        (response) => {
          if (chrome.runtime.lastError) {
            reject(new Error(`Erreur lors de l'envoi du message: ${chrome.runtime.lastError.message}`));
            return;
          }
          
          if (!response || !response.success) {
            reject(new Error(response?.message || 'Échec de la classification des champs'));
            return;
          }
          
          resolve(response.fields);
        }
      );
    });
  });
}

/**
 * Génère un code TOTP à partir des paramètres fournis
 * @param params Paramètres TOTP (secret, algorithme, etc.)
 * @returns Code TOTP généré
 */
function generateTOTPCode(params: TOTPParams): string {
  try {
    console.log('Génération du code TOTP avec les paramètres:', params);
    
    // Configurer l'authenticator
    const totp = new OTPAuth.TOTP({    
      secret: params.secret,
      algorithm: params.algorithm,
      digits: params.digits,
      period: params.period,
      issuer: undefined,
    });
    
    // Générer le code
    const code = totp.generate();
    console.log('Code TOTP généré:', code);
    
    return code;
  } catch (error) {
    console.error('Erreur lors de la génération du code TOTP:', error);
    throw error;
  }
} 