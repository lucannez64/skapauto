// Script de contenu injecté dans les pages web
console.log('SkapAuto content script chargé');

// Définir les types de champs que nous voulons identifier
type FieldType = 'username' | 'password' | 'email' | 'otp' | 'unknown';

// Interface pour les identifiants
interface Credential {
  username: string;
  password: string;
  url: string | null;
  description: string | null;
  otp?: string | null;
  favicon?: string | null;
  service?: string | null;
}

// Interface pour les paramètres TOTP
interface TOTPParams {
  secret: string;
  algorithm: string;
  digits: number;
  period: number;
}

// Configuration pour l'identification des champs
const siteConfig = {
  blackList: {
    form: { names: ["search"], ids: ["search"] },
    fields: { names: ["search", "q", "query"], ids: ["search", "q"] }
  },
  whiteList: {
    form: { names: ["login"], ids: ["login"] },
    fields: {
      // Noms de champs de nom d'utilisateur
      usernameNames: [
        "username",
        "current-email",
        "j_username",
        "user_name",
        "user",
        "user-name",
        "login",
        "vb_login_username",
        "name",
        "user name",
        "user id",
        "user-id",
        "userid",
        "email",
        "e-mail",
        "id",
        "form_loginname",
        "wpname",
        "mail",
        "loginid",
        "login id",
        "login_name",
        "openid_identifier",
        "authentication_email",
        "openid",
        "auth_email",
        "auth_id",
        "authentication_identifier",
        "authentication_id",
        "customer_number",
        "customernumber",
        "onlineid",
        "identifier",
        "ww_x_util",
        "loginfmt",
        "user_name",
      ],
      // IDs de champs de nom d'utilisateur
      usernameIds: [
        "username",
        "j_username",
        "user_name",
        "user",
        "user-name",
        "login",
        "vb_login_username",
        "name",
        "user-id",
        "current-email",
        "userid",
        "email",
        "e-mail",
        "id",
        "form_loginname",
        "wpname",
        "mail",
        "loginid",
        "login_name",
        "login-username",
        "openid_identifier",
        "authentication_email",
        "openid",
        "auth_email",
        "auth_id",
        "authentication_identifier",
        "authentication_id",
        "customer_number",
        "customernumber",
        "onlineid",
        "identifierId",
        "ww_x_util"
      ],
      // Noms de champs de mot de passe
      passwordNames: [
        "password",
        "pass",
        "passwd",
        "pwd",
        "j_password",
        "user_password",
        "user-password",
        "login_password",
        "login-password",
        "passwort",
        "contraseña",
        "senha",
        "mot de passe",
        "current-password",
        "auth_pass",
        "authentication_password",
        "web_password",
        "wppassword",
        "userpassword",
        "user-pass",
        "form_pw",
        "login_password",
        "loginpassword",
        "session_password",
        "sessionpassword",
        "login_password",
        "pwd",
        "ap_password",
        "pass",
        "password1",
        "password-1",
        "passwd",
        "pass-word",
        "passw",
        "passwrd",
        "upassword",
        "user_pass"
      ],
      // IDs de champs de mot de passe
      passwordIds: [
        "password",
        "pass",
        "passwd",
        "pwd",
        "j_password",
        "user_password",
        "user-password",
        "login_password",
        "login-password",
        "passwort",
        "current-password",
        "auth_pass",
        "authentication_password",
        "web_password",
        "wppassword",
        "userpassword",
        "user-pass",
        "form_pw",
        "login_password",
        "loginpassword",
        "session_password",
        "sessionpassword",
        "login_password",
        "pwd",
        "ap_password",
        "pass",
        "password1",
        "password-1",
        "passwd",
        "pass-word",
        "passw",
        "passwrd",
        "upassword",
        "user_pass"
      ],
      // Noms de champs d'email
      emailNames: [
        "email",
        "e-mail",
        "mail",
        "courriel",
        "email_address",
        "email-address",
        "emailaddress",
        "user_email",
        "user-email",
        "login_email",
        "login-email",
        "authentication_email",
        "auth_email",
        "form_email",
        "wpmail",
        "mail_address",
        "mail-address",
        "mailaddress",
        "address",
        "e_mail",
        "e_mail_address",
        "emailid",
        "email_id",
        "email-id"
      ],
      // IDs de champs d'email
      emailIds: [
        "email",
        "e-mail",
        "mail",
        "courriel",
        "email_address",
        "email-address",
        "emailaddress",
        "user_email",
        "user-email",
        "login_email",
        "login-email",
        "authentication_email",
        "auth_email",
        "form_email",
        "wpmail",
        "mail_address",
        "mail-address",
        "mailaddress",
        "address",
        "e_mail",
        "e_mail_address",
        "emailid",
        "email_id",
        "email-id"
      ],
      // Noms de champs OTP
      otpNames: [
        "otp",
        "one-time-password",
        "one_time_password",
        "verification-code",
        "verification_code",
        "verificationcode",
        "security-code",
        "security_code",
        "securitycode",
        "auth-code",
        "auth_code",
        "authcode",
        "code",
        "code-input",
        "code_input",
        "codeinput",
        "pin",
        "pin-code",
        "pin_code",
        "pincode",
        "token",
        "token-code",
        "token_code",
        "tokencode",
        "mfa-code",
        "mfa_code",
        "mfacode",
        "2fa-code",
        "2fa_code",
        "2facode",
        "two-factor-code",
        "two_factor_code",
        "twofactorcode",
        "totp",
        "totp-code",
        "totp_code",
        "totpcode"
      ],
      // IDs de champs OTP
      otpIds: [
        "otp",
        "one-time-password",
        "one_time_password",
        "verification-code",
        "verification_code",
        "verificationcode",
        "security-code",
        "security_code",
        "securitycode",
        "auth-code",
        "auth_code",
        "authcode",
        "code",
        "code-input",
        "code_input",
        "codeinput",
        "pin",
        "pin-code",
        "pin_code",
        "pincode",
        "token",
        "token-code",
        "token_code",
        "tokencode",
        "mfa-code",
        "mfa_code",
        "mfacode",
        "2fa-code",
        "2fa_code",
        "2facode",
        "two-factor-code",
        "two_factor_code",
        "twofactorcode",
        "totp",
        "totp-code",
        "totp_code",
        "totpcode"
      ]
    }
  }
};

// Variable pour suivre si l'autofill a déjà été tenté
let autofillAttempted = false;
let otpAutofillAttempted = false;

// Initialiser le script dès le chargement
(async () => {
  try {
    // Vérifier s'il y a des champs de formulaire sur la page
    const fields = identifyFormFields();
    
    // Si des champs de formulaire sont détectés, tenter l'autofill automatique
    if (fields.password.length > 0 && (fields.username.length > 0 || fields.email.length > 0)) {
      console.log('Champs de formulaire détectés, tentative d\'autofill automatique');
      await autoFillCredentials();
      autofillAttempted = true;
    }
    
    // Si des champs OTP sont détectés, tenter l'autofill automatique
    if (fields.otp.length > 0) {
      console.log('Champs OTP détectés, tentative d\'autofill automatique');
      await autoFillOTP();
      otpAutofillAttempted = true;
    }
    
    // Configurer l'observateur de mutations pour détecter les nouveaux champs de formulaire
    setupMutationObserver();
    
    // Configurer la détection de soumission de formulaire pour sauvegarder les identifiants
    setupFormSubmissionDetection();
    
    console.log('Initialisation complète du script de contenu');
  } catch (error) {
    console.error('Erreur lors de l\'initialisation du script de contenu:', error);
  }
})();

