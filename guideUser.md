# Guide d'Utilisation Complet de la Librairie @afrikpay/rn-step-form

Bienvenue dans ce guide complet pour utiliser la librairie `@afrikpay/rn-step-form` ! Imaginez que vous construisez une maison : cette librairie est comme un kit de construction magique qui vous aide à créer des formulaires en plusieurs étapes dans une application mobile React Native. Même si vous n'êtes pas un expert en informatique, suivez les étapes une par une, et vous pourrez intégrer cette librairie facilement. Nous allons tout expliquer avec des mots simples, des analogies et des exemples concrets.

## Qu'est-ce que c'est cette librairie ?

La librairie `@afrikpay/rn-step-form` est un outil super puissant pour créer des formulaires qui se déroulent en plusieurs étapes, comme un questionnaire ou un processus d'inscription. Par exemple, imaginez que vous remplissez un formulaire pour ouvrir un compte bancaire : d'abord vos informations personnelles, puis vos coordonnées, puis la validation. Cette librairie rend cela facile et beau dans une app mobile.

**Nouvelles fonctionnalités magiques :**

- Affichage optionnel de la progression (barre, numéros, compteur)
- Style personnalisé pour les titres
- Validation en temps réel pendant la saisie
- Blocage automatique quand la limite de caractères est atteinte
- Design compact et moderne

Elle utilise des technologies comme React Native (pour les apps mobiles), NativeWind (pour le style), React Hook Form (pour gérer les données) et Zod (pour vérifier que les données sont correctes).

## Prérequis : Ce qu'il faut avant de commencer

Avant d'utiliser cette librairie, vous devez avoir :

- **Un projet React Native** : C'est comme une boîte à outils pour créer des apps mobiles. Si vous n'en avez pas, créez-en un avec `npx react-native init MonProjet`.
- **Node.js et yarn** : Ce sont des outils pour installer des librairies. Téléchargez-les depuis nodejs.org.
- **Les dépendances nécessaires** : La librairie a besoin d'autres outils. Assurez-vous que votre projet a :
  - `react-native-reanimated` (pour les animations fluides)
  - `react-hook-form` (pour gérer les formulaires intelligemment)
  - `@hookform/resolvers` et `zod` (pour la validation)
  - `lucide-react-native` (pour les belles icônes)
  - `nativewind` (pour le style moderne)

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

4. Attendez que l'installation se termine. C'est comme télécharger une app - ça prend quelques secondes.

Voilà ! La librairie est maintenant dans votre projet, prête à créer des formulaires magiques !

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

Pour les animations fluides :

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

## Étape 3 : Utilisation de Base - Créer Votre Premier Formulaire

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

## Étape 4 : Les Nouvelles Fonctionnalités Magiques

### 4.1 Contrôler l'Affichage de la Progression

C'est comme avoir un interrupteur pour chaque élément de progression ! Vous pouvez décider quoi montrer ou cacher pour chaque étape.

#### Exemple : Cacher les numéros d'étapes mais garder la barre de progression

```javascript
{
  title: 'Informations Personnelles',
  showProgressBar: true,    // Garde la barre de progression
  showStepNumbers: false,   // Cache les numéros (1, 2, 3...)
  showStepCount: false,     // Cache le compteur (1/4, 2/4...)
  fields: [
    // ... vos champs
  ],
}
```

#### Exemple : Cacher toute la progression

```javascript
{
  title: 'Étape Simple',
  showProgress: false,      // Cache toute la section de progression
  fields: [
    // ... vos champs
  ],
}
```

#### Exemple : Combiner les options

```javascript
{
  title: 'Étape Moderne',
  showProgressBar: true,    // Barre visible
  showStepNumbers: false,   // Pas de numéros
  showStepCount: true,      // Compteur visible
  fields: [
    // ... vos champs
  ],
}
```

### 4.2 Personnaliser le Style du Titre

Maintenant vous pouvez changer complètement l'apparence du titre de chaque étape ! C'est comme avoir une boîte de crayons de couleur pour votre titre.

