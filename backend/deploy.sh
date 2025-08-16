#!/bin/bash

# ==============================================================================
# SCRIPT DE DÉPLOIEMENT POUR LE BACKEND
# ==============================================================================

# -- VARIABLES DE CONFIGURATION --
export PROJECT_ID="kiwi-ops-platform"
export REGION="europe-west1"
export REPO_NAME="skinlensr-repo"
export IMAGE_NAME="skinlensr-backend-app"
export SERVICE_NAME="skinlensr-backend"
export SERVICE_ACCOUNT_EMAIL="kiwi-platform-app@${PROJECT_ID}.iam.gserviceaccount.com"

# Construire le nom complet de l'image
export IMAGE_TAG="${REGION}-docker.pkg.dev/${PROJECT_ID}/${REPO_NAME}/${IMAGE_NAME}:latest"


# -- ÉTAPE 1: CONSTRUIRE L'IMAGE --
echo "--- Lancement du build de l'image du Backend : ${IMAGE_TAG} ---"
gcloud builds submit . --tag=${IMAGE_TAG} --project=${PROJECT_ID}

# Vérifier si le build a réussi
if [ $? -ne 0 ]; then
    echo "ERREUR : Le build de l'image a échoué. Arrêt du script."
    exit 1
fi
echo "--- Build du Backend terminé avec succès. ---"
echo ""


# -- ÉTAPE 2: DÉPLOYER LE SERVICE --
echo "--- Déploiement du service ${SERVICE_NAME} dans la région ${REGION}... ---"
gcloud run deploy ${SERVICE_NAME} \
  --image=${IMAGE_TAG} \
  --service-account=${SERVICE_ACCOUNT_EMAIL} \
  --platform=managed \
  --region=${REGION} \
  --project=${PROJECT_ID}

# -- ÉTAPE 3: RENDRE LE SERVICE PUBLIC --
echo ""
echo "--- Autorisation de l'accès public pour le service ${SERVICE_NAME}... ---"
gcloud run services add-iam-policy-binding ${SERVICE_NAME} \
  --member="allUsers" \
  --role="roles/run.invoker" \
  --region=${REGION} \
  --project=${PROJECT_ID}


echo ""
echo "=============================================================================="
echo "DÉPLOIEMENT DU BACKEND TERMINÉ."
echo "=============================================================================="