/**
 * Configure un observateur de mutations pour détecter les nouveaux champs de formulaire
 */
function setupMutationObserver(): void {
  // Créer un observateur de mutations
  const observer = new MutationObserver((mutations) => {
    // Vérifier si de nouveaux éléments ont été ajoutés
    let newInputsDetected = false;
    
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Parcourir les nœuds ajoutés
        for (const node of Array.from(mutation.addedNodes)) {
          // Vérifier si le nœud est un élément HTML
          if (node instanceof HTMLElement) {
            // Vérifier si l'élément contient des champs de formulaire
            const inputs = node.querySelectorAll('input');
            if (inputs.length > 0) {
              newInputsDetected = true;
              break;
            }
          }
        }
      }
      
      if (newInputsDetected) break;
    }
    
    // Si de nouveaux champs ont été détectés, vérifier s'il s'agit de champs de formulaire
    if (newInputsDetected) {
      console.log('Nouveaux champs détectés, vérification...');
      setTimeout(checkForNewLoginForms, 1000); // Attendre que le DOM soit stable
   }
  });
  
  // Observer les modifications du document
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  
  console.log('Observateur de mutations configuré');
}

/**
 * Vérifie si de nouveaux formulaires de connexion sont apparus
 */
async function checkForNewLoginForms(): Promise<void> {
  // Identifier les champs de formulaire
  const fields = identifyFormFields();
  console.log('Champs de formulaire détectés:', fields);
  
  // Si des champs de formulaire sont détectés et que l'autofill n'a pas encore été tenté
  if (fields.password.length > 0 || fields.username.length > 0 || fields.email.length > 0) {
    // Vérifier si les champs sont vides (non remplis)
    const passwordEmpty = fields.password.some(field => !field.value || field.value === '');
    const usernameEmpty = fields.username.some(field => !field.value || field.value === '') || 
                          (fields.username.length === 0 && fields.email.some(field => !field.value || field.value === ''));
    console.log(usernameEmpty);

    
    if (passwordEmpty && usernameEmpty) {
      console.log('Nouveau formulaire de connexion détecté, tentative d\'autofill');
      await autoFillCredentials();
      autofillAttempted = true;
    } else if (passwordEmpty) {
      console.log('Nouveau formulaire de connexion détecté, tentative d\'autofill');
      await autoFillCredentials();
      autofillAttempted = true;
    } else if (usernameEmpty) {
      console.log('Nouveau formulaire de connexion détecté, tentative d\'autofill');
      await autoFillCredentials();
      otpAutofillAttempted = true;
    }
    
    
  }
  
  // Si des champs OTP sont détectés et que l'autofill OTP n'a pas encore été tenté
  if (fields.otp.length > 0 && !otpAutofillAttempted) {
    // Vérifier si les champs sont vides (non remplis)
    const otpEmpty = fields.otp.some(field => !field.value);
    
    if (otpEmpty) {
      console.log('Nouveau champ OTP détecté, tentative d\'autofill');
      await autoFillOTP();
      otpAutofillAttempted = true;
    }
  }
}

// Écouter les messages du background
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Message reçu dans le content script:', message);
  // Traiter les différents types de messages
  switch (message.action) {
    case 'fillPassword':
      // Remplir un formulaire avec un mot de passe
      if (message.site && message.username && message.password) {
        fillPasswordForm(message.username, message.password);
        sendResponse({ success: true, message: 'Formulaire rempli' });
      } else {
        sendResponse({ success: false, message: 'Informations de connexion incomplètes' });
      }
      break;
      
    case 'fillOTP':
      // Remplir un champ OTP avec un code
      if (message.otp) {
        fillOTPField(message.otp);
        sendResponse({ success: true, message: 'Champ OTP rempli' });
      } else {
        sendResponse({ success: false, message: 'Code OTP manquant' });
      }
      break;
      
    case 'identifyFields':
      console.log('Identifier les champs de formulaire sur la page');
      // Identifier les champs de formulaire sur la page
      const result = identifyFormFields();
      sendResponse({ success: true, fields: result });
      break;
      
    case 'forceAutofill':
      // Forcer l'autofill même si déjà tenté
      autofillAttempted = false;
      autoFillCredentials().then(() => {
        sendResponse({ success: true, message: 'Autofill forcé effectué' });
      }).catch(error => {
        sendResponse({ success: false, message: error.message });
      });
      return true; // Indique que la réponse sera envoyée de manière asynchrone
      
    case 'forceOTPAutofill':
      // Forcer l'autofill OTP même si déjà tenté
      otpAutofillAttempted = false;
      autoFillOTP().then(() => {
        sendResponse({ success: true, message: 'Autofill OTP forcé effectué' });
      }).catch(error => {
        sendResponse({ success: false, message: error.message });
      });
      return true; // Indique que la réponse sera envoyée de manière asynchrone
      
    default:
      sendResponse({ success: false, message: 'Action non reconnue' });
  }
  
  return true; // Indique que la réponse sera envoyée de manière asynchrone
});

/**
 * Récupère les identifiants correspondant à l'URL actuelle
 * @returns Promise avec les identifiants correspondants
 */
async function getMatchingCredentials(): Promise<Credential[]> {
  return new Promise((resolve) => {
    // Récupérer tous les mots de passe depuis le background
    chrome.runtime.sendMessage({ action: 'getPasswords' }, (response) => {
      if (response && response.success && response.passwords) {
        const currentUrl = window.location.href;
        const currentHostname = window.location.hostname;
        
        // Filtrer les mots de passe qui correspondent à l'URL actuelle
        const matchingPasswords = response.passwords.filter((password: any) => {
          if (!password.url) return false;
          
          try {
            // Essayer de créer un objet URL à partir de l'URL stockée
            const storedUrl = new URL(password.url);
            // Vérifier si le hostname correspond
            return storedUrl.hostname === currentHostname;
          } catch (e) {
            // Si l'URL n'est pas valide, vérifier si elle est contenue dans l'URL actuelle
            return currentUrl.includes(password.url) || currentHostname.includes(password.url);
          }
        });
        
        // Convertir les mots de passe en identifiants
        const credentials: Credential[] = matchingPasswords.map((password: any) => ({
          username: password.username,
          password: password.password,
          url: password.url,
          description: password.description,
          otp: password.otp
        }));
        
        resolve(credentials);
      } else {
        resolve([]);
      }
    });
  });
}

/**
 * Affiche un menu de confirmation pour l'autofill
 * @param credential Identifiant à utiliser
 */