#### Exemple : Titre rouge et gras

```javascript
{
  title: 'Étape Importante',
  titleStyle: {
    color: '#EF4444',        // Couleur rouge
    fontWeight: '700',       // Très gras
    fontSize: 20,            // Taille plus grande
    numberOfLines: 1,        // Sur une seule ligne
  },
  fields: [
    // ... vos champs
  ],
}
```

#### Exemple : Titre élégant

```javascript
{
  title: 'Étape Élégante',
  titleStyle: {
    color: '#6366F1',        // Bleu élégant
    fontWeight: '500',       // Moyennement gras
    fontSize: 18,            // Taille moyenne
    numberOfLines: 2,        // Peut aller sur 2 lignes
  },
  fields: [
    // ... vos champs
  ],
}
```

### 4.3 Validation en Temps Réel

La librairie vérifie maintenant les erreurs pendant que vous tapez ! C'est comme avoir un correcteur intelligent qui vous dit en temps réel si vous faites une erreur.

#### Exemple : Validation instantanée

```javascript
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
  // L'erreur apparaît automatiquement pendant la saisie !
}
```

### 4.4 Blocage Automatique de la Saisie

Quand vous atteignez la limite de caractères, la saisie s'arrête automatiquement ! C'est comme un compteur intelligent qui bloque quand vous avez atteint la limite.

#### Exemple : Limite de caractères

```javascript
{
  name: 'code_postal',
  label: 'Code Postal',
  type: 'text',
  validation: {
    required: 'Code postal requis',
    maxLength: {
      value: 5,
      message: '5 chiffres maximum',
    },
  },
  // Après 5 caractères, impossible de taper plus !
}
```

## Étape 5 : Exemples Détaillés avec Nouvelles Fonctionnalités

### Exemple 1 : Formulaire d'Inscription Moderne

Voici un exemple complet avec toutes les nouvelles fonctionnalités :

