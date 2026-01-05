# 🍼 BabyCheck - Suivi de Croissance des Bébés

Application mobile complète de suivi de croissance et de santé pour bébés, développée avec **React Native (Expo)** et **Laravel**.

![Status](https://img.shields.io/badge/status-complet-brightgreen)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Laravel](https://img.shields.io/badge/Laravel-12-red)

---

## 📱 Fonctionnalités

### ✅ Implémentées

**Authentification & Gestion Utilisateur**
- Inscription et connexion sécurisées
- Gestion de session avec tokens JWT (Sanctum)
- Déconnexion avec confirmation
- Récupération des informations utilisateur

**Gestion des Bébés**
- Ajouter et gérer plusieurs bébés
- Enregistrer les informations à la naissance (poids, taille)
- Modifier et supprimer les profils
- Affichage de l'âge en mois automatique

**Suivi de Croissance**
- Enregistrement des mesures (poids, taille, périmètre crânien)
- Historique complet des mesures
- Calcul automatique de l'IMC (BMI)
- Statistiques de croissance (gain poids/taille par mois)
- Visualisation des tendances

**Gestion des Vaccinations**
- Calendrier vaccinal intelligent et adapté à l'âge
- Vaccins standards recommandés ou personnalisés
- Statuts de suivi : programmé, complété, en retard
- Enregistrement des informations détaillées (lot, clinique, notes)
- Historique des vaccinations administrées

**Dossier Médical**
- Enregistrement des maladies et conditions
- Suivi des médicaments et traitements
- Documentation des symptômes et observations
- Statuts : en cours, résolu

**Alimentation & Planning**
- Planification des repas (petit-déjeuner, déjeuner, goûter, dîner)
- Suivi de l'introduction alimentaire par âge
- Notes sur les réactions et préférences
- Vue groupée par type de repas

**Interface Mobile**
- Navigation intuitive avec onglets
- Design responsive et adapté aux appareils mobiles
- Interface utilisateur moderne et accessible
- Gestion des erreurs et feedback utilisateur

---

## 🏗️ Architecture

```
BabyCheck/
├── baby-growth-backend/              # API REST Laravel
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   └── Traits/
│   ├── routes/api.php
│   ├── database/migrations/
│   ├── config/
│   └── .env.example
│
└── baby-growth-app/                  # Application React Native
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.js
    │   │   ├── RegisterScreen.js
    │   │   ├── DashboardScreen.js
    │   │   ├── BabyDetailScreen.js
    │   │   ├── AddBabyScreen.js
    │   │   └── [autres écrans]
    │   ├── services/
    │   │   ├── api.js
    │   │   └── auth.js
    │   └── navigation/
    ├── App.js
    └── package.json
```

---

## 🚀 Installation

### Prérequis

- PHP 8.2+
- Composer
- Node.js 18+
- MySQL
- Expo CLI

### Backend (Laravel)

```bash
cd baby-growth-backend

# Installer les dépendances
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_DATABASE=baby_growth_db
# DB_USERNAME=root
# DB_PASSWORD=

# Exécuter les migrations
php artisan migrate

# Démarrer le serveur
php artisan serve --host=0.0.0.0 --port=8000
```

### Frontend (React Native)

```bash
cd baby-growth-app

# Installer les dépendances
npm install

# Configurer l'IP du serveur dans src/services/api.js
# Remplacer par votre IP locale si nécessaire

# Démarrer l'application
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur votre téléphone.

---

## 🗄️ Base de données

### Tables principales

- `users` - Utilisateurs
- `babies` - Bébés enregistrés
- `growth_records` - Historique poids/taille/IMC
- `vaccinations` - Calendrier vaccinal et vaccins administrés
- `medical_records` - Maladies et médicaments
- `meal_plans` - Planification alimentaire

---

## 🔐 Authentification

API sécurisée avec **Laravel Sanctum** (token-based).

### Endpoints principales

```
POST /api/register          # Inscription
POST /api/login             # Connexion
POST /api/logout            # Déconnexion (protégé)
GET  /api/user              # Infos utilisateur (protégé)
```

---

## 📦 Technologies utilisées

### Backend

- **Laravel 12** - Framework PHP moderne
- **Laravel Sanctum** - Authentification API token-based
- **MySQL** - Base de données relationnelle

### Frontend

- **React Native 0.81.5** - Framework mobile multi-plateforme
- **Expo SDK 54** - Plateforme de développement React Native
- **React Navigation v6** - Navigation entre écrans
- **Axios** - Client HTTP pour requêtes API
- **AsyncStorage** - Stockage local persistant

---

## 🎨 Design

**Palette de couleurs :**

- Primaire : `#3498db` (Bleu)
- Secondaire : `#2ecc71` (Vert)
- Danger : `#e74c3c` (Rouge)
- Fond : `#f8f9fa`

**Principes de design :**

- Interface intuitive et responsive
- Navigation simple et fluide
- Feedback utilisateur clair
- Accessibilité optimale

---

## 📄 License

Projet académique - Tous droits réservés

---

## 👨‍💻 Auteur

Application développée comme projet mobile complet avec backend et frontend intégrés.

---

## 🙏 Remerciements

- Documentation Laravel
- Documentation React Native & Expo
- Communauté React Native

---

**Statut du projet :** ✅ Complet et fonctionnel