function showConfirmationMenu(credential: Credential): void {
  // Supprimer tout menu existant
  const existingMenu = document.getElementById('skapauto-confirmation-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Créer le menu
  const menu = document.createElement('div');
  menu.id = 'skapauto-confirmation-menu';
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.backgroundColor = '#ced7e1';
  menu.style.borderRadius = '0.5rem';
  menu.style.padding = '16px';
  menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  menu.style.zIndex = '9999';
  menu.style.maxWidth = '300px';
  menu.style.fontFamily = "'Work Sans', sans-serif";
  menu.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
  
  // Ajouter un titre
  const title = document.createElement('div');
  title.textContent = 'Confirmer l\'autofill';
  title.style.fontFamily = "'Raleway', sans-serif";
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.style.borderBottom = '1px solid #1d1b21';
  title.style.paddingBottom = '5px';
  title.style.color = '#1d1b21';
  menu.appendChild(title);
  
  // Ajouter les informations du compte
  const info = document.createElement('div');
  info.style.marginBottom = '10px';
  info.style.padding = '5px';
  
  const usernameSpan = document.createElement('div');
  usernameSpan.textContent = `Nom d'utilisateur: ${credential.username}`;
  usernameSpan.style.fontWeight = 'bold';
  usernameSpan.style.color = '#1d1b21';
  info.appendChild(usernameSpan);
  
  const serviceSpan = document.createElement('div');
  serviceSpan.textContent = `Service: ${credential.url}`;
  serviceSpan.style.color = '#474b4f';
  serviceSpan.style.fontSize = '0.9em';
  info.appendChild(serviceSpan);
  
  menu.appendChild(info);
  
  // Conteneur pour les boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '16px';
  
  // Bouton Accepter
  const acceptButton = document.createElement('div');
  acceptButton.textContent = 'Accepter';
  acceptButton.style.flex = '1';
  acceptButton.style.textAlign = 'center';
  acceptButton.style.padding = '8px';
  acceptButton.style.backgroundColor = '#a7f3ae';
  acceptButton.style.color = '#1d1b21';
  acceptButton.style.borderRadius = '0.375rem';
  acceptButton.style.cursor = 'pointer';
  acceptButton.style.transition = 'all 0.2s ease-in-out';
  acceptButton.addEventListener('mouseover', () => {
    acceptButton.style.opacity = '0.9';
    acceptButton.style.transform = 'translateY(-1px)';
  });
  acceptButton.addEventListener('mouseout', () => {
    acceptButton.style.opacity = '1';
    acceptButton.style.transform = 'translateY(0)';
  });
  acceptButton.addEventListener('click', () => {
    fillPasswordForm(credential.username, credential.password);
    menu.remove();
  });
  
  // Bouton Annuler
  const cancelButton = document.createElement('div');
  cancelButton.textContent = 'Annuler';
  cancelButton.style.flex = '1';
  cancelButton.style.textAlign = 'center';
  cancelButton.style.padding = '8px';
  cancelButton.style.backgroundColor = '#f2c3c2';
  cancelButton.style.color = '#1d1b21';
  cancelButton.style.borderRadius = '0.375rem';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.transition = 'all 0.2s ease-in-out';
  cancelButton.addEventListener('mouseover', () => {
    cancelButton.style.opacity = '0.9';
    cancelButton.style.transform = 'translateY(-1px)';
  });
  cancelButton.addEventListener('mouseout', () => {
    cancelButton.style.opacity = '1';
    cancelButton.style.transform = 'translateY(0)';
  });
  cancelButton.addEventListener('click', () => {
    menu.remove();
  });
  
  buttonContainer.appendChild(acceptButton);
  buttonContainer.appendChild(cancelButton);
  menu.appendChild(buttonContainer);
  
  // Ajouter le menu à la page
  document.body.appendChild(menu);
  
  // Ajouter l'effet de survol sur le menu
  menu.addEventListener('mouseover', () => {
    menu.style.transform = 'translateY(-2px)';
    menu.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
  });
  menu.addEventListener('mouseout', () => {
    menu.style.transform = 'translateY(0)';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  });
  
  // Fermer le menu après 30 secondes s'il n'a pas été fermé
  setTimeout(() => {
    if (document.getElementById('skapauto-confirmation-menu')) {
      document.getElementById('skapauto-confirmation-menu')!.remove();
    }
  }, 30000);
}

// Modifier la fonction autoFillCredentials pour utiliser le menu de confirmation
async function autoFillCredentials(): Promise<void> {
  // Récupérer les identifiants correspondants
  const credentials = await getMatchingCredentials();
  
  // Si aucun identifiant ne correspond, ne rien faire
  if (credentials.length === 0) {
    console.log('Aucun identifiant correspondant trouvé');
    return;
  }
  
  // Si un seul identifiant correspond, afficher le menu de confirmation
  if (credentials.length === 1) {
    console.log('Un seul identifiant correspondant trouvé, affichage du menu de confirmation');
    showConfirmationMenu(credentials[0]);
    return;
  }
  
  // Si plusieurs identifiants correspondent, afficher le menu de sélection
  console.log('Plusieurs identifiants correspondants trouvés, affichage du menu de sélection');
  showCredentialSelectionMenu(credentials);
}

/**
 * Affiche un menu de sélection pour choisir parmi plusieurs identifiants
 * @param credentials Liste des identifiants disponibles
 */
function showCredentialSelectionMenu(credentials: Credential[]): void {
  // Supprimer tout menu existant
  const existingMenu = document.getElementById('skapauto-credential-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Créer le menu
  const menu = document.createElement('div');
  menu.id = 'skapauto-credential-menu';
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.backgroundColor = '#ced7e1';
  menu.style.borderRadius = '0.5rem';
  menu.style.padding = '16px';
  menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  menu.style.zIndex = '9999';
  menu.style.maxWidth = '300px';
  menu.style.fontFamily = "'Work Sans', sans-serif";
  menu.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
  
  // Ajouter un titre
  const title = document.createElement('div');
  title.textContent = 'Choisir un identifiant';
  title.style.fontFamily = "'Raleway', sans-serif";
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.style.borderBottom = '1px solid #1d1b21';
  title.style.paddingBottom = '5px';
  title.style.color = '#1d1b21';
  menu.appendChild(title);
  
  // Ajouter les options
  credentials.forEach((credential, index) => {
    const option = document.createElement('div');
    option.style.padding = '8px';
    option.style.cursor = 'pointer';
    option.style.borderBottom = index < credentials.length - 1 ? '1px solid #1d1b21' : 'none';
    option.style.transition = 'all 0.2s ease-in-out';
    
    // Conteneur pour les informations
    const infoContainer = document.createElement('div');
    
    // Service et favicon
    const serviceContainer = document.createElement('div');
    serviceContainer.style.display = 'flex';
    serviceContainer.style.alignItems = 'center';
    serviceContainer.style.marginBottom = '4px';
    
    if (credential.favicon) {
      const favicon = document.createElement('img');
      favicon.src = credential.favicon;
      favicon.style.width = '16px';
      favicon.style.height = '16px';
      favicon.style.marginRight = '8px';
      serviceContainer.appendChild(favicon);
    }
    
    const serviceName = document.createElement('span');
    serviceName.textContent = credential.url || 'Identifiant';
    serviceName.style.fontWeight = 'bold';
    serviceName.style.color = '#1d1b21';
    serviceContainer.appendChild(serviceName);
    
    infoContainer.appendChild(serviceContainer);
    
    // Nom d'utilisateur
    const username = document.createElement('div');
    username.textContent = credential.username;
    username.style.fontSize = '0.9em';
    username.style.color = '#474b4f';
    infoContainer.appendChild(username);
    
    option.appendChild(infoContainer);
    
    // Effets de survol
    option.addEventListener('mouseover', () => {
      option.style.backgroundColor = '#f0f0f0';
      option.style.transform = 'translateX(5px)';
    });
    option.addEventListener('mouseout', () => {
      option.style.backgroundColor = 'transparent';
      option.style.transform = 'translateX(0)';
    });
    
    // Événement de clic
    option.addEventListener('click', () => {
      fillPasswordForm(credential.username, credential.password);
      menu.remove();
    });
    
    menu.appendChild(option);
  });
  
  // Ajouter un bouton de fermeture
  const closeButton = document.createElement('div');
  closeButton.textContent = 'Fermer';
  closeButton.style.textAlign = 'center';
  closeButton.style.marginTop = '16px';
  closeButton.style.padding = '8px';
  closeButton.style.backgroundColor = '#f2c3c2';
  closeButton.style.color = '#1d1b21';
  closeButton.style.borderRadius = '0.375rem';
  closeButton.style.cursor = 'pointer';
  closeButton.style.transition = 'all 0.2s ease-in-out';
  
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.opacity = '0.9';
    closeButton.style.transform = 'translateY(-1px)';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.opacity = '1';
    closeButton.style.transform = 'translateY(0)';
  });
  closeButton.addEventListener('click', () => {
    menu.remove();
  });
  menu.appendChild(closeButton);
  
  // Ajouter le menu à la page
  document.body.appendChild(menu);
  
  // Ajouter l'effet de survol sur le menu
  menu.addEventListener('mouseover', () => {
    menu.style.transform = 'translateY(-2px)';
    menu.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
  });
  menu.addEventListener('mouseout', () => {
    menu.style.transform = 'translateY(0)';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  });
  
  // Fermer le menu après 30 secondes s'il n'a pas été fermé
  setTimeout(() => {
    if (document.getElementById('skapauto-credential-menu')) {
      document.getElementById('skapauto-credential-menu')!.remove();
    }
  }, 30000);
}