```javascript
import { StepFormBuilder } from '@afrikpay/rn-step-form';

const steps = [
  {
    title: 'Qui êtes-vous ?',
    titleStyle: {
      color: '#10B981', // Vert moderne
      fontWeight: '600', // Gras
      fontSize: 22, // Grande taille
      numberOfLines: 1,
    },
    showProgressBar: true, // Barre visible
    showStepNumbers: false, // Pas de numéros
    showStepCount: true, // Compteur visible
    fields: [
      {
        name: 'prenom',
        label: 'Prénom',
        type: 'text',
        placeholder: 'Entrez votre prénom',
        validation: {
          required: 'Prénom requis',
          maxLength: {
            value: 20,
            message: '20 caractères maximum',
          },
        },
      },
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        validation: {
          required: 'Nom requis',
          maxLength: {
            value: 25,
            message: '25 caractères maximum',
          },
        },
      },
      {
        name: 'date_naissance',
        label: 'Date de naissance',
        type: 'date',
      },
    ],
  },
  {
    title: 'Vos coordonnées',
    titleStyle: {
      color: '#3B82F6', // Bleu
      fontWeight: '500',
      fontSize: 20,
      numberOfLines: 1,
    },
    showProgressBar: true, // Barre visible
    showStepNumbers: true, // Numéros visibles
    showStepCount: true, // Compteur visible
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
        validation: {
          required: 'Téléphone requis',
          maxLength: {
            value: 10,
            message: '10 chiffres maximum',
          },
        },
      },
    ],
  },
  {
    title: 'Préférences',
    titleStyle: {
      color: '#8B5CF6', // Violet
      fontWeight: '600',
      fontSize: 20,
      numberOfLines: 1,
    },
    showProgressBar: false, // Pas de barre
    showStepNumbers: false, // Pas de numéros
    showStepCount: false, // Pas de compteur (juste le titre)
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
    console.log('Données :', data);
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

### Exemple 2 : Formulaire avec Styles Différents par Étape

```javascript
const steps = [
  {
    // Étape 1 : Style minimaliste
    title: 'Informations de base',
    showProgress: false, // Pas de progression du tout
    titleStyle: {
      color: '#374151', // Gris foncé
      fontWeight: '400', // Normal
      fontSize: 18, // Taille normale
    },
    fields: [
      {
        name: 'nom',
        label: 'Nom',
        type: 'text',
        validation: { required: 'Nom requis' },
      },
    ],
  },
  {
    // Étape 2 : Style complet
    title: 'Coordonnées',
    showProgressBar: true, // Tout visible
    showStepNumbers: true,
    showStepCount: true,
    titleStyle: {
      color: '#DC2626', // Rouge vif
      fontWeight: '700', // Très gras
      fontSize: 24, // Très grand
      numberOfLines: 1,
    },
    fields: [
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validation: {
          required: 'Email requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email invalide',
          },
        },
      },
    ],
  },
];
```

## Étape 6 : Tous les Types de Champs Disponibles

Voici une liste de tous les types de champs que vous pouvez utiliser, avec des exemples :

- **text** : Texte simple. Ex : Nom, Adresse.

  ```javascript
  {
    name: 'nom',
    label: 'Nom',
    type: 'text',
    validation: { required: 'Nom requis' },
  }
  ```

- **email** : Pour les emails, avec validation automatique.

  ```javascript
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    validation: {
      required: 'Email requis',
      pattern: {
        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
        message: 'Email invalide',
      },
    },
  }
  ```

- **password** : Mot de passe caché.

  ```javascript
  {
    name: 'mot_de_passe',
    label: 'Mot de passe',
    type: 'password',
    validation: {
      required: 'Mot de passe requis',
      minLength: {
        value: 8,
        message: '8 caractères minimum',
      },
    },
  }
  ```

- **number** : Nombres. Ex : Âge, Quantité.

  ```javascript
  {
    name: 'age',
    label: 'Âge',
    type: 'number',
    validation: {
      required: 'Âge requis',
      min: {
        value: 18,
        message: 'Vous devez avoir 18 ans',
      },
    },
  }
  ```

- **phone** : Téléphone, avec validation.

  ```javascript
  {
    name: 'telephone',
    label: 'Téléphone',
    type: 'phone',
    validation: { required: 'Téléphone requis' },
  }
  ```

- **multiline** : Texte long, comme une description.

  ```javascript
  {
    name: 'description',
    label: 'Description',
    type: 'multiline',
    placeholder: 'Décrivez-vous...',
    validation: {
      maxLength: {
        value: 500,
        message: '500 caractères maximum',
      },
    },
  }
  ```

- **date** : Sélecteur de date.

  ```javascript
  {
    name: 'date_naissance',
    label: 'Date de naissance',
    type: 'date',
  }
  ```

- **select** : Menu déroulant. Ex : Pays, Catégorie.

  ```javascript
  {
    name: 'pays',
    label: 'Pays',
    type: 'select',
    options: [
      { label: 'France', value: 'FR' },
      { label: 'Belgique', value: 'BE' },
      { label: 'Suisse', value: 'CH' },
    ],
    validation: { required: 'Sélectionnez un pays' },
  }
  ```

- **radio** : Boutons radio pour choisir une option.

  ```javascript
  {
    name: 'sexe',
    label: 'Sexe',
    type: 'radio',
    options: [
      { label: 'Homme', value: 'homme' },
      { label: 'Femme', value: 'femme' },
    ],
    validation: { required: 'Sélectionnez une option' },
  }
  ```

- **switch** : Interrupteur oui/non.

  ```javascript
  {
    name: 'newsletter',
    label: 'Newsletter',
    type: 'switch',
    defaultValue: false,
  }
  ```

- **file** : Télécharger un fichier.
  ```javascript
  {
    name: 'photo',
    label: 'Photo',
    type: 'file',
    validation: { required: 'Photo requise' },
  }
  ```

Pour chaque champ, vous pouvez ajouter :

- `label` : Le texte affiché.
- `placeholder` : Texte d'exemple.
- `validation` : Règles comme "requis" ou "longueur minimale".
- `defaultValue` : Valeur par défaut.
- `disabled` : Désactiver le champ.
- `showWhen` : Condition pour afficher le champ.

## Étape 7 : Propriétés Avancées du StepFormBuilder

Voici les principales propriétés (props) que vous pouvez utiliser :

### Propriétés Principales

- **steps** : La liste des étapes (obligatoire).
- **onSubmit** : Fonction appelée quand le formulaire est soumis (obligatoire).
- **onError** : Fonction pour gérer les erreurs.
- **defaultValues** : Valeurs par défaut pour les champs.
- **nextLabel** : Texte du bouton "Suivant" (par défaut "Suivant").
- **backLabel** : Texte du bouton "Retour" (par défaut "Retour").
- **submitLabel** : Texte du bouton "Valider" (par défaut "Valider").
- **resolver** : Pour une validation personnalisée avec Zod.

### Nouvelles Propriétés des Étapes

Pour chaque étape, vous pouvez maintenant utiliser :

- **showProgress** : `true/false` - Afficher/cacher toute la section de progression.
- **showProgressBar** : `true/false` - Afficher/cacher la barre de progression.
- **showStepNumbers** : `true/false` - Afficher/cacher les numéros d'étapes (1, 2, 3...).
- **showStepCount** : `true/false` - Afficher/cacher le compteur (1/4, 2/4...).
- **titleStyle** : Objet pour personnaliser le style du titre :
  - `fontSize` : Taille de la police
  - `fontWeight` : Poids (normal, bold, 100-900)
  - `color` : Couleur du texte
  - `numberOfLines` : Nombre de lignes maximum

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

## Étape 8 : Gérer les Données et les Actions

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

### Étapes Personnalisées

Pour des étapes plus complexes, comme choisir un paiement :

```javascript
{
  title: 'Choisir le Paiement',
  type: 'custom',
  titleStyle: {
    color: '#F59E0B',        // Orange
    fontWeight: '600',
    fontSize: 22,
  },
  showProgressBar: false,    // Pas de barre pour cette étape
  render: (data, goToNext, goToPrev) => (
    <View>
      <Text>Sélectionnez votre méthode de paiement :</Text>
      {/* Ici, ajoutez vos boutons ou composants personnalisés */}
      <Button title="Carte de Crédit" onPress={goToNext} />
    </View>
  ),
}
```

## Étape 9 : Personnaliser le Style

La librairie utilise NativeWind pour le style. Vous pouvez personnaliser les couleurs, tailles, etc., en modifiant les classes CSS.

Par exemple, pour changer les couleurs, modifiez le fichier `tokens.ts` ou ajoutez des styles personnalisés.

### Personnaliser les couleurs de progression

```javascript
// Dans votre composant
import { colors } from '@afrikpay/rn-step-form/tokens';

