# Guide d'Utilisation Complet de la Librairie @afrikpay/rn-step-form

Bienvenue dans ce guide complet pour utiliser la librairie `@afrikpay/rn-step-form` ! Imaginez que vous construisez une maison : cette librairie est comme un kit de construction qui vous aide à créer des formulaires en plusieurs étapes dans une application mobile React Native. Même si vous n'êtes pas un expert en informatique, suivez les étapes une par une, et vous pourrez intégrer cette librairie facilement. Nous allons tout expliquer avec des mots simples, des analogies et des exemples concrets.

## Qu'est-ce que c'est cette librairie ?

La librairie `@afrikpay/rn-step-form` est un outil pour créer des formulaires qui se déroulent en plusieurs étapes, comme un questionnaire ou un processus d'inscription. Par exemple, imaginez que vous remplissez un formulaire pour ouvrir un compte bancaire : d'abord vos informations personnelles, puis vos coordonnées, puis la validation. Cette librairie rend cela facile et beau dans une app mobile.

Elle utilise des technologies comme React Native (pour les apps mobiles), NativeWind (pour le style), React Hook Form (pour gérer les données) et Zod (pour vérifier que les données sont correctes).

## Prérequis : Ce qu'il faut avant de commencer

Avant d'utiliser cette librairie, vous devez avoir :

- **Un projet React Native** : C'est comme une boîte à outils pour créer des apps mobiles. Si vous n'en avez pas, créez-en un avec `npx react-native init MonProjet`.
- **Node.js et yarn** : Ce sont des outils pour installer des librairies. Téléchargez-les depuis nodejs.org.
- **Les dépendances nécessaires** : La librairie a besoin d'autres outils. Assurez-vous que votre projet a :
  - `react-native-reanimated` (pour les animations)
  - `react-hook-form` (pour gérer les formulaires)
  - `@hookform/resolvers` et `zod` (pour la validation)
  - `lucide-react-native` (pour les icônes)
  - `nativewind` (pour le style)

Si vous n'avez pas ces dépendances, installez-les avec :

avec yarn :

```bash
yarn add react-native-reanimated react-hook-form @hookform/resolvers zod lucide-react-native nativewind
```

## Étape 1 : Installer la Librairie

C'est simple comme installer une app sur votre téléphone !