/**
 * Identifie un élément d'entrée en utilisant des règles communes et les listes de configuration
 * @param input Élément d'entrée à identifier
 * @returns Type de champ identifié
 */
function identifyInputElement(input: HTMLInputElement): FieldType {
  // Vérifier si le champ est dans la liste noire
  const id = input.id.toLowerCase();
  const name = input.name.toLowerCase();
  const placeholder = input.placeholder.toLowerCase();
  const className = input.className.toLowerCase();
  const ariaLabel = (input.getAttribute('aria-label') || '').toLowerCase();
  
  // Vérifier si le champ est dans la liste noire
  if (siteConfig.blackList.fields.names.some(blackName => name === blackName) ||
      siteConfig.blackList.fields.ids.some(blackId => id === blackId)) {
    return 'unknown';
  } 
  if (input.autocomplete === 'off') {
    return 'unknown';
  }
  
  // Vérifier le type de l'input
  if (input.type === 'password') {
    return 'password';
  }
  
  if (input.type === 'email') {
    return 'email';
  }
  
  // Vérifier si c'est un champ de mot de passe en utilisant la liste blanche
  if (siteConfig.whiteList.fields.passwordNames.some(pattern => 
      name.includes(pattern) || 
      placeholder.includes(pattern) || 
      ariaLabel.includes(pattern)) ||
      siteConfig.whiteList.fields.passwordIds.some(pattern => 
      id.includes(pattern))) {
    return 'password';
  }
  
  // Vérifier si c'est un champ d'email en utilisant la liste blanche
  if (siteConfig.whiteList.fields.emailNames.some(pattern => 
      name.includes(pattern) || 
      placeholder.includes(pattern) || 
      ariaLabel.includes(pattern)) ||
      siteConfig.whiteList.fields.emailIds.some(pattern => 
      id.includes(pattern))) {
    return 'email';
  }
  
  // Vérifier si c'est un champ de nom d'utilisateur en utilisant la liste blanche
  if (siteConfig.whiteList.fields.usernameNames.some(pattern => 
      name.includes(pattern) || 
      placeholder.includes(pattern) || 
      ariaLabel.includes(pattern)) ||
      siteConfig.whiteList.fields.usernameIds.some(pattern => 
      id.includes(pattern))) {
    return 'username';
  }
  
  // Vérifier les attributs pour identifier le champ avec des patterns génériques
  const passwordPatterns = ['password', 'passwd', 'pass', 'pwd', 'mot de passe', 'contraseña'];
  if (passwordPatterns.some(pattern => 
      className.includes(pattern))) {
    return 'password';
  }
  
  const emailPatterns = ['email', 'e-mail', 'courriel'];
  if (emailPatterns.some(pattern => 
      className.includes(pattern))) {
    return 'email';
  }
  
  const usernamePatterns = ['username', 'user', 'login', 'id', 'identifier', 'nom d\'utilisateur', 'utilisateur', 'usuario'];
  if (usernamePatterns.some(pattern => 
      className.includes(pattern))) {
    return 'username';
  }
  
  // Vérifier si c'est un champ OTP en utilisant la liste blanche
  if (siteConfig.whiteList.fields.otpNames.some(pattern => 
      name.includes(pattern) || 
      placeholder.includes(pattern) || 
      ariaLabel.includes(pattern)) ||
      siteConfig.whiteList.fields.otpIds.some(pattern => 
      id.includes(pattern))) {
    return 'otp';
  }

  if (input.autocomplete === 'one-time-code') {
    return 'otp';
  }
  
  if (input.type === 'text' && input.autocomplete === 'on') {
    return 'username';
  }

  // Vérifier si c'est un champ OTP basé sur des caractéristiques spécifiques
  // Les champs OTP sont souvent des champs numériques courts
  if (input.type === 'number' || input.type === 'tel') {
    // Vérifier si le champ a une longueur maximale de 4-8 caractères
    const maxLength = input.getAttribute('maxlength');
    if (maxLength && parseInt(maxLength) >= 4 && parseInt(maxLength) <= 8) {
      return 'otp';
    }
    
    // Vérifier si le champ a un pattern pour les chiffres uniquement
    const pattern = input.getAttribute('pattern');
    if (pattern && (pattern === '[0-9]*' || pattern === '\\d*')) {
      return 'otp';
    }
  }
  
  // Vérifier si le champ est un input court pour un code
  if (input.type === 'text' && input.getAttribute('maxlength') && 
      parseInt(input.getAttribute('maxlength')!) >= 4 && 
      parseInt(input.getAttribute('maxlength')!) <= 8) {
    // Vérifier si le placeholder ou le label suggère un code
    if (placeholder.includes('code') || 
        placeholder.includes('pin') || 
        ariaLabel.includes('code') || 
        ariaLabel.includes('pin')) {
      return 'otp';
    }
  }
  
  // Si le champ est visible et de type texte, c'est probablement un champ de nom d'utilisateur
  if (input.type === 'text' && isVisibleElement(input)) {
    // Vérifier si le champ est dans un formulaire qui contient un champ de mot de passe
    const form = input.closest('form');
    if (form) {
      const passwordField = form.querySelector('input[type="password"]');
      if (passwordField) {
        return 'username';
      }
    }
  }
  
  return 'unknown';
}

/**
 * Vérifie si un élément est visible sur la page
 * @param element Élément à vérifier
 * @returns true si l'élément est visible
 */
