// Script pour le popup de l'extension
import { type Password } from './lib/decoder';

// Éléments du DOM
const clientFileInput = document.getElementById('client-file') as HTMLInputElement;
const loadBtn = document.getElementById('load-btn') as HTMLButtonElement;
const authBtn = document.getElementById('auth-btn') as HTMLButtonElement;
const getPasswordsBtn = document.getElementById('get-passwords-btn') as HTMLButtonElement;
const statusMessage = document.getElementById('status-message') as HTMLDivElement;
const passwordList = document.getElementById('password-list') as HTMLDivElement;
const fileInputButton = document.querySelector('.file-input-button') as HTMLDivElement;
const fileName = document.getElementById('file-name') as HTMLDivElement;

// Variables d'état
let clientLoaded = false;
let authenticated = false;
// Désactiver les boutons au démarrage
authBtn.disabled = true;
getPasswordsBtn.disabled = true;

// Fonction pour vérifier si un client sécurisé est disponible
function checkSecureClient() {
  showStatus('Vérification du client sécurisé...', 'info');
  
  chrome.runtime.sendMessage(
    { action: 'checkSecureClient' },
    (response) => {
      if (response && response.success) {
        // Un client sécurisé est disponible, on peut activer les fonctionnalités
        clientLoaded = true;
        authenticated = true;
        authBtn.disabled = false;
        getPasswordsBtn.disabled = false;
        showStatus('Session active récupérée', 'success');
        
        // Vérifier si des mots de passe sécurisés sont disponibles
        checkSecurePasswords();
      } else {
        // Pas de client sécurisé, l'utilisateur doit charger son fichier client
        showStatus('Veuillez charger votre fichier client', 'info');
      }
    }
  );
}

// Fonction pour vérifier si des mots de passe sécurisés sont disponibles
function checkSecurePasswords() {
  chrome.runtime.sendMessage(
    { action: 'checkSecurePasswords' },
    (response) => {
      if (response && response.success && response.passwords) {
        // Des mots de passe sécurisés sont disponibles, les afficher
        displayPasswords(response.passwords);
      }
    }
  );
}

// Vérifier si un client sécurisé est disponible au démarrage
document.addEventListener('DOMContentLoaded', checkSecureClient);

// Afficher le nom du fichier sélectionné
clientFileInput.addEventListener('change', () => {
  if (clientFileInput.files && clientFileInput.files.length > 0) {
    fileName.textContent = clientFileInput.files[0].name;
    fileName.style.display = 'block';
    fileInputButton.style.borderColor = 'var(--primary-color)';
  } else {
    fileName.style.display = 'none';
    fileInputButton.style.borderColor = '#ccc';
  }
});

// Gestionnaire d'événement pour le bouton de chargement du client
loadBtn.addEventListener('click', () => {
  if (!clientFileInput.files || clientFileInput.files.length === 0) {
    showStatus('Veuillez sélectionner un fichier client', 'error');
    return;
  }
  
  const file = clientFileInput.files[0];
  const reader = new FileReader();
  
  // Afficher un message de chargement
  showStatus('Chargement du client en cours...', 'info');
  
  reader.onload = (event) => {
    if (event.target && event.target.result) {
      const base64Data = event.target.result.toString().split(',')[1];
      
      // Envoyer le fichier au background script
      chrome.runtime.sendMessage(
        { action: 'loadClient', fileData: base64Data },
        (response) => {
          if (response && response.success) {
            clientLoaded = true;
            authBtn.disabled = false;
            showStatus('Client chargé avec succès', 'success');
          } else {
            showStatus('Échec du chargement du client: ' + (response ? response.message : 'Erreur inconnue'), 'error');
          }
        }
      );
    }
  };
  
  reader.readAsDataURL(file);
});

// Gestionnaire d'événement pour le bouton d'authentification
authBtn.addEventListener('click', () => {
  // Afficher un message de chargement
  showStatus('Authentification en cours...', 'info');

  // Envoyer la demande d'authentification au background script
  chrome.runtime.sendMessage(
    { action: 'authenticate' },
    (response) => {
      if (response && response.success) {
        authenticated = true;
        getPasswordsBtn.disabled = false;
        showStatus('Authentification réussie', 'success');
      } else {
        showStatus('Échec de l\'authentification: ' + (response ? response.message : 'Erreur inconnue'), 'error');
      }
    }
  );
});

// Gestionnaire d'événement pour le bouton de récupération des mots de passe
getPasswordsBtn.addEventListener('click', () => {
  
  // Afficher un message de chargement
  showStatus('Récupération des mots de passe...', 'info');
  
  // Envoyer la demande de récupération des mots de passe au background script
  chrome.runtime.sendMessage(
    { action: 'getPasswords' },
    (response) => {
      if (response && response.success) {
        showStatus('Mots de passe récupérés avec succès', 'success');
        displayPasswords(response.passwords);
      } else {
        showStatus('Échec de la récupération des mots de passe: ' + (response ? response.message : 'Erreur inconnue'), 'error');
      }
    }
  );
});

/**
 * Affiche un message de statut
 * @param message Message à afficher
 * @param type Type de message (success, error, info)
 */
function showStatus(message: string, type: 'success' | 'error' | 'info'): void {
  statusMessage.innerHTML = '';
  
  const icon = document.createElement('i');
  
  switch (type) {
    case 'success':
      icon.className = 'fas fa-check-circle';
      break;
    case 'error':
      icon.className = 'fas fa-exclamation-circle';
      break;
    case 'info':
      icon.className = 'fas fa-info-circle';
      break;
  }
  
  statusMessage.appendChild(icon);
  statusMessage.appendChild(document.createTextNode(message));
  statusMessage.className = 'status ' + type;
  statusMessage.style.display = 'flex';
}

