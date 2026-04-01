# Résolution du problème de démarrage (Splash Screen Hang)

Ce document récapitule les problèmes rencontrés lors du développement de l'application Expo et les solutions apportées pour les résoudre.

## 1. Problème d'incompatibilité Native (Reanimated 4 / Worklets)

**Cause :** L'application a été initialement configurée avec des versions expérimentales de `react-native-reanimated` (v4.x) et `react-native-worklets`.
**Détail :** Ces bibliothèques nécessitent une correspondance parfaite entre le code JavaScript et le code Natif présent dans l'application Expo Go. Une erreur `installTurboModule called with 1 arguments (expected 0)` apparaissait, indiquant que le code JS essayait de communiquer avec une version native différente de celle présente sur le téléphone. Cela bloquait l'application dès le démarrage sur l'écran "Splash Screen".

**Solution :**

- Nous avons d'abord essayé de rétrograder vers Reanimated 3 (version stable).
- Finalement, pour garantir une stabilité totale, nous avons **supprimé Reanimated** du composant `StepFormBuilder` et sommes revenus à des composants `View` standards de React Native.

## 2. Erreur "Invalid hook call" (Multiple React Instances)

**Cause :** La structure du projet est un "monorepo" (un dossier parent pour la librairie et un sous-dossier `example` pour l'application). Metro (le bundler) finissait par charger deux exemplaires de la bibliothèque React : un depuis le dossier racine et un depuis le dossier `example`.
**Détail :** React ne supporte pas d'avoir deux instances chargées en même temps, ce qui provoque l'erreur "Invalid hook call" ou "useState is null" au moment du rendu du composant.

**Solution :**

- Nous avons modifié le fichier `example/metro.con
fig.js` pour ajouter une configuration de résolution stricte.
- Nous avons utilisé `resolver.extraNodeModules` et un `blockList` pour forcer Metro à ignorer le React du dossier parent et à utiliser uniquement celui du dossier `example`.

## 3. Dépendances et Nettoyage

**Actions effectuées :**

- Alignement des versions de `react`, `react-native` et `expo` pour correspondre aux attentes du SDK Expo 54.
- Suppression des imports inutilisés et des animations qui causaient les plantages.
- Utilisation de `npx expo start --clear` pour vider le cache à chaque changement majeur de configuration.

## Résultat Final

L'application démarre maintenant instantanément après le bundling. Le formulaire s'affiche correctement et est parfaitement fonctionnel sans risque de plantage lié au moteur d'animation natif.