function isVisibleElement(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         element.offsetWidth > 0 && 
         element.offsetHeight > 0;
}

/**
 * Identifie tous les champs de formulaire sur la page
 * @returns Objet contenant les champs identifiés
 */
function identifyFormFields(): Record<FieldType, HTMLInputElement[]> {
  const inputs = document.querySelectorAll('input');
  const result: Record<FieldType, HTMLInputElement[]> = {
    username: [],
    password: [],
    email: [],
    otp: [],
    unknown: []
  };
  
  // Identifier chaque élément d'entrée
  for (const input of Array.from(inputs)) {
    const inputElement = input as HTMLInputElement;
    // Ignorer les champs cachés et les boutons
    if (inputElement.type === 'hidden' || 
        inputElement.type === 'submit' || 
        inputElement.type === 'button' || 
        inputElement.type === 'range' ||
        inputElement.type === 'color' ||
        inputElement.type === 'date' ||
        inputElement.type === 'datetime-local' ||
        inputElement.type === 'month' ||
        inputElement.type === 'week' ||
        inputElement.type === 'time' ||
        inputElement.type === 'checkbox' || 
        inputElement.type === 'search' ||
        inputElement.type === 'radio') {
      continue;
    }
    
    const fieldType = identifyInputElement(inputElement);
    result[fieldType].push(inputElement);
  }
  
  return result;
}

/**
 * Remplit un formulaire de connexion avec les identifiants fournis
 * @param username Nom d'utilisateur
 * @param password Mot de passe
 */
