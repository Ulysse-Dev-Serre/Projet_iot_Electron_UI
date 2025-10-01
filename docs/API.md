# Documentation API - Serre Connectée

Documentation complète de l'API REST du backend Raspberry Pi.

**Base URL :** `http://10.0.0.216:5000`

---

## 📑 Table des matières

1. [Authentification](#authentification)
2. [Endpoints publics](#endpoints-publics)
   - [Health Check](#health-check)
   - [Status](#status)
   - [Settings](#settings-lecture)
   - [History](#history)
3. [Endpoints protégés](#endpoints-protégés)
   - [Contrôle des actionneurs](#contrôle-des-actionneurs)
   - [Mode automatique global](#mode-automatique-global)
   - [Arrêt d'urgence](#arrêt-durgence)
   - [Modification des paramètres](#modification-des-paramètres)
4. [Codes d'erreur](#codes-derreur)
5. [Exemples d'utilisation](#exemples-dutilisation)

---

## 🔐 Authentification

Les endpoints de **contrôle** et de **modification** nécessitent une clé API.

**Header requis :**
```
X-API-Key: test-key
```

**Obtenir la clé API :**
- Par défaut : `test-key`
- Configurée via `export API_KEY="ta-cle"` sur le Raspberry Pi
- Visible dans les logs au démarrage de l'API

---

## 🌍 Endpoints publics

Ces endpoints ne nécessitent **pas** d'authentification.

### Health Check

Vérifie que l'API est accessible et fonctionnelle.

**Endpoint :** `GET /health`

**Réponse :**
```json
{
  "status": "healthy",
  "version": "3.0.0",
  "mode": "full-control",
  "orchestrator": "attached"
}
```

**Codes HTTP :**
- `200 OK` - API fonctionnelle
- `503 Service Unavailable` - Orchestrateur non attaché

**Exemple :**
```bash
curl http://10.0.0.216:5000/health
```

---

### Status

Récupère l'état actuel des capteurs et actionneurs.

**Endpoint :** `GET /api/status`

**Réponse :**
```json
{
  "timestamp": "2025-10-01 12:30:45",
  "temperature": "25.8",
  "humidite": "32.4",
  "co2": "650",
  "sensor_read_ok": true,
  "leds": {
    "is_active": false,
    "manual_mode": true,
    "on_duration_seconds": 0,
    "off_duration_seconds": 150.6
  },
  "humidifier": {
    "is_active": false,
    "manual_mode": false,
    "on_duration_seconds": 0,
    "off_duration_seconds": 0
  },
  "ventilation": {
    "is_active": false,
    "manual_mode": false,
    "on_duration_seconds": 0,
    "off_duration_seconds": 0
  }
}
```

**Champs :**

| Champ | Type | Description |
|-------|------|-------------|
| `timestamp` | string | Date/heure de la lecture (YYYY-MM-DD HH:MM:SS) |
| `temperature` | string | Température en °C (ou "N/A" si erreur) |
| `humidite` | string | Humidité en % (ou "N/A" si erreur) |
| `co2` | string | CO2 en ppm (ou "N/A" si erreur) |
| `sensor_read_ok` | boolean | `true` si capteurs OK, `false` si défaillants |
| `leds.is_active` | boolean | LEDs allumées ou non |
| `leds.manual_mode` | boolean | `true` = contrôle manuel, `false` = auto |
| `leds.on_duration_seconds` | number | Secondes depuis allumage (0 si éteint) |
| `leds.off_duration_seconds` | number | Secondes depuis extinction (0 si allumé) |

*Même structure pour `humidifier` et `ventilation`*

**Codes HTTP :**
- `200 OK` - Succès
- `503 Service Unavailable` - Orchestrateur non disponible

**Exemple :**
```bash
curl http://10.0.0.216:5000/api/status
```

---

### Settings (Lecture)

Récupère les paramètres de configuration actuels.

**Endpoint :** `GET /api/settings`

**Réponse :**
```json
{
  "HEURE_DEBUT_LEDS": 9,
  "HEURE_FIN_LEDS": 20,
  "SEUIL_HUMIDITE_ON": 75.0,
  "SEUIL_HUMIDITE_OFF": 84.9,
  "SEUIL_CO2_MAX": 1200.0,
  "HEURE_DEBUT_JOUR_OPERATION": 8,
  "HEURE_FIN_JOUR_OPERATION": 22,
  "PIN_LEDS": 27,
  "PIN_VENTILATION": 22,
  "PIN_FAN_HUMIDIFICATEUR": 26,
  "PIN_BRUMISATEUR": 13,
  "NOM_CAPTEUR_CO2": "co2"
}
```

**Champs principaux :**

| Paramètre | Type | Description | Plage |
|-----------|------|-------------|-------|
| `HEURE_DEBUT_LEDS` | int | Heure d'allumage auto des LEDs | 0-23 |
| `HEURE_FIN_LEDS` | int | Heure d'extinction auto des LEDs | 0-23 |
| `SEUIL_HUMIDITE_ON` | float | Active humidificateur si humidité < | 0-100 |
| `SEUIL_HUMIDITE_OFF` | float | Désactive humidificateur si humidité > | 0-100 |
| `SEUIL_CO2_MAX` | float | Active ventilation si CO2 > | 400-5000 |
| `HEURE_DEBUT_JOUR_OPERATION` | int | Début période active humidif./ventil. | 0-23 |
| `HEURE_FIN_JOUR_OPERATION` | int | Fin période active humidif./ventil. | 0-23 |

**Codes HTTP :**
- `200 OK` - Succès

**Exemple :**
```bash
curl http://10.0.0.216:5000/api/settings
```

---

### History

Récupère l'historique des données des capteurs.

**Endpoint :** `GET /api/history?limit=100`

**Paramètres :**

| Paramètre | Type | Défaut | Description |
|-----------|------|--------|-------------|
| `limit` | int | 100 | Nombre d'entrées à retourner (max) |

**Réponse :**
```json
{
  "count": 100,
  "data": [
    {
      "timestamp": "2025-10-01 12:30:00",
      "temperature": 25.8,
      "humidity": 32.4,
      "co2": 650,
      "leds_active": false,
      "humidifier_active": false,
      "ventilation_active": false
    },
    {
      "timestamp": "2025-10-01 12:15:00",
      "temperature": 25.7,
      "humidity": 32.5,
      "co2": 648,
      "leds_active": false,
      "humidifier_active": false,
      "ventilation_active": false
    }
  ]
}
```

**Champs par entrée :**

| Champ | Type | Description |
|-------|------|-------------|
| `timestamp` | string | Date/heure de l'enregistrement |
| `temperature` | float | Température en °C |
| `humidity` | float | Humidité en % |
| `co2` | float | CO2 en ppm |
| `leds_active` | boolean | État des LEDs à ce moment |
| `humidifier_active` | boolean | État de l'humidificateur |
| `ventilation_active` | boolean | État de la ventilation |

**Notes :**
- Les données sont triées du plus récent au plus ancien
- Fréquence d'enregistrement : ~15 secondes (configurable backend)
- Les entrées sont limitées par la base de données

**Codes HTTP :**
- `200 OK` - Succès
- `400 Bad Request` - Limite invalide

**Exemples :**
```bash
# 100 dernières entrées
curl "http://10.0.0.216:5000/api/history?limit=100"

# 24h de données (96 points si 15min d'intervalle)
curl "http://10.0.0.216:5000/api/history?limit=96"

# 7 jours
curl "http://10.0.0.216:5000/api/history?limit=672"
```

---

## 🔒 Endpoints protégés

Ces endpoints nécessitent le header `X-API-Key`.

### Contrôle des actionneurs

Active/désactive manuellement un actionneur spécifique.

**Endpoints :**
- `POST /api/control/leds`
- `POST /api/control/humidifier`
- `POST /api/control/ventilation`

**Headers requis :**
```
Content-Type: application/json
X-API-Key: test-key
```

**Body :**
```json
{
  "manual_mode": true,
  "state": true
}
```

**Paramètres :**

| Champ | Type | Description |
|-------|------|-------------|
| `manual_mode` | boolean | `true` = manuel, `false` = auto |
| `state` | boolean | `true` = allumer, `false` = éteindre |

**Réponse :**
```json
{
  "success": true,
  "actuator": "leds",
  "manual_mode": true,
  "state": true
}
```

**Codes HTTP :**
- `200 OK` - Succès
- `400 Bad Request` - Body JSON invalide
- `401 Unauthorized` - Clé API manquante ou invalide
- `503 Service Unavailable` - Orchestrateur non disponible

**Exemples :**

```bash
# Allumer les LEDs manuellement
curl -X POST http://10.0.0.216:5000/api/control/leds \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{"manual_mode": true, "state": true}'

# Éteindre l'humidificateur manuellement
curl -X POST http://10.0.0.216:5000/api/control/humidifier \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{"manual_mode": true, "state": false}'

# Remettre la ventilation en mode auto
curl -X POST http://10.0.0.216:5000/api/control/ventilation \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{"manual_mode": false}'
```

---

### Mode automatique global

Remet **tous** les actionneurs en mode automatique d'un coup.

**Endpoint :** `POST /api/control/auto`

**Headers requis :**
```
X-API-Key: test-key
```

**Body :** Aucun (ou vide)

**Réponse :**
```json
{
  "success": true,
  "message": "Tous les actionneurs sont en mode automatique",
  "status": {
    "timestamp": "2025-10-01 12:45:00",
    "temperature": "25.8",
    "humidite": "32.4",
    "co2": "650",
    "sensor_read_ok": true,
    "leds": {
      "is_active": false,
      "manual_mode": false,
      "on_duration_seconds": 0,
      "off_duration_seconds": 200.0
    },
    "humidifier": {
      "is_active": false,
      "manual_mode": false,
      "on_duration_seconds": 0,
      "off_duration_seconds": 0
    },
    "ventilation": {
      "is_active": false,
      "manual_mode": false,
      "on_duration_seconds": 0,
      "off_duration_seconds": 0
    }
  }
}
```

**Codes HTTP :**
- `200 OK` - Succès
- `401 Unauthorized` - Clé API manquante ou invalide
- `503 Service Unavailable` - Orchestrateur non disponible

**Exemple :**
```bash
curl -X POST http://10.0.0.216:5000/api/control/auto \
  -H "X-API-Key: test-key"
```

---

### Arrêt d'urgence

Coupe **tous** les actionneurs immédiatement et les passe en mode manuel OFF.

**Endpoint :** `POST /api/control/emergency_stop`

**Headers requis :**
```
X-API-Key: test-key
```

**Body :** Aucun (ou vide)

**Réponse :**
```json
{
  "success": true,
  "message": "Arrêt d'urgence effectué",
  "status": {
    "timestamp": "2025-10-01 12:50:00",
    "temperature": "25.8",
    "humidite": "32.4",
    "co2": "650",
    "sensor_read_ok": true,
    "leds": {
      "is_active": false,
      "manual_mode": true,
      "on_duration_seconds": 0,
      "off_duration_seconds": 5.2
    },
    "humidifier": {
      "is_active": false,
      "manual_mode": true,
      "on_duration_seconds": 0,
      "off_duration_seconds": 5.2
    },
    "ventilation": {
      "is_active": false,
      "manual_mode": true,
      "on_duration_seconds": 0,
      "off_duration_seconds": 5.2
    }
  }
}
```

**Effet :**
- ✅ Tous les actionneurs sont éteints
- ✅ Tous passent en mode manuel (pour éviter rallumage auto)
- ⚠️ Nécessite de remettre en mode auto manuellement après

**Codes HTTP :**
- `200 OK` - Succès
- `401 Unauthorized` - Clé API manquante ou invalide
- `503 Service Unavailable` - Orchestrateur non disponible

**Exemple :**
```bash
curl -X POST http://10.0.0.216:5000/api/control/emergency_stop \
  -H "X-API-Key: test-key"
```

---

### Modification des paramètres

Modifie la configuration des seuils et horaires.

**Endpoint :** `PUT /api/settings`

**Headers requis :**
```
Content-Type: application/json
X-API-Key: test-key
```

**Body :**
```json
{
  "settings": {
    "HEURE_DEBUT_LEDS": 8,
    "HEURE_FIN_LEDS": 21,
    "SEUIL_HUMIDITE_ON": 70.0,
    "SEUIL_HUMIDITE_OFF": 85.0,
    "SEUIL_CO2_MAX": 1300.0
  }
}
```

**Paramètres modifiables :**

| Paramètre | Type | Min | Max | Description |
|-----------|------|-----|-----|-------------|
| `HEURE_DEBUT_LEDS` | int | 0 | 23 | Heure d'allumage LEDs |
| `HEURE_FIN_LEDS` | int | 0 | 23 | Heure d'extinction LEDs |
| `SEUIL_HUMIDITE_ON` | float | 0 | 100 | Seuil activation humidificateur |
| `SEUIL_HUMIDITE_OFF` | float | 0 | 100 | Seuil désactivation humidificateur |
| `SEUIL_CO2_MAX` | float | 400 | 5000 | Seuil activation ventilation |
| `HEURE_DEBUT_JOUR_OPERATION` | int | 0 | 23 | Début période active |
| `HEURE_FIN_JOUR_OPERATION` | int | 0 | 23 | Fin période active |

**Notes :**
- Tu peux modifier un ou plusieurs paramètres à la fois
- Les paramètres non mentionnés gardent leur valeur actuelle
- Les changements sont appliqués immédiatement
- Les paramètres sont sauvegardés dans `data/user_settings.json` sur le Pi

**Réponse :**
```json
{
  "success": true,
  "message": "Paramètres mis à jour avec succès",
  "new_settings": {
    "HEURE_DEBUT_LEDS": 8,
    "HEURE_FIN_LEDS": 21,
    "SEUIL_HUMIDITE_ON": 70.0,
    "SEUIL_HUMIDITE_OFF": 85.0,
    "SEUIL_CO2_MAX": 1300.0,
    "HEURE_DEBUT_JOUR_OPERATION": 8,
    "HEURE_FIN_JOUR_OPERATION": 22,
    "PIN_LEDS": 27,
    "PIN_VENTILATION": 22,
    "PIN_FAN_HUMIDIFICATEUR": 26,
    "PIN_BRUMISATEUR": 13,
    "NOM_CAPTEUR_CO2": "co2"
  }
}
```

**Codes HTTP :**
- `200 OK` - Succès
- `400 Bad Request` - Body JSON invalide ou valeurs hors limites
- `401 Unauthorized` - Clé API manquante ou invalide
- `503 Service Unavailable` - Orchestrateur non disponible

**Exemple :**
```bash
curl -X PUT http://10.0.0.216:5000/api/settings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: test-key" \
  -d '{
    "settings": {
      "HEURE_DEBUT_LEDS": 8,
      "SEUIL_HUMIDITE_ON": 70.0
    }
  }'
```

---

## ❌ Codes d'erreur

| Code | Status | Description | Solution |
|------|--------|-------------|----------|
| `200` | OK | Requête réussie | - |
| `400` | Bad Request | Body JSON invalide ou paramètres manquants | Vérifier le format JSON |
| `401` | Unauthorized | Clé API invalide ou manquante | Ajouter header `X-API-Key` |
| `404` | Not Found | Endpoint introuvable | Vérifier l'URL |
| `500` | Internal Server Error | Erreur interne du serveur | Vérifier les logs sur le Pi |
| `503` | Service Unavailable | Orchestrateur non attaché | Relancer `main.py` sur le Pi |

**Réponse d'erreur type :**
```json
{
  "detail": "Clé API invalide ou manquante"
}
```

---

## 💡 Exemples d'utilisation

### JavaScript (Frontend)

```javascript
// Configuration
const API_KEY = 'test-key';
const BASE_URL = 'http://10.0.0.216:5000';

// Récupérer le status
async function getStatus() {
  const response = await fetch(`${BASE_URL}/api/status`);
  const data = await response.json();
  console.log(data);
}

// Allumer les LEDs
async function turnOnLeds() {
  const response = await fetch(`${BASE_URL}/api/control/leds`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY
    },
    body: JSON.stringify({
      manual_mode: true,
      state: true
    })
  });
  const result = await response.json();
  console.log(result);
}

// Mode auto global
async function setAutoAll() {
  const response = await fetch(`${BASE_URL}/api/control/auto`, {
    method: 'POST',
    headers: { 'X-API-Key': API_KEY }
  });
  const result = await response.json();
  console.log(result);
}
```

### Python

```python
import requests

API_KEY = 'test-key'
BASE_URL = 'http://10.0.0.216:5000'
headers = {'X-API-Key': API_KEY}

# Récupérer le status
response = requests.get(f'{BASE_URL}/api/status')
print(response.json())

# Allumer les LEDs
response = requests.post(
    f'{BASE_URL}/api/control/leds',
    headers={**headers, 'Content-Type': 'application/json'},
    json={'manual_mode': True, 'state': True}
)
print(response.json())

# Mode auto global
response = requests.post(
    f'{BASE_URL}/api/control/auto',
    headers=headers
)
print(response.json())
```

### Bash (curl)

```bash
# Variables
API_KEY="test-key"
BASE_URL="http://10.0.0.216:5000"

# Health check
curl $BASE_URL/health

# Status
curl $BASE_URL/api/status

# Allumer LEDs
curl -X POST $BASE_URL/api/control/leds \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"manual_mode": true, "state": true}'

# Historique 24h
curl "$BASE_URL/api/history?limit=96"

# Modifier config
curl -X PUT $BASE_URL/api/settings \
  -H "Content-Type: application/json" \
  -H "X-API-Key: $API_KEY" \
  -d '{"settings": {"SEUIL_HUMIDITE_ON": 70.0}}'
```

---

## 📚 Ressources

- **Swagger UI interactif :** http://10.0.0.216:5000/docs
- **Code source backend :** `src/api/monitoring_api.py` (sur le Pi)
- **Frontend :** Cette application Electron

---

**Documentation à jour pour la version 3.0.0 de l'API** 🚀
