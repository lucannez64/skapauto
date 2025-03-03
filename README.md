# SkapAuto Password Manager

Une extension web pour récupérer et gérer les mots de passe de Skap.

## Fonctionnalités

- Chargement d'un fichier client Skap
- Authentification avec le serveur Skap
- Récupération des mots de passe stockés
- Affichage des mots de passe dans la console
- Copie des mots de passe dans le presse-papiers
- Remplissage automatique des formulaires de connexion

## Installation

### Prérequis

- [Bun](https://bun.sh/) (gestionnaire de paquets)
- [Node.js](https://nodejs.org/) (environnement d'exécution)

### Installation des dépendances

```bash
# Installer les dépendances
bun install
```

### Compilation

```bash
# Compiler l'extension
bun run build
```

Le résultat de la compilation se trouve dans le dossier `dist`.

### Installation de l'extension dans Chrome

1. Ouvrir Chrome et aller à `chrome://extensions/`
2. Activer le "Mode développeur" en haut à droite
3. Cliquer sur "Charger l'extension non empaquetée"
4. Sélectionner le dossier `dist` de ce projet

## Utilisation

1. Cliquer sur l'icône de l'extension dans la barre d'outils de Chrome
2. Charger votre fichier client Skap (.bin)
3. Entrer votre UUID
4. Cliquer sur "S'authentifier"
5. Cliquer sur "Récupérer les Mots de Passe"
6. Les mots de passe seront affichés dans la console et dans l'interface de l'extension

## Développement

### Structure du projet

```
skapauto/
├── dist/               # Fichiers compilés
├── src/                # Code source
│   ├── lib/            # Bibliothèques
│   │   ├── client.ts   # Client API Skap
│   │   ├── decoder.ts  # Décodeur de mots de passe
│   │   └── decoder2.ts # Encodeur binaire
│   ├── background.ts   # Service worker de l'extension
│   ├── content.ts      # Script injecté dans les pages
│   ├── popup.html      # Interface utilisateur
│   └── popup.ts        # Logique de l'interface
├── package.json        # Configuration du projet
└── tsconfig.json       # Configuration TypeScript
```

### Commandes disponibles

```bash
# Développement avec rechargement à chaud
bun run dev

# Compilation pour production
bun run build
```

## Sécurité

Cette extension manipule des données sensibles (mots de passe). Utilisez-la avec précaution et ne la partagez pas avec des tiers.

## Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails. 