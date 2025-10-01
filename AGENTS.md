# Guide Agents - Projet IoT Interface

## 🚀 Commandes fréquentes

### Démarrage
```bash
npm start          # Lancer l'application Electron
npm run dev        # Lancer en mode développement (avec DevTools)
```

### Build & Test
```bash
npm install        # Installer les dépendances
```

## 🔧 Configuration

### API Raspberry Pi
- **URL**: `http://10.0.0.216:5000`
- **API Key**: `test-key`
- **Polling interval**: 10 secondes

### Endpoints principaux
- `GET /health` - Health check
- `GET /api/status` - État des capteurs et actionneurs
- `GET /api/settings` - Configuration
- `POST /api/control/{actuator}` - Contrôle manuel (nécessite API key)
- `POST /api/control/auto` - Mode automatique (nécessite API key)
- `POST /api/control/emergency_stop` - Arrêt d'urgence (nécessite API key)

## 📁 Structure du projet

```
Projet_iot_interface/
├── src/
│   ├── main/
│   │   ├── main.js           # Process principal Electron
│   │   └── preload.js        # Bridge sécurisé
│   └── renderer/
│       ├── index.html        # Interface utilisateur
│       ├── app.js            # Logique frontend
│       └── config.js         # Configuration
├── docs/                     # Documentation
├── node_modules/             # Dépendances
├── package.json              # Métadonnées du projet
└── README.md                 # Guide principal
```

## 🎨 Style

- **Framework CSS**: Tailwind CSS (CDN)
- **Thème**: Dark mode (inspiré Notion/VS Code)
- **Couleurs principales**:
  - Background: `#0f0f0f`
  - Surface: `#1a1a1a`
  - Elevated: `#232323`
  - Border: `#2a2a2a`

## 🔑 Conventions de code

- **Langue**: Français pour l'interface, anglais pour le code
- **Format**: Pas de commentaires sauf si complexité
- **API calls**: Utiliser fetch avec headers conditionnels
- **État**: localStorage pour persistance
- **Notifications**: Toast en haut à droite

## 🐛 Debugging

### Vérifier la connexion
```bash
curl http://10.0.0.216:5000/health
```

### Tester les capteurs
```bash
curl http://10.0.0.216:5000/api/status
```

### Tester le contrôle (avec API key)
```bash
curl -X POST http://10.0.0.216:5000/api/control/leds \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{"manual_mode": true, "state": true}'
```

## 📝 Notes importantes

- L'API key est **obligatoire** pour tous les endpoints de contrôle
- Les endpoints de lecture (status, settings, history) sont **publics**
- Le polling est automatique toutes les 10 secondes
- Les données sont affichées en temps réel dès réception
