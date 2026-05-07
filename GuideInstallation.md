5 etapes pour publier/installer sur le registre npm Afrikpay :

1. Renouveler ton auth gcloud (l'ancien token a ete partage par erreur
dans le chat) :

   gcloud auth revoke (email Afrikpay)
   gcloud auth login: Authentifier avec ton email Afrikpay

2. Remplacer le contenu de ~/.npmrc par :

   registry=https://registry.npmjs.org/
   @afrikpay:registry=https://europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/
   //europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/:always-auth=true

3. Dans le .yarnrc.yml du projet ajouter :

nodeLinker: node-modules
nmHoistingLimits: workspaces

npmScopes:
  afrikpay:
    npmRegistryServer: "https://europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm"
    npmAlwaysAuth: true
    npmAuthToken: "${NPM_AUTH_TOKEN}"

plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-interactive-tools.cjs
    spec: "@yarnpkg/plugin-interactive-tools"
  - path: .yarn/plugins/@yarnpkg/plugin-workspace-tools.cjs
    spec: "@yarnpkg/plugin-workspace-tools"

yarnPath: .yarn/releases/yarn-3.6.1.cjs


3.1: si vous avez une configuration globale dans ~/.npmrc, il faut le mettre a jour avec le contenu suivant :

//localhost:4873/:_authToken=NTFjZjVjNWUzYzY1ZWNmZWY0ZTAyZDc4ZmQ5NmJlZDQ6MDc2ZD>
//europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/:_authToken=ya29.a>
registry=https://europe-west4-npm.pkg.dev/prod-app-base-060623/afrikpay-npm/



4. Avant chaque session de travail, dans le terminal de ton projet :

   export NPM_AUTH_TOKEN=$(gcloud auth print-access-token)

   (le token expire toutes les heures - a re-exporter si besoin)

5. Executer l'installation :

  a la racine du projet : yarn add @afrikpay/rn-step-form -D --peer
  dans example : yarn add @afrikpay/rn-step-form