// Les couleurs disponibles :
// colors.primary700 - Bleu principal
// colors.success600 - Vert de succès
// colors.neutral200 - Gris clair
// colors.neutral300 - Gris moyen
// colors.neutral500 - Gris foncé
// colors.neutral900 - Noir
// colors.white - Blanc
```

## Étape 10 : Combiner Toutes les Fonctionnalités

Voici un exemple complet qui combine toutes les nouvelles fonctionnalités :

```javascript
const steps = [
  {
    // Étape 1 : Style moderne avec validation en temps réel
    title: 'Informations Personnelles',
    titleStyle: {
      color: '#10B981',
      fontWeight: '600',
      fontSize: 22,
      numberOfLines: 1,
    },
    showProgressBar: true,
    showStepNumbers: false,
    showStepCount: false,
    fields: [
      {
        name: 'nom',
        label: 'Nom complet',
        type: 'text',
        placeholder: 'Entrez votre nom',
        validation: {
          required: 'Nom requis',
          maxLength: {
            value: 30,
            message: '30 caractères maximum',
          },
        },
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validation: {
          required: 'Email requis',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Email invalide',
          },
        },
      },
    ],
  },
  {
    // Étape 2 : Style complet avec tous les éléments
    title: 'Préférences',
    titleStyle: {
      color: '#3B82F6',
      fontWeight: '700',
      fontSize: 24,
      numberOfLines: 1,
    },
    showProgressBar: true,
    showStepNumbers: true,
    showStepCount: true,
    fields: [
      {
        name: 'interets',
        label: "Centres d'intérêt",
        type: 'select',
        options: [
          { label: 'Sport', value: 'sport' },
          { label: 'Musique', value: 'musique' },
          { label: 'Lecture', value: 'lecture' },
          { label: 'Voyage', value: 'voyage' },
        ],
        validation: { required: 'Sélectionnez un intérêt' },
      },
      {
        name: 'newsletter',
        label: 'Recevoir la newsletter',
        type: 'switch',
        defaultValue: true,
      },
    ],
  },
  {
    // Étape 3 : Style minimaliste
    title: 'Confirmation',
    titleStyle: {
      color: '#6B7280',
      fontWeight: '400',
      fontSize: 18,
      numberOfLines: 2,
    },
    showProgress: false, // Juste le titre
    type: 'custom',
    render: (data, goToNext, goToPrev) => (
      <View>
        <Text>Vérifiez vos informations :</Text>
        <Text>Nom : {data.nom}</Text>
        <Text>Email : {data.email}</Text>
        <Button title="Confirmer" onPress={goToNext} />
      </View>
    ),
  },
];