function fillPasswordForm(username: string, password: string): void {
  // Identifier les champs
  const fields = identifyFormFields();
  console.log(fields);
  // Remplir le champ de nom d'utilisateur
  if (fields.username.length > 0) {
    const usernameField = fields.username[0];
    usernameField.value = username;
    usernameField.dispatchEvent(new Event('input', { bubbles: true }));
    usernameField.dispatchEvent(new Event('change', { bubbles: true }));
  } else if (fields.email.length > 0) {
    // Si pas de champ username mais un champ email, utiliser celui-ci
    const emailField = fields.email[0];
    emailField.value = username;
    emailField.dispatchEvent(new Event('input', { bubbles: true }));
    emailField.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // Méthode de secours: rechercher par type et attributs
    const usernameFields = document.querySelectorAll('input[type="text"], input[type="email"], input[name*="user"], input[name*="email"], input[id*="user"], input[id*="email"]');
    if (usernameFields.length > 0) {
      const usernameField = usernameFields[0] as HTMLInputElement;
      usernameField.value = username;
      usernameField.dispatchEvent(new Event('input', { bubbles: true }));
      usernameField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  // Remplir le champ de mot de passe
  if (fields.password.length > 0) {
    const passwordField = fields.password[0];
    passwordField.value = password;
    passwordField.dispatchEvent(new Event('input', { bubbles: true }));
    passwordField.dispatchEvent(new Event('change', { bubbles: true }));
  } else {
    // Méthode de secours: rechercher par type
    const passwordFields = document.querySelectorAll('input[type="password"]');
    if (passwordFields.length > 0) {
      const passwordField = passwordFields[0] as HTMLInputElement;
      passwordField.value = password;
      passwordField.dispatchEvent(new Event('input', { bubbles: true }));
      passwordField.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
  
  // Tenter de soumettre le formulaire automatiquement si un bouton de soumission est présent
  setTimeout(() => {
    // Chercher le formulaire parent
    let form: HTMLFormElement | null = null;
    if (fields.password.length > 0) {
      form = fields.password[0].closest('form');
    } else if (fields.username.length > 0) {
      form = fields.username[0].closest('form');
    } else if (fields.email.length > 0) {
      form = fields.email[0].closest('form');
    }
    
    // Si un formulaire est trouvé, tenter de le soumettre
    if (form) {
      // Chercher un bouton de soumission dans le formulaire
      const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
      if (submitButton) {
        (submitButton as HTMLElement).click();
      }
    }
  }, 500);
}

/**
 * Affiche un menu de confirmation pour l'autofill OTP
 * @param credential Identifiant avec OTP à utiliser
 */
function showOTPConfirmationMenu(credential: Credential): void {
  // Supprimer tout menu existant
  const existingMenu = document.getElementById('skapauto-otp-confirmation-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Créer le menu
  const menu = document.createElement('div');
  menu.id = 'skapauto-otp-confirmation-menu';
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.backgroundColor = '#ced7e1';
  menu.style.borderRadius = '0.5rem';
  menu.style.padding = '16px';
  menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  menu.style.zIndex = '9999';
  menu.style.maxWidth = '300px';
  menu.style.fontFamily = "'Work Sans', sans-serif";
  menu.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
  
  // Ajouter un titre
  const title = document.createElement('div');
  title.textContent = 'Confirmer l\'autofill OTP';
  title.style.fontFamily = "'Raleway', sans-serif";
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.style.borderBottom = '1px solid #1d1b21';
  title.style.paddingBottom = '5px';
  title.style.color = '#1d1b21';
  menu.appendChild(title);
  
  // Ajouter les informations du compte
  const info = document.createElement('div');
  info.style.marginBottom = '10px';
  info.style.padding = '5px';
  
  const usernameSpan = document.createElement('div');
  usernameSpan.textContent = `Nom d'utilisateur: ${credential.username}`;
  usernameSpan.style.fontWeight = 'bold';
  usernameSpan.style.color = '#1d1b21';
  info.appendChild(usernameSpan);
  
  const serviceSpan = document.createElement('div');
  serviceSpan.textContent = `Service: ${credential.url}`;
  serviceSpan.style.color = '#474b4f';
  serviceSpan.style.fontSize = '0.9em';
  info.appendChild(serviceSpan);
  
  menu.appendChild(info);
  
  // Conteneur pour les boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  buttonContainer.style.gap = '10px';
  buttonContainer.style.marginTop = '16px';
  
  // Bouton Accepter
  const acceptButton = document.createElement('div');
  acceptButton.textContent = 'Accepter';
  acceptButton.style.flex = '1';
  acceptButton.style.textAlign = 'center';
  acceptButton.style.padding = '8px';
  acceptButton.style.backgroundColor = '#a7f3ae';
  acceptButton.style.color = '#1d1b21';
  acceptButton.style.borderRadius = '0.375rem';
  acceptButton.style.cursor = 'pointer';
  acceptButton.style.transition = 'all 0.2s ease-in-out';
  acceptButton.addEventListener('mouseover', () => {
    acceptButton.style.opacity = '0.9';
    acceptButton.style.transform = 'translateY(-1px)';
  });
  acceptButton.addEventListener('mouseout', () => {
    acceptButton.style.opacity = '1';
    acceptButton.style.transform = 'translateY(0)';
  });
  acceptButton.addEventListener('click', async () => {
    const otpCode = await generateTOTPCode(credential.otp!);
    if (otpCode) {
      fillOTPField(otpCode);
    } else {
      console.error('Impossible de générer le code OTP');
    }
    menu.remove();
  });
  
  // Bouton Annuler
  const cancelButton = document.createElement('div');
  cancelButton.textContent = 'Annuler';
  cancelButton.style.flex = '1';
  cancelButton.style.textAlign = 'center';
  cancelButton.style.padding = '8px';
  cancelButton.style.backgroundColor = '#f2c3c2';
  cancelButton.style.color = '#1d1b21';
  cancelButton.style.borderRadius = '0.375rem';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.transition = 'all 0.2s ease-in-out';
  cancelButton.addEventListener('mouseover', () => {
    cancelButton.style.opacity = '0.9';
    cancelButton.style.transform = 'translateY(-1px)';
  });
  cancelButton.addEventListener('mouseout', () => {
    cancelButton.style.opacity = '1';
    cancelButton.style.transform = 'translateY(0)';
  });
  cancelButton.addEventListener('click', () => {
    menu.remove();
  });
  
  buttonContainer.appendChild(acceptButton);
  buttonContainer.appendChild(cancelButton);
  menu.appendChild(buttonContainer);
  
  // Ajouter le menu à la page
  document.body.appendChild(menu);
  
  // Ajouter l'effet de survol sur le menu
  menu.addEventListener('mouseover', () => {
    menu.style.transform = 'translateY(-2px)';
    menu.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
  });
  menu.addEventListener('mouseout', () => {
    menu.style.transform = 'translateY(0)';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  });
  
  // Fermer le menu après 30 secondes s'il n'a pas été fermé
  setTimeout(() => {
    if (document.getElementById('skapauto-otp-confirmation-menu')) {
      document.getElementById('skapauto-otp-confirmation-menu')!.remove();
    }
  }, 30000);
}

async function autoFillOTP(): Promise<void> {
  // Récupérer les identifiants correspondants
  const credentials = await getMatchingCredentials();
  
  // Si aucun identifiant ne correspond, ne rien faire
  if (credentials.length === 0) {
    console.log('Aucun identifiant correspondant trouvé pour OTP');
    return;
  }
  
  // Filtrer les identifiants qui ont un code OTP
  const credentialsWithOTP = credentials.filter(cred => cred.otp);
  
  if (credentialsWithOTP.length === 0) {
    console.log('Aucun identifiant avec OTP trouvé');
    return;
  }
  
  // Si un seul identifiant avec OTP correspond, afficher le menu de confirmation
  if (credentialsWithOTP.length === 1) {
    console.log('Un seul identifiant avec OTP trouvé, affichage du menu de confirmation');
    showOTPConfirmationMenu(credentialsWithOTP[0]);
    return;
  }
  
  // Si plusieurs identifiants avec OTP correspondent, afficher un menu de sélection
  console.log('Plusieurs identifiants avec OTP trouvés, affichage du menu de sélection');
  showOTPSelectionMenu(credentialsWithOTP);
}

/**
 * Affiche un menu de sélection pour choisir parmi plusieurs codes OTP
 * @param credentials Liste des identifiants disponibles avec OTP
 */
function showOTPSelectionMenu(credentials: Credential[]): void {
  // Supprimer tout menu existant
  const existingMenu = document.getElementById('skapauto-otp-menu');
  if (existingMenu) {
    existingMenu.remove();
  }
  
  // Créer le menu
  const menu = document.createElement('div');
  menu.id = 'skapauto-otp-menu';
  menu.style.position = 'fixed';
  menu.style.top = '10px';
  menu.style.right = '10px';
  menu.style.backgroundColor = '#ced7e1';
  menu.style.borderRadius = '0.5rem';
  menu.style.padding = '16px';
  menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  menu.style.zIndex = '9999';
  menu.style.maxWidth = '300px';
  menu.style.fontFamily = "'Work Sans', sans-serif";
  menu.style.transition = 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out';
  
  // Ajouter un titre
  const title = document.createElement('div');
  title.textContent = 'Choisir un compte pour OTP';
  title.style.fontFamily = "'Raleway', sans-serif";
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '10px';
  title.style.borderBottom = '1px solid #1d1b21';
  title.style.paddingBottom = '5px';
  title.style.color = '#1d1b21';
  menu.appendChild(title);
  
  // Ajouter les options
  credentials.forEach((credential, index) => {
    const option = document.createElement('div');
    option.style.padding = '8px';
    option.style.cursor = 'pointer';
    option.style.borderBottom = index < credentials.length - 1 ? '1px solid #1d1b21' : 'none';
    option.style.transition = 'all 0.2s ease-in-out';
    
    // Conteneur pour les informations
    const infoContainer = document.createElement('div');
    
    // Service et favicon
    const serviceContainer = document.createElement('div');
    serviceContainer.style.display = 'flex';
    serviceContainer.style.alignItems = 'center';
    serviceContainer.style.marginBottom = '4px';
    
    if (credential.favicon) {
      const favicon = document.createElement('img');
      favicon.src = getFaviconUrl(credential.url || '');
      favicon.style.width = '16px';
      favicon.style.height = '16px';
      favicon.style.marginRight = '8px';
      serviceContainer.appendChild(favicon);
    }
    
    const serviceName = document.createElement('span');
    serviceName.textContent = credential.url || 'Identifiant';
    serviceName.style.fontWeight = 'bold';
    serviceName.style.color = '#1d1b21';
    serviceContainer.appendChild(serviceName);
    
    infoContainer.appendChild(serviceContainer);
    
    // Nom d'utilisateur
    const username = document.createElement('div');
    username.textContent = credential.username;
    username.style.fontSize = '0.9em';
    username.style.color = '#474b4f';
    infoContainer.appendChild(username);
    
    option.appendChild(infoContainer);
    
    // Effets de survol
    option.addEventListener('mouseover', () => {
      option.style.backgroundColor = '#f0f0f0';
      option.style.transform = 'translateX(5px)';
    });
    option.addEventListener('mouseout', () => {
      option.style.backgroundColor = 'transparent';
      option.style.transform = 'translateX(0)';
    });
    
    // Événement de clic
    option.addEventListener('click', () => {
      showOTPConfirmationMenu(credential);
      menu.remove();
    });
    
    menu.appendChild(option);
  });
  
  // Ajouter un bouton de fermeture
  const closeButton = document.createElement('div');
  closeButton.textContent = 'Fermer';
  closeButton.style.textAlign = 'center';
  closeButton.style.marginTop = '16px';
  closeButton.style.padding = '8px';
  closeButton.style.backgroundColor = '#f2c3c2';
  closeButton.style.color = '#1d1b21';
  closeButton.style.borderRadius = '0.375rem';
  closeButton.style.cursor = 'pointer';
  closeButton.style.transition = 'all 0.2s ease-in-out';
  
  closeButton.addEventListener('mouseover', () => {
    closeButton.style.opacity = '0.9';
    closeButton.style.transform = 'translateY(-1px)';
  });
  closeButton.addEventListener('mouseout', () => {
    closeButton.style.opacity = '1';
    closeButton.style.transform = 'translateY(0)';
  });
  closeButton.addEventListener('click', () => {
    menu.remove();
  });
  menu.appendChild(closeButton);
  
  // Ajouter le menu à la page
  document.body.appendChild(menu);
  
  // Ajouter l'effet de survol sur le menu
  menu.addEventListener('mouseover', () => {
    menu.style.transform = 'translateY(-2px)';
    menu.style.boxShadow = '0 6px 8px rgba(0, 0, 0, 0.15)';
  });
  menu.addEventListener('mouseout', () => {
    menu.style.transform = 'translateY(0)';
    menu.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
  });
  
  // Fermer le menu après 30 secondes s'il n'a pas été fermé
  setTimeout(() => {
    if (document.getElementById('skapauto-otp-menu')) {
      document.getElementById('skapauto-otp-menu')!.remove();
    }
  }, 30000);
}

/**
 * Remplit un champ OTP avec le code fourni
 * @param otp Code OTP à remplir
 */
function fillOTPField(otp: string): void {
  // Identifier les champs
  const fields = identifyFormFields();
  console.log('Champs OTP identifiés:', fields.otp);
  
  // Si des champs OTP sont trouvés, remplir le premier
  if (fields.otp.length > 0) {
    const otpField = fields.otp[0];
    otpField.value = otp;
    otpField.dispatchEvent(new Event('input', { bubbles: true }));
    otpField.dispatchEvent(new Event('change', { bubbles: true }));
    console.log('Champ OTP rempli avec:', otp);
    
    // Tenter de soumettre le formulaire automatiquement
    setTimeout(() => {
      // Chercher le formulaire parent
      const form = otpField.closest('form');
      
      // Si un formulaire est trouvé, tenter de le soumettre
      if (form) {
        // Chercher un bouton de soumission dans le formulaire
        const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitButton) {
          (submitButton as HTMLElement).click();
        }
      }
    }, 500);
  } else {
    console.log('Aucun champ OTP trouvé');
  }
}

/**
 * Génère un code TOTP à partir d'un URI OTP
 * @param otpUri URI OTP (otpauth://...)
 * @returns Code TOTP généré ou null en cas d'erreur
 */
async function generateTOTPCode(otpUri: string): Promise<string | null> {
  try {
    console.log('Génération du code TOTP à partir de l\'URI:', otpUri);
    
    // Vérifier si l'URI est valide
    if (!otpUri.startsWith('otpauth://')) {
      console.error('URI OTP invalide:', otpUri);
      return null;
    }
    
    // Extraire les paramètres de l'URI
    const params = parseTOTPUri(otpUri);
    if (!params) {
      console.error('Impossible de parser l\'URI OTP');
      return null;
    }
    
    // Générer le code TOTP
    const code = await calculateTOTP(params);
    console.log('Code TOTP généré:', code);
    return code;
  } catch (error) {
    console.error('Erreur lors de la génération du code TOTP:', error);
    return null;
  }
}


  function getFaviconUrl(domain: string): string {
    // Nettoyer l'URL pour extraire le domaine
    let cleanDomain = domain;
    
    // Supprimer le protocole s'il existe
    if (cleanDomain.includes('://')) {
      cleanDomain = cleanDomain.split('://')[1];
    }
    
    // Supprimer le chemin s'il existe
    if (cleanDomain.includes('/')) {
      cleanDomain = cleanDomain.split('/')[0];
    }
    
    // Utiliser Google Favicon service pour récupérer l'icône
    return `https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=32`;
  }

/**
 * Parse un URI OTP pour extraire les paramètres
 * @param uri URI OTP (otpauth://...)
 * @returns Paramètres TOTP ou null en cas d'erreur
 */
function parseTOTPUri(uri: string): TOTPParams | null {
  try {
    // Format: otpauth://totp/Label?secret=SECRET&issuer=ISSUER&algorithm=ALGORITHM&digits=DIGITS&period=PERIOD
    const url = new URL(uri);
    
    // Vérifier si c'est un URI TOTP
    if (url.protocol !== 'otpauth:' || url.host !== 'totp') {
      console.error('URI non TOTP:', uri);
      return null;
    }
    
    // Extraire les paramètres
    const params = new URLSearchParams(url.search);
    const secret = params.get('secret');
    
    if (!secret) {
      console.error('Secret manquant dans l\'URI OTP');
      return null;
    }
    
    // Extraire les autres paramètres avec des valeurs par défaut
    const algorithm = params.get('algorithm') || 'SHA1';
    const digits = parseInt(params.get('digits') || '6');
    const period = parseInt(params.get('period') || '30');
    
    return {
      secret,
      algorithm,
      digits,
      period
    };
  } catch (error) {
    console.error('Erreur lors du parsing de l\'URI OTP:', error);
    return null;
  }
}

/**
 * Calcule un code TOTP à partir des paramètres
 * @param params Paramètres TOTP
 * @returns Code TOTP généré
 */
async function calculateTOTP(params: TOTPParams): Promise<string> {
  // Demander au background script de générer le code TOTP
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      action: 'generateTOTP',
      params: params
    }, (response) => {
      if (response && response.success && response.code) {
        resolve(response.code);
      } else {
        reject(new Error(response?.message || 'Erreur lors de la génération du code TOTP'));
      }
    });
  });
}

