# 🚀 Guide d'Installation - BabyCheck

Guide complet pour configurer l'environnement de développement du projet BabyCheck.

---

## 📋 Table des matières

1. [Prérequis](#prérequis)
2. [Installation Backend (Laravel)](#installation-backend-laravel)
3. [Installation Frontend (React Native)](#installation-frontend-react-native)
4. [Configuration Réseau](#configuration-réseau)
5. [Lancement du projet](#lancement-du-projet)
6. [Problèmes courants](#problèmes-courants)

---

## 📦 Prérequis

### Logiciels à installer

#### 1. **Git**

- **Windows:** https://git-scm.com/download/win
- **macOS:** `brew install git`
- **Linux:** `sudo apt install git`

#### 2. **PHP 8.2+**

- **Windows:** Installer XAMPP (https://www.apachefriends.org/) ou Laragon (https://laragon.org/)
- **macOS:** `brew install php@8.2`
- **Linux:** `sudo apt install php8.2`

#### 3. **Composer** (Gestionnaire de paquets PHP)

- Télécharger: https://getcomposer.org/download/
- Vérifier: `composer --version`

#### 4. **Node.js 18+** (pour React Native)

- Télécharger: https://nodejs.org/ (version LTS)
- Vérifier: `node --version` et `npm --version`

#### 5. **MySQL** (Base de données)

- Inclus dans XAMPP/Laragon (Windows)
- **macOS:** `brew install mysql`
- **Linux:** `sudo apt install mysql-server`

#### 6. **Expo CLI** (pour React Native)

```bash
npm install -g expo-cli
```

#### 7. **Application Expo Go** sur votre téléphone

- **iOS:** https://apps.apple.com/app/expo-go/id982107779
- **Android:** https://play.google.com/store/apps/details?id=host.exp.exponent

---

## 🗂️ Cloner le projet

```bash
# Cloner le dépôt
git clone https://github.com/Adil-Bouhoum/BabyCehck.git

# Entrer dans le dossier
cd BabyCehck
```

---

## 🔧 Installation Backend (Laravel)

### Étape 1 : Installer les dépendances PHP

```bash
cd baby-growth-backend

# Installer les packages Composer
composer install
```

### Étape 2 : Configuration de l'environnement

```bash
# Copier le fichier d'exemple
cp .env.example .env

# OU sur Windows
copy .env.example .env
```

### Étape 3 : Générer la clé d'application

```bash
php artisan key:generate
```

### Étape 4 : Configurer la base de données

Ouvrez le fichier `.env` et modifiez :

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=baby_growth_db
DB_USERNAME=root
DB_PASSWORD=
```

**Note:** Si vous utilisez XAMPP, le mot de passe par défaut est vide. Si vous utilisez un autre serveur, adaptez les credentials.

### Étape 5 : Créer la base de données

**Via phpMyAdmin:**

1. Ouvrir http://localhost/phpmyadmin
2. Cliquer sur "Nouvelle base de données"
3. Nom: `baby_growth_db`
4. Interclassement: `utf8mb4_general_ci`
5. Créer

**Via ligne de commande:**

```bash
mysql -u root -p
CREATE DATABASE baby_growth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Étape 6 : Exécuter les migrations

```bash
php artisan migrate
```

Vous devriez voir :

```
Migration table created successfully.
Migrating: 2014_10_12_000000_create_users_table
Migrated:  2014_10_12_000000_create_users_table (XX.XXms)
...
```

### Étape 7 : Vérifier l'installation

```bash
# Démarrer le serveur Laravel
php artisan serve

# Tester dans le navigateur
# Ouvrir: http://localhost:8000/api/test
# Devrait afficher: {"status":"success","message":"API fonctionne!","timestamp":"..."}
```

✅ **Backend installé avec succès !**

---

## 📱 Installation Frontend (React Native)

### Étape 1 : Installer les dépendances Node.js

```bash
# Revenir à la racine du projet
cd ..

# Entrer dans le dossier frontend
cd baby-growth-app

# Installer les packages npm
npm install
```

⏳ Cela peut prendre 2-5 minutes.

### Étape 2 : Configuration de l'API

**IMPORTANT:** Vous devez configurer l'adresse IP de votre serveur Laravel.

#### Trouver votre IP locale :

**Windows:**

```bash
ipconfig
# Chercher "Adresse IPv4" sous "Carte réseau sans fil Wi-Fi"
# Exemple: 192.168.1.162
```

**macOS/Linux:**

```bash
ifconfig
# Chercher "inet" sous "en0" ou "wlan0"
# Exemple: 192.168.1.162
```

#### Modifier la configuration :

Ouvrez `src/services/api.js` et modifiez la ligne :

```javascript
const API_BASE_URL = "http://VOTRE_IP_ICI:8000/api";

// Exemple:
const API_BASE_URL = "http://192.168.1.162:8000/api";
```

### Étape 3 : Lancer l'application

```bash
npx expo start
```

Un QR code apparaîtra dans le terminal.

### Étape 4 : Tester sur votre téléphone

1. **Assurez-vous que votre téléphone et votre PC sont sur le même WiFi**
2. Ouvrez l'app **Expo Go** sur votre téléphone
3. Scannez le QR code affiché dans le terminal
4. L'application devrait se charger

✅ **Frontend installé avec succès !**

---

## 🌐 Configuration Réseau

### Windows - Autoriser le pare-feu

Pour que votre téléphone puisse communiquer avec Laravel, autorisez le port 8000 :

```powershell
# Ouvrir PowerShell en ADMINISTRATEUR
netsh advfirewall firewall add rule name="Laravel Dev Server" dir=in action=allow protocol=TCP localport=8000
```

### Démarrer Laravel avec l'IP publique

Au lieu de `php artisan serve`, utilisez :

```bash
php artisan serve --host=0.0.0.0 --port=8000
```

Cela permet à Laravel d'accepter les connexions depuis d'autres appareils du réseau local.

---

## 🚀 Lancement du projet

### Backend (Terminal 1)

```bash
cd baby-growth-backend
php artisan serve --host=0.0.0.0 --port=8000
```

Vous devriez voir :

```
Server running on [http://0.0.0.0:8000]
```

### Frontend (Terminal 2)

```bash
cd baby-growth-app
npx expo start
```

Scannez le QR code avec Expo Go sur votre téléphone.

---

## 🧪 Tests de vérification

### 1. Tester l'API Backend

Ouvrir dans le navigateur :

```
http://localhost:8000/api/test
```

Devrait retourner :

```json
{
  "status": "success",
  "message": "API fonctionne!",
  "timestamp": "2024-12-13T..."
}
```

### 2. Tester depuis votre téléphone

Ouvrir le navigateur du téléphone :

```
http://VOTRE_IP:8000/api/test
```

Si ça fonctionne, l'app React Native pourra communiquer avec Laravel.

### 3. Tester l'authentification

1. Lancer l'app sur votre téléphone
2. Cliquer sur "Pas de compte ? S'inscrire"
3. Remplir le formulaire
4. Si vous arrivez sur le Dashboard avec votre nom → ✅ Tout fonctionne !

---

## ❗ Problèmes courants

### 1. **Erreur "php: command not found"**

**Solution:** Ajouter PHP au PATH système.

**Windows (XAMPP):**

```
Panneau de configuration → Système → Paramètres système avancés
→ Variables d'environnement → Path → Modifier
→ Ajouter: C:\xampp\php
```

Redémarrer le terminal et tester : `php --version`

---

### 2. **Erreur "composer: command not found"**

**Solution:** Réinstaller Composer et cocher "Add to PATH" pendant l'installation.

Vérifier : `composer --version`

---

### 3. **Erreur "SQLSTATE[HY000] [1045] Access denied for user"**

**Solution:** Vérifier les credentials MySQL dans `.env`

```env
DB_USERNAME=root
DB_PASSWORD=        # Vide pour XAMPP par défaut
```

---

### 4. **Erreur "Network Error" dans l'app mobile**

**Causes possibles:**

#### A. Pare-feu bloque le port 8000

```powershell
# Autoriser le port (PowerShell ADMIN)
netsh advfirewall firewall add rule name="Laravel" dir=in action=allow protocol=TCP localport=8000
```

#### B. Mauvaise IP dans api.js

Vérifier `src/services/api.js` :

```javascript
const API_BASE_URL = "http://VOTRE_IP:8000/api";
```

#### C. PC et téléphone sur des réseaux différents

- Assurez-vous que les deux sont sur le **même WiFi**

#### D. Tester la connexion

Depuis le navigateur du téléphone, ouvrir :

```
http://VOTRE_IP:8000/api/test
```

Si ça ne marche pas → Problème réseau  
Si ça marche → Problème dans l'app

---

### 5. **Erreur "Expo Go crashed" ou "Metro bundler error"**

**Solution:**

```bash
cd baby-growth-app

# Nettoyer le cache
npx expo start -c

# OU supprimer node_modules et réinstaller
rm -rf node_modules
npm install
npx expo start
```

---

### 6. **Erreur "Class 'ZipArchive' not found"**

**Solution:** Activer l'extension Zip dans PHP.

**Windows (XAMPP):**

1. Ouvrir `C:\xampp\php\php.ini`
2. Chercher `;extension=zip`
3. Supprimer le `;` → `extension=zip`
4. Sauvegarder et redémarrer Apache

---

### 7. **Migration error "Base table or view already exists"**

**Solution:** Reset de la base de données

```bash
# ATTENTION: Cela supprime toutes les données !
php artisan migrate:fresh
```

---

## 📚 Commandes utiles

### Backend (Laravel)

```bash
# Lister les routes API
php artisan route:list --path=api

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear

# Créer un contrôleur
php artisan make:controller Api/BabyController

# Créer un modèle avec migration
php artisan make:model Baby -m

# Console interactive
php artisan tinker
```

### Frontend (React Native)

```bash
# Lancer avec cache nettoyé
npx expo start -c

# Voir les logs
# Les logs s'affichent automatiquement dans le terminal

# Installer une nouvelle dépendance
npm install nom-du-package

# Mettre à jour Expo
npm install expo@latest
```

### Git

```bash
# Voir les modifications
git status

# Récupérer les dernières modifications
git pull origin main

# Créer une branche
git checkout -b feature/nom-fonctionnalite

# Commit et push
git add .
git commit -m "Description des changements"
git push origin nom-de-la-branche
```

---

## 🔒 Sécurité

### ⚠️ Ne JAMAIS commiter ces fichiers :

- `baby-growth-backend/.env` (contient DB_PASSWORD, APP_KEY)
- `baby-growth-app/.env` (s'il existe)
- `node_modules/`
- `vendor/`

Ces fichiers sont déjà dans `.gitignore`.

### Vérifier avant de commit :

```bash
git status
# Ne devrait PAS afficher .env
```

---

## 📞 Besoin d'aide ?

### Documentation officielle

- **Laravel:** https://laravel.com/docs
- **React Navigation:** https://reactnavigation.org/docs/getting-started
- **Expo:** https://docs.expo.dev

### Logs de debug

**Backend (Laravel):**

```bash
tail -f storage/logs/laravel.log
```

**Frontend (React Native):**
Les logs s'affichent dans le terminal Metro Bundler.

### Contacter l'équipe

- **GitHub Issues:** https://github.com/Adil-Bouhoum/BabyCehck/issues
- **Email:** [Votre email de contact]

---

## ✅ Checklist d'installation

```
☐ Git installé
☐ PHP 8.2+ installé
☐ Composer installé
☐ Node.js 18+ installé
☐ MySQL installé
☐ Expo CLI installé
☐ Expo Go installé sur téléphone
☐ Projet cloné
☐ Dépendances backend installées (composer install)
☐ .env configuré
☐ Base de données créée
☐ Migrations exécutées
☐ Laravel démarre sans erreur
☐ Dépendances frontend installées (npm install)
☐ IP configurée dans api.js
☐ PC et téléphone sur le même WiFi
☐ Pare-feu autorise le port 8000
☐ App React Native se lance
☐ Inscription/Connexion fonctionne
```

---

**Dernière mise à jour:** 13 décembre 2024  
**Version du guide:** 1.0

Bon développement ! 🚀