1. Ouvrez votre terminal (c'est comme une fenêtre de commande sur votre ordinateur).
2. Allez dans le dossier de votre projet React Native : `cd MonProjet`.
3. Tapez cette commande :

   avec yarn :

   ```bash
   yarn add @afrikpay/rn-step-form
   ```

4. Attendez que l'installation se termine. C'est comme télécharger une app – ça prend quelques secondes.

Voilà ! La librairie est maintenant dans votre projet.

## Étape 2 : Configurer Votre Projet

Maintenant, il faut dire à votre projet comment utiliser la librairie. C'est comme configurer une nouvelle voiture.

### Configurer NativeWind (pour le style)

Si vous n'avez pas encore configuré NativeWind, suivez ces étapes :

1. Installez NativeWind si ce n'est pas fait : `npm install nativewind`.
2. Dans votre fichier `babel.config.js`, ajoutez :

   ```javascript
   module.exports = {
     presets: ['module:metro-react-native-babel-preset'],
     plugins: ['nativewind/babel'],
   };
   ```

3. Dans votre `tailwind.config.js` (créez-le si nécessaire) :

   ```javascript
   module.exports = {
     content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

4. Importez NativeWind dans votre app (dans `App.tsx` ou `index.js`) :

   ```javascript
   import 'nativewind/babel';
   ```

### Configurer React Native Reanimated

Pour les animations :

1. Suivez le guide officiel : https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/installation
2. Assurez-vous d'avoir la version compatible avec votre React Native.

### Configurer les Permissions (si vous utilisez des fichiers)

Si votre formulaire a des champs pour télécharger des fichiers, ajoutez les permissions dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

Et pour iOS, dans `ios/Projet/Info.plist` :

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>Cette app a besoin d'accéder à votre bibliothèque pour télécharger des fichiers.</string>
```

## Étape 3 : Utilisation de Base – Créer Votre Premier Formulaire

Imaginez que vous voulez créer un formulaire pour s'inscrire à un club. Il y a deux étapes : d'abord le nom et l'âge, puis l'email.

Voici comment faire :

1. Dans votre fichier (par exemple `App.tsx`), importez la librairie :

   ```javascript
   import { StepFormBuilder } from '@afrikpay/rn-step-form';
   import { View } from 'react-native';
   ```

2. Créez le composant :

   ```javascript
   export default function App() {
     return (
       <View style={{ flex: 1 }}>
         <StepFormBuilder
           onSubmit={(data) => {
             console.log('Données soumises :', data);
             // Ici, vous pouvez envoyer les données à un serveur
           }}
           steps={[
             {
               title: 'Informations de Base',
               fields: [
                 {
                   name: 'nom',
                   label: 'Votre nom',
                   type: 'text',
                   validation: { required: 'Le nom est obligatoire' },
                 },
                 {
                   name: 'age',
                   label: 'Votre âge',
                   type: 'number',
                   validation: { required: "L'âge est obligatoire" },
                 },
               ],
             },
             {
               title: 'Contact',
               fields: [
                 {
                   name: 'email',
                   label: 'Votre email',
                   type: 'email',
                   validation: {
                     required: "L'email est obligatoire",
                     pattern: {
                       value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                       message: 'Email invalide',
                     },
                   },
                 },
               ],
             },
           ]}
         />
       </View>
     );
   }
   ```

3. Lancez votre app : `npx expo start` ou `yarn start`.

Vous verrez un formulaire avec deux étapes. Remplissez les champs et cliquez sur "Suivant" pour passer à l'étape suivante, puis "Valider" pour soumettre.

## Étape 4 : Exemples Détaillés

### Exemple 1 : Formulaire d'Inscription Simple

Voici un exemple complet avec plus de champs :

```javascript
import { StepFormBuilder } from '@afrikpay/rn-step-form';

const steps = [
  {
    title: 'Étape 1 : Qui êtes-vous ?',
    fields: [
      {
        name: 'prenom',
        label: 'Prénom',
        type: 'text',
        placeholder: 'Entrez votre prénom',
        validation: { required: 'Prénom requis' },
      },
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        validation: { required: 'Nom requis' },
      },
      {
        name: 'date_naissance',
        label: 'Date de naissance',
        type: 'date',
      },
    ],
  },
  {
    title: 'Étape 2 : Vos coordonnées',
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validation: {
          required: 'Email requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Format email invalide',
          },
        },
      },
      {
        name: 'telephone',
        label: 'Téléphone',
        type: 'phone',
        validation: { required: 'Téléphone requis' },
      },
    ],
  },
  {
    title: 'Étape 3 : Préférences',
    fields: [
      {
        name: 'sexe',
        label: 'Sexe',
        type: 'radio',
        options: [
          { label: 'Homme', value: 'homme' },
          { label: 'Femme', value: 'femme' },
          { label: 'Autre', value: 'autre' },
        ],
        validation: { required: 'Sélectionnez une option' },
      },
      {
        name: 'newsletter',
        label: "S'abonner à la newsletter",
        type: 'switch',
        defaultValue: false,
      },
    ],
  },
];

export default function InscriptionForm() {
  const handleSubmit = (data) => {
    // Envoyer les données à votre serveur
    alert('Inscription réussie !');
  };

  return (
    <StepFormBuilder
      steps={steps}
      onSubmit={handleSubmit}
      nextLabel="Continuer"
      backLabel="Retour"
      submitLabel="S'inscrire"
    />
  );
}
```

### Exemple 2 : Formulaire avec Champs Conditionnels

Parfois, un champ apparaît seulement si vous avez répondu à un autre. Par exemple, si vous êtes marié, on vous demande le nom de votre conjoint.

```javascript
const steps = [
  {
    title: 'État Civil',
    fields: [
      {
        name: 'marie',
        label: 'Êtes-vous marié ?',
        type: 'select',
        options: [
          { label: 'Oui', value: 'oui' },
          { label: 'Non', value: 'non' },
        ],
      },
      {
        name: 'nom_conjoint',
        label: 'Nom de votre conjoint',
        type: 'text',
        showWhen: { field: 'marie', value: 'oui' }, // Apparaît seulement si marié
      },
    ],
  },
];
```

### Exemple 3 : Étape Personnalisée

Pour des étapes plus complexes, comme choisir un paiement :

```javascript
const steps = [
  {
    title: 'Choisir le Paiement',
    type: 'custom',
    render: (data, goToNext, goToPrev) => (
      <View>
        <Text>Sélectionnez votre méthode de paiement :</Text>
        {/* Ici, ajoutez vos boutons ou composants personnalisés */}
        <Button title="Carte de Crédit" onPress={goToNext} />
      </View>
    ),
  },
];
```

## Étape 5 : Tous les Types de Champs Disponibles

Voici une liste de tous les types de champs que vous pouvez utiliser, avec des exemples :

- **text** : Texte simple. Ex : Nom, Adresse.
- **email** : Pour les emails, avec validation automatique.
- **password** : Mot de passe caché.
- **number** : Nombres. Ex : Âge, Quantité.
- **phone** : Téléphone, avec validation.
- **multiline** : Texte long, comme une description.
- **date** : Sélecteur de date.
- **select** : Menu déroulant. Ex : Pays, Catégorie.
- **radio** : Boutons radio pour choisir une option.
- **switch** : Interrupteur oui/non.
- **checkbox** : Case à cocher.
- **file** : Télécharger un fichier.

Pour chaque champ, vous pouvez ajouter :

- `label` : Le texte affiché.
- `placeholder` : Texte d'exemple.
- `validation` : Règles comme "requis" ou "longueur minimale".
- `defaultValue` : Valeur par défaut.
- `disabled` : Désactiver le champ.
- `showWhen` : Condition pour afficher le champ.

## Étape 6 : Propriétés Avancées du StepFormBuilder

Voici les principales propriétés (props) que vous pouvez utiliser :

- **steps** : La liste des étapes (obligatoire).
- **onSubmit** : Fonction appelée quand le formulaire est soumis (obligatoire).
- **onError** : Fonction pour gérer les erreurs.
- **defaultValues** : Valeurs par défaut pour les champs.
- **nextLabel** : Texte du bouton "Suivant" (par défaut "Suivant").
- **backLabel** : Texte du bouton "Retour" (par défaut "Retour").
- **submitLabel** : Texte du bouton "Valider" (par défaut "Valider").
- **resolver** : Pour une validation personnalisée avec Zod.

Exemple avec validation personnalisée :

```javascript
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  nom: z.string().min(2, 'Nom trop court'),
  age: z.number().min(18, 'Vous devez avoir 18 ans'),
});

<StepFormBuilder
  steps={steps}
  onSubmit={handleSubmit}
  resolver={zodResolver(schema)}
/>;
```

## Étape 7 : Gérer les Données et les Actions

### Validation par Étape

Vous pouvez empêcher de passer à l'étape suivante si des champs ne sont pas remplis :

```javascript
{
  title: 'Étape 1',
  fields: [...],
  isNextDisabled: (values) => !values.nom || !values.age, // Désactive si nom ou âge manquant
}
```

### Action Après une Étape

Pour faire quelque chose après une étape, comme vérifier des données :

```javascript
{
  title: 'Étape 1',
  fields: [...],
  onStepComplete: async (data) => {
    // Vérifier avec un serveur
    const response = await fetch('/api/verifier', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Erreur de vérification');
    }
    return data; // Ou modifier les données
  },
}
```

## Étape 8 : Personnaliser le Style

La librairie utilise NativeWind pour le style. Vous pouvez personnaliser les couleurs, tailles, etc., en modifiant les classes CSS.

Par exemple, pour changer les couleurs, modifiez le fichier `tokens.ts` ou ajoutez des styles personnalisés.

## Dépannage : Que Faire si Ça Ne Marche Pas ?

### Problème : La librairie ne s'installe pas.

- Vérifiez votre connexion internet.
- Assurez-vous que Node.js est à jour.
- Essayez `npm cache clean --force` puis réinstallez.

### Problème : Erreur "Module not found".

- Vérifiez que vous avez importé correctement : `import { StepFormBuilder } from '@afrikpay/rn-step-form';`
- Redémarrez Metro : `npx react-native start --reset-cache`

### Problème : Les animations ne marchent pas.

- Assurez-vous que `react-native-reanimated` est bien configuré.
- Suivez le guide officiel pour votre version de React Native.

### Problème : Validation ne marche pas.

- Vérifiez la syntaxe de `validation`.
- Utilisez `resolver` pour Zod si besoin.

### Problème : Champs ne s'affichent pas.

- Vérifiez `showWhen` pour les champs conditionnels.
- Assurez-vous que les noms de champs sont uniques.

Si rien ne marche, regardez les logs d'erreur dans la console et cherchez sur Google ou demandez de l'aide sur GitHub.

## Conclusion

Félicitations ! Vous savez maintenant comment utiliser la librairie `@afrikpay/rn-step-form`. Commencez par des exemples simples, puis ajoutez des fonctionnalités avancées. C'est comme apprendre à cuisiner : commencez par des recettes faciles, puis devenez un chef.

Si vous avez des questions, consultez la documentation officielle ou les exemples dans le dossier `example` du projet.

Bonne création d'apps ! 🚀