/**
 * Détecte la soumission d'un formulaire de connexion
 */
function setupFormSubmissionDetection(): void {
  // Observer les événements de soumission de formulaire
  document.addEventListener('submit', async (event) => {
    // Identifier les champs de formulaire
    const fields = identifyFormFields();
    
    // Vérifier si c'est un formulaire de connexion
    if (fields.password.length > 0 && (fields.username.length > 0 || fields.email.length > 0)) {
      // Récupérer les valeurs des champs
      const passwordValue = fields.password[0].value;
      const usernameValue = fields.username.length > 0 
        ? fields.username[0].value 
        : (fields.email.length > 0 ? fields.email[0].value : '');
      
      if (passwordValue && usernameValue) {
        // Vérifier si ces identifiants existent déjà
        const existingCredentials = await getMatchingCredentials();
        const credentialExists = existingCredentials.some(cred => 
          cred.username === usernameValue && cred.password === passwordValue
        );
        
        // Si les identifiants n'existent pas encore, proposer de les enregistrer
        if (!credentialExists) {
          // Attendre un peu pour laisser le formulaire se soumettre
          setTimeout(() => {
            showSaveCredentialsModal(usernameValue, passwordValue);
          }, 500);
        }
      }
    }
  });
  
  // Observer les clics sur les boutons de connexion
  document.addEventListener('click', async (event) => {
    const target = event.target as HTMLElement;
    console.log(target.tagName);
    if (target.tagName === 'BUTTON' || 
        (target.tagName === 'INPUT' && (target.getAttribute('type') === 'submit' || target.getAttribute('type') === 'button')) || (target.tagName === 'BUTTON' && target.getAttribute('type') === 'submit')) {
      
      // Vérifier si le bouton est dans un formulaire de connexion
      const fields = identifyFormFields();
      if (fields.password.length > 0 && (fields.username.length > 0 || fields.email.length > 0)) {
        // Récupérer les valeurs des champs
        const passwordValue = fields.password[0].value;
        const usernameValue = fields.username.length > 0 
          ? fields.username[0].value 
          : (fields.email.length > 0 ? fields.email[0].value : '');
        
        if (passwordValue && usernameValue) {
          // Vérifier si ces identifiants existent déjà
          const existingCredentials = await getMatchingCredentials();
          const credentialExists = existingCredentials.some(cred => 
            cred.username === usernameValue && cred.password === passwordValue
          );
          
          // Si les identifiants n'existent pas encore, proposer de les enregistrer
          if (!credentialExists) {
            // Attendre un peu pour laisser le formulaire se soumettre
            setTimeout(() => {
              showSaveCredentialsModal(usernameValue, passwordValue);
            }, 500);
          }
        }
      }
    }
  });
}