export default function FormulaireComplet() {
  return (
    <StepFormBuilder
      steps={steps}
      onSubmit={(data) => {
        console.log('Formulaire soumis :', data);
        // Envoyer au serveur
      }}
      nextLabel="Continuer"
      backLabel="Modifier"
      submitLabel="Valider"
    />
  );
}
```

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

### Problème : Les styles personnalisés ne s'appliquent pas.

- Vérifiez que `titleStyle` est un objet valide.
- Assurez-vous que les couleurs sont au bon format (`#RRGGBB`).

### Problème : La progression ne s'affiche pas.

- Vérifiez que `showProgress` est `true` (ou non défini).
- Assurez-vous que `showProgressBar`, `showStepNumbers`, et `showStepCount` ne sont pas tous `false`.

### Problème : La validation en temps réel ne marche pas.

- La validation en temps réel est automatique avec cette version.
- Si vous ne voyez pas les erreurs, vérifiez votre configuration `react-hook-form`.

Si rien ne marche, regardez les logs d'erreur dans la console et cherchez sur Google ou demandez de l'aide sur GitHub.

## Conclusion

Félicitations ! Vous savez maintenant comment utiliser toutes les fonctionnalités magiques de la librairie `@afrikpay/rn-step-form`. Vous pouvez :

- Créer des formulaires en plusieurs étapes
- Personnaliser l'affichage de la progression
- Changer le style des titres
- Valider les données en temps réel
- Bloquer automatiquement la saisie
- Créer des expériences utilisateur uniques

Commencez par des exemples simples, puis ajoutez des fonctionnalités avancées. C'est comme apprendre à cuisiner : commencez par des recettes faciles, puis devenez un chef étoilé !

Si vous avez des questions, consultez la documentation officielle ou les exemples dans le dossier `example` du projet.

Bonne création d'apps magiques !

---

**Récapitulatif rapide des nouvelles fonctionnalités :**

1. **Progression optionnelle** : `showProgress`, `showProgressBar`, `showStepNumbers`, `showStepCount`
2. **Style de titre personnalisé** : `titleStyle` avec `fontSize`, `fontWeight`, `color`, `numberOfLines`
3. **Validation en temps réel** : Automatic pendant la saisie
4. **Blocage automatique** : Quand `maxLength` est atteint
5. **Design compact** : Espaces optimisés automatiquement

Vous êtes maintenant un expert du StepForm !

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