/**
 * Affiche la liste des mots de passe
 * @param passwords Liste des mots de passe à afficher
 */
function displayPasswords(passwords: Password[]): void {
  // Vider la liste actuelle
  passwordList.innerHTML = '';
  
  if (passwords.length === 0) {
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-state';
    
    const icon = document.createElement('i');
    icon.className = 'fas fa-search';
    
    const message = document.createElement('p');
    message.textContent = 'Aucun mot de passe trouvé';
    
    emptyState.appendChild(icon);
    emptyState.appendChild(message);
    passwordList.appendChild(emptyState);
  } else {
    // Créer un élément pour chaque mot de passe
    passwords.forEach((password) => {
      const passwordItem = document.createElement('div');
      passwordItem.className = 'password-item';
      
      const site = document.createElement('div');
      site.className = 'site';
      
      const siteIcon = document.createElement('i');
      siteIcon.className = 'fas fa-globe';
      site.appendChild(siteIcon);
      
      // Utiliser une propriété qui existe sur le type Password ou accéder de manière sécurisée
      const siteName = (password as any).url || 'Site inconnu';
      site.appendChild(document.createTextNode(siteName));
      
      const username = document.createElement('div');
      username.className = 'username';
      
      const userIcon = document.createElement('i');
      userIcon.className = 'fas fa-user';
      username.appendChild(userIcon);
      
      username.appendChild(document.createTextNode(password.username));
      
      const actions = document.createElement('div');
      actions.className = 'actions';
      
      const copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
      copyBtn.setAttribute('data-tooltip', 'Copier le mot de passe');
      copyBtn.classList.add('tooltip');
      
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(password.password)
          .then(() => {
            copyBtn.innerHTML = '<i class="fas fa-check"></i> Copié!';
            setTimeout(() => {
              copyBtn.innerHTML = '<i class="fas fa-copy"></i> Copier';
            }, 2000);
          })
          .catch((error) => {
            console.error('Erreur lors de la copie:', error);
          });
      });
      
      const fillBtn = document.createElement('button');
      fillBtn.className = 'fill-btn';
      fillBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Remplir';
      fillBtn.setAttribute('data-tooltip', 'Remplir le formulaire');
      fillBtn.classList.add('tooltip');
      
      fillBtn.addEventListener('click', () => {
        // Envoyer un message au content script pour remplir le formulaire
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0].id) {
            chrome.tabs.sendMessage(
              tabs[0].id,
              {
                action: 'fillPassword',
                site: (password as any).url || 'Site inconnu',
                username: password.username,
                password: password.password
              },
              (response) => {
                if (response && response.success) {
                  fillBtn.innerHTML = '<i class="fas fa-check"></i> Rempli!';
                  setTimeout(() => {
                    fillBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Remplir';
                  }, 2000);
                }
              }
            );
          }
        });
      });
      
      actions.appendChild(copyBtn);
      actions.appendChild(fillBtn);
      
      passwordItem.appendChild(site);
      passwordItem.appendChild(username);
      passwordItem.appendChild(actions);
      
      passwordList.appendChild(passwordItem);
    });
  }
  
  // Afficher la liste
  passwordList.style.display = 'block';
}

// Fonction pour classifier les champs sur la page active
async function classifyFields() {
  try {
    // Afficher un indicateur de chargement
    const classifyBtn = document.getElementById('classifyFieldsBtn') as HTMLButtonElement;
    const originalText = classifyBtn.textContent;
    classifyBtn.textContent = 'Classification en cours...';
    classifyBtn.disabled = true;
    
    // Envoyer un message au background script pour classifier les champs
    const response = await new Promise<any>((resolve, reject) => {
      chrome.runtime.sendMessage({ action: 'classifyFields' }, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
    
    if (!response || !response.success) {
      throw new Error(response?.message || 'Échec de la classification des champs');
    }
    
    // Afficher les résultats
    const fields = response.fields;
    document.getElementById('usernameCount')!.textContent = fields.username.length.toString();
    document.getElementById('passwordCount')!.textContent = fields.password.length.toString();
    document.getElementById('emailCount')!.textContent = fields.email.length.toString();
    document.getElementById('unknownCount')!.textContent = fields.unknown.length.toString();
    
    // Afficher la section des résultats
    document.getElementById('classificationResults')!.classList.remove('hidden');
    
    // Restaurer le bouton
    classifyBtn.textContent = originalText;
    classifyBtn.disabled = false;
  } catch (error) {
    console.error('Erreur lors de la classification des champs:', error);
    alert(`Erreur: ${error instanceof Error ? error.message : String(error)}`);
    
    // Restaurer le bouton en cas d'erreur
    const classifyBtn = document.getElementById('classifyFieldsBtn') as HTMLButtonElement;
    classifyBtn.textContent = 'Classifier les champs sur cette page';
    classifyBtn.disabled = false;
  }
}

// Ajouter un écouteur d'événements pour le bouton de classification
document.addEventListener('DOMContentLoaded', () => {
  // ... existing event listeners ...
  
  // Ajouter un écouteur pour le bouton de classification
  const classifyBtn = document.getElementById('classifyFieldsBtn');
  if (classifyBtn) {
    classifyBtn.addEventListener('click', classifyFields);
  }
});

// Exporter une fonction vide pour que le bundler ne se plaigne pas
export {}; 