# VitaLens

Carte interactive de données médicales (santé publique) - dessine une
zone, récupère les établissements dedans. Voir `Hcp_stage_V3.docx`
pour l'architecture complète et le rapport de stage.

## Structure

```
apps/
  frontend/      React + Vite - carte Leaflet, dessin de zone, résultats
  gateway/       NestJS - API Gateway (auth admin, façade vers geo-service)
  geo-service/   FastAPI - filtrage géospatial (GeoPandas/Shapely)
infra/
  terraform/     squelette, provider pas encore choisi
  k8s/           manifests kubectl apply (namespace, deployment, service, ingress)
.github/workflows/ci.yml   lint + test + build, un job par service
docker-compose.dev.yml     mongo + les 3 services, une commande
```

## Lancer en local

```bash
# gateway
cp apps/gateway/.env.example apps/gateway/.env
node -e "console.log(require('bcrypt').hashSync('ton-mdp', 10))"
# -> coller le résultat dans apps/gateway/.env, ADMIN_PASSWORD_HASH=

# geo-service
cp apps/geo-service/.env.example apps/geo-service/.env

docker compose -f docker-compose.dev.yml up --build
```

Puis, dans un autre terminal, semer des données de test :

```bash
cd apps/geo-service && python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/seed_data.py
```

- Frontend : `http://localhost:5173` - dessine une zone (outil polygone,
  en haut à droite de la carte), les résultats s'affichent à droite.
- Gateway : `http://localhost:3000`
- geo-service : `http://localhost:8000/docs` (Swagger)

## Le flux complet

```
frontend (Leaflet + Leaflet-draw)
   │  POST /zones/query  { polygon }
   ▼
gateway (NestJS)
   │  POST /zone-query   { polygon }
   ▼
geo-service (FastAPI, GeoPandas/Shapely)
   │  filtre medical_data_records par intersection géographique
   ▼
MongoDB (2dsphere index sur geometry)
```

`GET /user` et `POST /login` restent sur le gateway (compte admin
unique, JWT) - le frontend ne parle jamais à geo-service directement.

## Déployer

`infra/k8s/*.yaml` avec `kubectl apply -f infra/k8s/` une fois les
images buildées et poussées, et `infra/k8s/01-gateway-secret.yaml`
rempli (copie de `.example.yaml`, jamais commité).

## État (voir le backlog Jira / Sprint 0-6 dans le rapport)

- [x] Sprint 0 - repo, CI/CD
- [x] Sprint 1 - gateway NestJS (`/login`, `/user`, `/zones`), MongoDB + index géo
- [x] Sprint 2 - `geo-service` FastAPI (`/zone-query`), données de test (seed script - le vrai pipeline N8N reste à faire)
- [x] Sprint 3 - `frontend` React + Leaflet (carte, dessin de zone, résultats)
- [ ] Sprint 4 - UI admin (connexion, table des sources) - pas commencé
- [ ] Sprint 5 - tests, polish
- [ ] Sprint 6 - déploiement, monitoring, doc

## Limites connues

- `geo-service` charge toute la collection en mémoire avant de
  filtrer avec GeoPandas - correct à l'échelle actuelle, à revoir
  (requête `$geoWithin` sur l'index) si la collection grossit
  beaucoup.
- Pas de vraie synchronisation N8N pour l'instant - `seed_data.py`
  fournit 6 établissements de test.
- Le frontend n'a pas été vérifié dans un vrai navigateur (le
  bac à sable où j'ai écrit ce code n'a pas d'accès réseau pour
  installer un navigateur headless) - `tsc`, `oxlint`, `vite build`
  et un `vite preview` (200 OK, bon HTML) passent tous, mais un
  `npm run dev` + coup d'œil rapide de ta part reste une bonne idée.