/**
 * Affiche une modal pour proposer d'enregistrer les identifiants
 * @param username Nom d'utilisateur
 * @param password Mot de passe
 */
function showSaveCredentialsModal(username: string, password: string): void {
  // Créer la modal
  const modal = document.createElement('div');
  modal.style.position = 'fixed';
  modal.style.top = '20px';
  modal.style.right = '20px';
  modal.style.zIndex = '9999';
  modal.style.backgroundColor = '#ffffff';
  modal.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  modal.style.borderRadius = '8px';
  modal.style.padding = '16px';
  modal.style.width = '320px';
  modal.style.fontFamily = 'Arial, sans-serif';
  modal.style.transition = 'all 0.3s ease-in-out';
  
  // Titre
  const title = document.createElement('div');
  title.textContent = 'Enregistrer les identifiants';
  title.style.fontSize = '16px';
  title.style.fontWeight = 'bold';
  title.style.marginBottom = '12px';
  title.style.color = '#1d1b21';
  modal.appendChild(title);
  
  // Message
  const message = document.createElement('div');
  message.textContent = 'Voulez-vous enregistrer ces identifiants pour ce site?';
  message.style.fontSize = '14px';
  message.style.marginBottom = '16px';
  message.style.color = '#474b4f';
  modal.appendChild(message);
  
  // Informations sur les identifiants
  const credInfo = document.createElement('div');
  credInfo.style.backgroundColor = '#f5f5f5';
  credInfo.style.padding = '8px';
  credInfo.style.borderRadius = '4px';
  credInfo.style.marginBottom = '16px';
  credInfo.style.color = '#1d1b21';
  
  const usernameInfo = document.createElement('div');
  usernameInfo.textContent = `Utilisateur: ${username}`;
  usernameInfo.style.fontSize = '14px';
  usernameInfo.style.marginBottom = '4px';
  credInfo.appendChild(usernameInfo);
  
  const passwordInfo = document.createElement('div');
  passwordInfo.textContent = `Mot de passe: ${'•'.repeat(password.length)}`;
  passwordInfo.style.fontSize = '14px';
  credInfo.appendChild(passwordInfo);jellyfin.klyt.eu

  
  modal.appendChild(credInfo);
  
  // Conteneur de boutons
  const buttonContainer = document.createElement('div');
  buttonContainer.style.display = 'flex';
  buttonContainer.style.justifyContent = 'space-between';
  
  // Bouton Enregistrer
  const saveButton = document.createElement('button');
  saveButton.textContent = 'Enregistrer';
  saveButton.style.backgroundColor = '#4caf50';
  saveButton.style.color = 'white';
  saveButton.style.border = 'none';
  saveButton.style.padding = '8px 16px';
  saveButton.style.borderRadius = '4px';
  saveButton.style.cursor = 'pointer';
  saveButton.style.fontWeight = 'bold';
  saveButton.style.transition = 'background-color 0.2s';
  
  saveButton.addEventListener('mouseover', () => {
    saveButton.style.backgroundColor = '#43a047';
  });
  
  saveButton.addEventListener('mouseout', () => {
    saveButton.style.backgroundColor = '#4caf50';
  });
  
  saveButton.addEventListener('click', () => {
    // Créer un nouvel identifiant
    const newCredential: Credential = {
      username: username,
      password: password,
      url: window.location.hostname,
      description: document.title || window.location.hostname,
      favicon: getFaviconUrl(window.location.hostname)
    };
    
    // Envoyer au background script pour enregistrement
    chrome.runtime.sendMessage({ 
      action: 'saveNewCredential', 
      credential: newCredential 
    }, (response) => {
      if (response && response.success) {
        // Afficher un message de succès
        // hide the modal
        modal.style.opacity = '0';
        setTimeout(() => {
          modal.remove();
        }, 300);
        showNotification('Identifiants enregistrés avec succès!', 'success');
      } else {
        // Afficher un message d'erreur
        showNotification('Erreur lors de l\'enregistrement des identifiants.', 'error');
      }
    });
    
    // Fermer la modal
    modal.remove();
  });
  
  buttonContainer.appendChild(saveButton);
  
  // Bouton Annuler
  const cancelButton = document.createElement('button');
  cancelButton.textContent = 'Annuler';
  cancelButton.style.backgroundColor = '#f2f2f2';
  cancelButton.style.color = '#333';
  cancelButton.style.border = 'none';
  cancelButton.style.padding = '8px 16px';
  cancelButton.style.borderRadius = '4px';
  cancelButton.style.cursor = 'pointer';
  cancelButton.style.transition = 'background-color 0.2s';
  
  cancelButton.addEventListener('mouseover', () => {
    cancelButton.style.backgroundColor = '#e0e0e0';
  });
  
  cancelButton.addEventListener('mouseout', () => {
    cancelButton.style.backgroundColor = '#f2f2f2';
  });
  
  cancelButton.addEventListener('click', () => {
    modal.remove();
  });
  
  buttonContainer.appendChild(cancelButton);
  modal.appendChild(buttonContainer);
  
  // Ajouter la modal au document
  document.body.appendChild(modal);
  
  // Animation d'entrée
  setTimeout(() => {
    modal.style.transform = 'translateY(10px)';
    setTimeout(() => {
      modal.style.transform = 'translateY(0)';
    }, 50);
  }, 0);
  
  // Auto-fermeture après 30 secondes
  setTimeout(() => {
    if (document.body.contains(modal)) {
      modal.style.opacity = '0';
      setTimeout(() => {
        if (document.body.contains(modal)) {
          modal.remove();
        }
      }, 300);
    }
  }, 30000);
}

/**
 * Affiche une notification temporaire
 * @param message Message à afficher
 * @param type Type de notification (success, error, info)
 */
function showNotification(message: string, type: 'success' | 'error' | 'info'): void {
  // Créer la notification
  const notification = document.createElement('div');
  notification.style.position = 'fixed';
  notification.style.bottom = '20px';
  notification.style.right = '20px';
  notification.style.zIndex = '10000';
  notification.style.padding = '12px 16px';
  notification.style.borderRadius = '4px';
  notification.style.fontFamily = 'Arial, sans-serif';
  notification.style.fontSize = '14px';
  notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
  notification.style.transition = 'all 0.3s ease-in-out';
  notification.style.opacity = '0';
  notification.style.transform = 'translateY(20px)';
  
  // Définir le style en fonction du type
  if (type === 'success') {
    notification.style.backgroundColor = '#4caf50';
    notification.style.color = 'white';
  } else if (type === 'error') {
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
  } else {
    notification.style.backgroundColor = '#2196f3';
    notification.style.color = 'white';
  }
  
  notification.textContent = message;
  
  // Ajouter au document
  document.body.appendChild(notification);
  
  // Animation d'entrée
  setTimeout(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
    
    // Auto-fermeture après 3 secondes
    setTimeout(() => {
      notification.style.opacity = '0';
      notification.style.transform = 'translateY(20px)';
      
      // Supprimer après la fin de l'animation
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }, 3000);
  }, 10);
}

// Exporter une fonction vide pour que le bundler ne se plaigne pas
export {}; 