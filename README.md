# 🍼 BabyCheck - Suivi de Croissance des Bébés

Application mobile de suivi de croissance et de santé pour bébés, développée avec **React Native (Expo)** et **Laravel**.

![Status](https://img.shields.io/badge/status-en%20développement-yellow)
![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue)
![Laravel](https://img.shields.io/badge/Laravel-12-red)

---

## 📱 Fonctionnalités

### ✅ Implémentées (Jour 2/7)

- Authentification complète (inscription, connexion, déconnexion)
- Dashboard utilisateur
- Gestion de session avec tokens JWT (Sanctum)
- Interface mobile responsive

### 🔜 À venir (Jours 3-7)

- Gestion multi-bébés
- Suivi de croissance (poids, taille) avec graphiques
- Calendrier de vaccination
- Rendez-vous pédiatriques
- Introduction alimentaire par âge
- Étapes de développement (milestones)
- Notifications de rappel

---

## 🏗️ Architecture

```
BabyCheck/
├── baby-growth-backend/    # API Laravel
│   ├── app/
│   ├── routes/api.php
│   ├── database/migrations/
│   └── .env.example
│
└── baby-growth-app/        # App React Native
    ├── src/
    │   ├── screens/
    │   └── services/
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
# Remplacer 192.168.1.162 par votre IP locale

# Démarrer l'application
npx expo start
```

Scanner le QR code avec l'app **Expo Go** sur votre téléphone.

---

## 🔧 Configuration réseau (Windows)

Pour tester sur téléphone physique, autoriser le port Laravel dans le pare-feu :

```powershell
# PowerShell en administrateur
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
```

---

## 🗄️ Base de données

### Tables principales

- `users` - Utilisateurs
- `babies` - Bébés enregistrés
- `growth_records` - Historique poids/taille
- `vaccinations` - Calendrier vaccinal
- `appointments` - Rendez-vous médicaux
- `food_introductions` - Alimentation
- `milestones` - Étapes de développement

---

## 🔐 Authentification

API sécurisée avec **Laravel Sanctum** (token-based).

### Endpoints disponibles

```
POST /api/register          # Inscription
POST /api/login             # Connexion
POST /api/logout            # Déconnexion (protégé)
GET  /api/user              # Infos utilisateur (protégé)
```

---

## 📦 Technologies utilisées

### Backend

- Laravel 12
- Laravel Sanctum (authentification API)
- MySQL

### Frontend

- React Native (Expo SDK 54)
- React Navigation v6
- Axios (requêtes HTTP)
- AsyncStorage (stockage local)

---

## 🎨 Design

**Palette de couleurs :**

- Primaire : `#3498db` (Bleu)
- Secondaire : `#2ecc71` (Vert)
- Danger : `#e74c3c` (Rouge)
- Fond : `#f8f9fa`

---

## 📋 Roadmap

- [x] Setup environnement complet
- [x] API d'authentification
- [x] Écrans Login/Register/Dashboard
- [ ] CRUD Bébés
- [ ] Suivi de croissance
- [ ] Vaccinations
- [ ] Rendez-vous
- [ ] Alimentation
- [ ] Notifications

---

## 🐛 Problèmes connus

Voir le fichier `specs.txt` pour la liste complète des problèmes résolus.

---

## 📄 License

Projet académique - Tous droits réservés

---

## 👨‍💻 Auteur

Développé dans le cadre d'un projet de développement mobile (7 jours).

**Contact :** [Votre email/GitHub]

---

## 🙏 Remerciements

- Documentation Laravel
- Documentation React Native
- Communauté Expo

---

**Dernière mise à jour :** 13 décembre 2024
