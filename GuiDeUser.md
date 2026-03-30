# Guide Utilisateur - AfrikPay Step Form

## Table des matières

1. [Analyse Globale du Projet](#analyse-globale-du-projet)
2. [Description Fonctionnelle](#description-fonctionnelle)
3. [Documentation Technique](#documentation-technique)
4. [Comment Utiliser le Système](#comment-utiliser-le-système)
5. [Bonnes Pratiques](#bonnes-pratiques)
6. [Exemples Concrets](#exemples-concrets)
7. [Améliorations Possibles](#améliorations-possibles)

---

## Analyse Globale du Projet

### 🎯 Objectif Principal

**AfrikPay Step Form** est une librairie React Native TypeScript qui permet de créer des formulaires multi-étapes complexes avec une gestion avancée de la validation, des conditions d'affichage dynamiques et des types de champs variés.

### 📋 Cas d'Usage Typiques

- **Formulaires d'inscription** : Processus d'onboarding en plusieurs étapes
- **Formulaires de paiement** : Collecte d'informations financières sécurisées
- **Enquêtes complexes** : Questionnaires avec affichage conditionnel
- **Processus administratifs** : Déclarations avec documents et validations

### 🛠 Technologies Utilisées

- **React Native** : Framework de développement mobile cross-platform
- **TypeScript** : Typage fort pour une meilleure maintenabilité
- **React Hook Form** : Gestion performante des formulaires
- **React Native Paper** : Composants UI Material Design
- **Expo** : Écosystème de développement React Native

### 🏗 Architecture Globale

```
src/
├── components/
│   ├── StepFormBuilder.tsx     # Cœur du système (orchestrateur)
│   ├── StepFormField.tsx       # Router de composants de champs
│   ├── StepFormHeader.tsx      # Navigation visuelle
│   ├── StepFormProgress.tsx    # Barre de progression
│   ├── PaymentSelector.tsx     # Composant de paiement
│   └── fields/                 # Composants spécialisés
│       ├── SelectField.tsx     # Sélection avec bottom sheet
│       ├── RadioField.tsx      # Boutons radio
│       ├── FileField.tsx       # Upload de documents
│       ├── DateField.tsx       # Sélecteur de dates
│       └── SwitchField.tsx     # Interrupteurs
├── types.ts                    # Définitions TypeScript
└── index.tsx                   # Point d'entrée
```

---

## Description Fonctionnelle

### 🔄 Parcours Utilisateur Type

1. **Initialisation** : L'utilisateur lance l'application et voit la première étape du formulaire
2. **Saisie** : Il remplit les champs selon leur type (texte, sélection, date, etc.)
3. **Validation** : Le système vérifie en temps réel la validité des données
4. **Navigation** : Boutons "Précédent"/"Suivant" pour naviguer entre étapes
5. **Conditions** : Certains champs s'affichent/masquent selon les réponses précédentes
6. **Soumission** : À la fin, toutes les données sont collectées et envoyées

### 📱 Scénarios Concrets

#### Scénario 1 : Formulaire d'Inscription

```
Étape 1: Informations personnelles (nom, email, téléphone)
Étape 2: Adresse (pays, ville, région si Cameroun)
Étape 3: Préférences (newsletter, notifications)
Étape 4: Vérification (upload document d'identité)
```

#### Scénario 2 : Processus de Paiement

```
Étape 1: Sélection du service
Étape 2: Informations de facturation
Étape 3: Moyen de paiement (Orange Money, MTN, AfrikPay)
Étape 4: Confirmation et validation
```

---

## Documentation Technique

### 🧩 StepFormBuilder

**Rôle** : Orchestrateur principal qui gère le flux du formulaire multi-étapes.

**Fonctionnement** :

- Maintient l'état de l'étape courante
- Gère la navigation entre étapes avec animations
- Coordonne la validation et la soumission
- Applique les conditions d'affichage dynamiques

**Props principales** :

```typescript
interface StepFormBuilderProps {
  steps: FormStep[]; // Configuration des étapes
  onSubmit: (data: FormData) => void | Promise<void>; // Callback final
  onError?: (errors: Record<string, any>) => void; // Gestion erreurs
  defaultValues?: FormData; // Valeurs par défaut
  externalValues?: FormData; // Valeurs externes injectées
}
```

**Gestion des étapes** :

- Chaque étape a son propre cycle de vie
- Validation avant passage à l'étape suivante
- Support des étapes personnalisées (`type: 'custom'`)
- Animation de transition fluide

### 🧱 StepFormField

**Rôle** : Composant router qui sélectionne le bon composant de champ selon le type.

**Logique interne** :

```typescript
// Route vers le bon composant selon field.type
switch (type) {
  case 'select': return <SelectField />;
  case 'radio': return <RadioField />;
  case 'file': return <FileField />;
  case 'date': return <DateField />;
  case 'switch': return <SwitchField />;
  default: return <TextInput />;
}
```

**Intégration React Hook Form** :

- Utilise `Controller` pour la gestion du state
- Applique les règles de validation
- Gère les erreurs et l'état disabled

### 📦 Composants Fields

#### SelectField

**Description** : Champ de sélection avec bottom sheet animé.

**Props** :

```typescript
{
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (val: string) => void;
  error?: boolean;
  disabled?: boolean;
  placeholder?: string;
}
```

**Exemple d'utilisation** :

```typescript
{
  name: "country",
  label: "Pays",
  type: "select",
  options: [
    { label: "Cameroun", value: "CM" },
    { label: "France", value: "FR" }
  ]
}
```

#### RadioField

**Description** : Groupe de boutons radio pour choix unique.

**Props** :

```typescript
{
  label: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (val: string) => void;
  disabled?: boolean;
}
```

**Exemple** :

```typescript
{
  name: "gender",
  label: "Sexe",
  type: "radio",
  options: [
    { label: "Masculin", value: "M" },
    { label: "Féminin", value: "F" }
  ]
}
```

#### FileField

**Description** : Upload de documents avec support multiple formats.

**Formats supportés** :

- Images : `image/*`
- PDF : `application/pdf`
- Word : `.doc`, `.docx`
- Texte : `text/plain`

**Exemple** :

```typescript
{
  name: "id_document",
  label: "Document d'identité",
  type: "file"
}
```

#### DateField

**Description** : Sélecteur de dates natif avec formatage français.

**Exemple** :

```typescript
{
  name: "birthDate",
  label: "Date de naissance",
  type: "date"
}
```

#### SwitchField

**Description** : Interrupteur pour options binaires.

**Exemple** :

```typescript
{
  name: "newsletter",
  label: "Recevoir la newsletter",
  type: "switch"
}
```

---

## Comment Utiliser le Système

### 🔹 Définir un Champ

**Structure de base** :

```typescript
{
  name: "email",                    // Identifiant unique
  label: "Email",                   // Label affiché
  type: "email",                    // Type de champ
  placeholder: "votre@email.com",   // Texte indicatif
  validation: {                     // Règles de validation
    required: {
      value: true,
      message: "Email requis"
    },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email invalide"
    }
  }
}
```

### 🔹 Types de Champs Disponibles

| Type        | Description                 | Props spécifiques                 |
| ----------- | --------------------------- | --------------------------------- |
| `text`      | Champ texte simple          | `maxLength`, `placeholder`        |
| `email`     | Champ email avec validation | `autoComplete: 'email'`           |
| `password`  | Champ mot de passe          | `secureTextEntry` automatique     |
| `number`    | Champ numérique             | Filtrage automatique des chiffres |
| `phone`     | Champ téléphone             | Clavier numérique                 |
| `select`    | Liste déroulante            | `options[]` requis                |
| `radio`     | Boutons radio               | `options[]` requis                |
| `checkbox`  | Case à cocher               | Label + status                    |
| `date`      | Sélecteur de date           | Formatage automatique             |
| `switch`    | Interrupteur                | Valeur booléenne                  |
| `file`      | Upload fichier              | Support multiples formats         |
| `multiline` | Zone de texte               | `numberOfLines: 4`                |

### 🔹 Exemple Complet de Formulaire

```typescript
const steps = [
  {
    title: "Informations Personnelles",
    fields: [
      {
        name: "firstName",
        label: "Prénom",
        type: "text",
        validation: {
          required: { value: true, message: "Prénom requis" },
          minLength: { value: 2, message: "2 caractères minimum" }
        }
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        validation: {
          required: { value: true, message: "Email requis" }
        }
      },
      {
        name: "birthDate",
        label: "Date de naissance",
        type: "date",
        validation: {
          required: { value: true, message: "Date requise" }
        }
      }
    ],
    isNextDisabled: (values) => !values.firstName || !values.email
  },
  {
    title: "Adresse",
    fields: [
      {
        name: "country",
        label: "Pays",
        type: "select",
        options: [
          { label: "Cameroun", value: "CM" },
          { label: "France", value: "FR" }
        ],
        validation: {
          required: { value: true, message: "Pays requis" }
        }
      },
      {
        name: "region",
        label: "Région",
        type: "select",
        options: [
          { label: "Douala", value: "DO" },
          { label: "Yaoundé", value: "YA" }
        ],
        showWhen: { field: "country", value: "CM" }, // Condition d'affichage
        validation: {
          required: { value: true, message: "Région requise" }
        }
      }
    ]
  }
];

// Utilisation
<StepFormBuilder
  steps={steps}
  onSubmit={(data) => console.log("Formulaire soumis :", data)}
  defaultValues={{ firstName: "Jean" }}
/>
```

### 🔹 Conditions d'Affichage (TRÈS IMPORTANT)

**Principe** : Utiliser `showWhen` pour afficher/masquer dynamiquement des champs.

**Syntaxe** :

```typescript
{
  name: "spouseName",
  label: "Nom du conjoint",
  type: "text",
  showWhen: {
    field: "maritalStatus",    // Champ qui déclenche la condition
    value: "married"          // Valeur qui déclenche l'affichage
  },
  validation: {
    required: { value: true, message: "Nom du conjoint requis" }
  }
}
```

**Exemples concrets** :

1. **Condition simple** :

```typescript
// Afficher le champ "region" seulement si country = "CM"
showWhen: { field: "country", value: "CM" }
```

2. **Condition avec fonction** :

```typescript
// Afficher si l'utilisateur est majeur
showWhen: {
  field: "birthDate",
  condition: (date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }
}
```

3. **Conditions multiples** :

```typescript
// Afficher si marié ET travaillant
showWhen: {
  field: "maritalStatus",
  value: "married"
},
// Dans le composant, combiner avec watchedValues
editable: (values) => values.maritalStatus === "married" && values.hasJob
```

---

## Bonnes Pratiques

### 📋 Structuration des Champs

1. **Nommage cohérent** : Utiliser `camelCase` pour les noms de champs
2. **Labels clairs** : Éviter les abréviations, être explicite
3. **Validation progressive** : Valider au fur et à mesure, pas tout à la fin
4. **Regroupement logique** : Rassembler les champs par thématique

```typescript
// ✅ Bon exemple
{
  name: "emergencyContactPhone",
  label: "Téléphone contact d'urgence",
  type: "phone",
  validation: {
    required: { value: true, message: "Téléphone d'urgence requis" },
    minLength: { value: 9, message: "9 chiffres minimum" }
  }
}

// ❌ Éviter
{
  name: "tel_urg",
  label: "Tel",
  type: "phone"
}
```

### ➕ Ajouter un Nouveau Type de Champ

1. **Créer le composant** dans `src/components/fields/`
2. **Exporter** depuis `src/components/fields/index.ts`
3. **Ajouter le type** dans `src/types.ts`
4. **Intégrer** dans `StepFormField.tsx`

**Exemple - Ajout d'un champ ColorPicker** :

```typescript
// 1. Créer ColorField.tsx
export function ColorField({ label, value, onChange, disabled }) {
  return (
    <TouchableOpacity onPress={() => openColorPicker()}>
      <View style={{ backgroundColor: value, height: 40 }} />
    </TouchableOpacity>
  );
}

// 2. Exporter depuis index.ts
export { ColorField } from './ColorField';

// 3. Ajouter dans types.ts
export type FieldType =
  | 'text' | 'email' | 'password' | 'number' | 'phone'
  | 'select' | 'checkbox' | 'date' | 'switch' | 'multiline'
  | 'radio' | 'file' | 'color'; // Nouveau type

// 4. Intégrer dans StepFormField.tsx
} else if (type === 'color') {
  return <ColorField {...props} />;
```

### ⚠️ Éviter les Erreurs Courantes

1. **Conflit de noms** : Deux champs avec le même `name`
2. **Validation oubliée** : Champs requis sans validation
3. **Options vides** : Select/radio sans `options`
4. **Conditions circulaires** : `showWhen` qui crée des dépendances infinies

```typescript
// ❌ Erreur : Conflit de noms
fields: [
  { name: "email", type: "text" },
  { name: "email", type: "email" } // Conflit !
]

// ❌ Erreur : Options vides
{
  name: "country",
  type: "select",
  options: [] // Toujours vide !
}

// ✅ Correction
{
  name: "country",
  type: "select",
  options: [
    { label: "Cameroun", value: "CM" },
    { label: "France", value: "FR" }
  ]
}
```

---

## Exemples Concrets

### 📝 Formulaire Simple (Contact)

```typescript
const contactForm = [
  {
    title: 'Contact',
    fields: [
      {
        name: 'name',
        label: 'Nom complet',
        type: 'text',
        validation: {
          required: { value: true, message: 'Nom requis' },
          minLength: { value: 3, message: '3 caractères minimum' },
        },
      },
      {
        name: 'email',
        label: 'Email',
        type: 'email',
        validation: {
          required: { value: true, message: 'Email requis' },
        },
      },
      {
        name: 'message',
        label: 'Message',
        type: 'multiline',
        validation: {
          required: { value: true, message: 'Message requis' },
          minLength: { value: 10, message: '10 caractères minimum' },
        },
      },
    ],
  },
];
```

### 🏢 Formulaire Avancé (Inscription Employé)

```typescript
const employeeForm = [
  {
    title: 'Informations Personnelles',
    fields: [
      {
        name: 'firstName',
        label: 'Prénom',
        type: 'text',
        validation: { required: true },
      },
      {
        name: 'lastName',
        label: 'Nom',
        type: 'text',
        validation: { required: true },
      },
      {
        name: 'birthDate',
        label: 'Date de naissance',
        type: 'date',
        validation: { required: true },
      },
      {
        name: 'nationality',
        label: 'Nationalité',
        type: 'select',
        options: [
          { label: 'Camerounaise', value: 'CM' },
          { label: 'Française', value: 'FR' },
          { label: 'Autre', value: 'OTHER' },
        ],
        validation: { required: true },
      },
    ],
  },
  {
    title: 'Coordonnées',
    fields: [
      {
        name: 'email',
        label: 'Email professionnel',
        type: 'email',
        validation: { required: true },
      },
      {
        name: 'phone',
        label: 'Téléphone',
        type: 'phone',
        validation: {
          required: true,
          minLength: { value: 9, message: '9 chiffres minimum' },
        },
      },
      {
        name: 'address',
        label: 'Adresse',
        type: 'multiline',
        validation: { required: true },
      },
    ],
  },
  {
    title: 'Documents',
    fields: [
      {
        name: 'cv',
        label: 'CV (PDF)',
        type: 'file',
        validation: { required: true },
      },
      {
        name: 'coverLetter',
        label: 'Lettre de motivation',
        type: 'file',
      },
      {
        name: 'idDocument',
        label: "Pièce d'identité",
        type: 'file',
        validation: { required: true },
      },
    ],
  },
];
```

### 🎯 Formulaire avec Conditions (Assurance)

```typescript
const insuranceForm = [
  {
    title: 'Informations de base',
    fields: [
      {
        name: 'hasInsurance',
        label: 'Avez-vous déjà une assurance ?',
        type: 'radio',
        options: [
          { label: 'Oui', value: 'yes' },
          { label: 'Non', value: 'no' },
        ],
        validation: { required: true },
      },
      {
        name: 'currentInsurer',
        label: 'Assureur actuel',
        type: 'text',
        showWhen: { field: 'hasInsurance', value: 'yes' },
        validation: {
          required: {
            value: true,
            message: 'Assureur requis si vous êtes assuré',
          },
        },
      },
      {
        name: 'insuranceType',
        label: "Type d'assurance souhaitée",
        type: 'select',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Habitation', value: 'home' },
          { label: 'Santé', value: 'health' },
          { label: 'Vie', value: 'life' },
        ],
        validation: { required: true },
      },
    ],
  },
  {
    title: 'Détails du véhicule',
    fields: [
      {
        name: 'vehicleType',
        label: 'Type de véhicule',
        type: 'select',
        options: [
          { label: 'Voiture', value: 'car' },
          { label: 'Moto', value: 'motorcycle' },
          { label: 'Camion', value: 'truck' },
        ],
        showWhen: { field: 'insuranceType', value: 'auto' },
        validation: {
          required: { value: true, message: 'Type de véhicule requis' },
        },
      },
      {
        name: 'vehicleYear',
        label: 'Année du véhicule',
        type: 'number',
        showWhen: { field: 'insuranceType', value: 'auto' },
        validation: {
          required: true,
          min: { value: 1900, message: 'Année invalide' },
          max: {
            value: new Date().getFullYear(),
            message: 'Année future non autorisée',
          },
        },
      },
    ],
  },
];
```

---

## Améliorations Possibles

### 🚀 Évolutions Techniques

1. **Performance** : Mémoisation des composants pour éviter les re-rendus
2. **Internationalisation** : Support multi-langues avec i18n
3. **Thématisation** : Système de thèmes personnalisables
4. **Accessibilité** : Amélioration du support screen readers
5. **Tests** : Suite de tests unitaires et d'intégration

### 📈 Fonctionnalités à Ajouter

1. **Auto-save** : Sauvegarde automatique du progrès
2. **Import/Export** : Importer des données depuis JSON/CSV
3. **Signature** : Champ signature manuscrite
4. **Geolocalisation** : Champ avec position GPS
5. **Multi-forms** : Gestion de plusieurs formulaires simultanément

### 🏗️ Points Faibles de l'Architecture

1. **Couplage fort** : StepFormField connaît tous les types de champs
2. **Validation centralisée** : Toute la logique est dans les définitions de champs
3. **Performance** : Re-rendu complet à chaque changement
4. **Extensibilité** : Ajouter un type de champ nécessite plusieurs modifications

### 💡 Recommandations

1. **Utiliser un pattern Strategy** pour les types de champs
2. **Implémenter un système de plugins** pour les extensions
3. **Séparer la logique de validation** dans un service dédié
4. **Ajouter un système de cache** pour les performances
5. **Documenter les APIs** avec OpenAPI/Swagger

---

## Conclusion

**AfrikPay Step Form** est une solution robuste et flexible pour créer des formulaires multi-étapes dans React Native. Son architecture modulaire et son système de conditions dynamiques en font un outil puissant pour les applications nécessitant une collecte de données complexe.

Les points forts :

- ✅ Facilité d'utilisation
- ✅ Types de champs variés
- ✅ Conditions dynamiques
- ✅ Validation intégrée
- ✅ TypeScript natif

Les points à améliorer :

- ⚠️ Performance sur gros formulaires
- ⚠️ Extensibilité limitée
- ⚠️ Documentation technique à enrichir

Cette librairie est idéale pour les projets React Native nécessitant des formulaires complexes avec une bonne expérience utilisateur.
