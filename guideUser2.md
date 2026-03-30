# 📘 Guide Utilisateur — `afrikpay-com-rn-step-form`

> **Version analysée :** code source du 30 mars 2026  
> **Technologie :** React Native · TypeScript · React Hook Form · React Native Paper

---

## Table des matières

1. [Présentation de l'application](#1-présentation-de-lapplication)
2. [Guide d'utilisation — Parcours utilisateur](#2-guide-dutilisation--parcours-utilisateur)
3. [Architecture des composants](#3-architecture-des-composants)
4. [Utilisation du composant principal](#4-utilisation-du-composant-principal)
5. [Configuration des champs (`FormField`)](#5-configuration-des-champs-formfield)
6. [Référence par type de champ](#6-référence-par-type-de-champ)
7. [Logique de validation](#7-logique-de-validation)
8. [Logique conditionnelle (`showWhen` / `editable`)](#8-logique-conditionnelle-showwhen--editable)
9. [Étapes personnalisées (`type: 'custom'`)](#9-étapes-personnalisées-type-custom)
10. [Exemple complet de configuration](#10-exemple-complet-de-configuration)

---

## 1. Présentation de l'application

### Quoi ?

`afrikpay-com-rn-step-form` est une **bibliothèque React Native** qui permet de construire des formulaires multi-étapes (wizard) en déclarant simplement un tableau de configuration JSON/TypeScript. Elle gère automatiquement :

- La **navigation entre les étapes** (Suivant / Back / Valider)
- La **validation des champs** à chaque étape (via React Hook Form)
- L'**affichage conditionnel** de champs selon d'autres valeurs du formulaire
- Le rendu de **différents types de champs** (texte, date, fichier, sélection, radio, bascule…)
- Les **animations de transition** entre étapes
- L'**évitement du clavier** sur iOS et Android

### Pourquoi ?

Dans les applications mobiles complexes (onboarding, souscription, KYC, paiement…), les formulaires à plusieurs étapes sont omniprésents. Cette bibliothèque supprime la nécessité de recoder chaque fois la logique de navigation, de validation et d'état — il suffit de **décrire** le formulaire sous forme de données.

---

## 2. Guide d'utilisation — Parcours utilisateur

### Exemple concret : Inscription à un service financier

Imaginons un flux d'inscription en 3 étapes.

#### Étape 1 — Informations personnelles

L'utilisateur voit un formulaire avec les champs **Prénom**, **Nom** et **Date de naissance**.

- Il remplit les champs texte directement dans des inputs stylisés (mode `outlined` de React Native Paper).
- Pour la date, il appuie sur le champ et un **sélecteur de date natif** s'ouvre (DateTimePicker).
- En bas de l'écran, le bouton **« Suivant »** est visible.
- Si un champ obligatoire est vide ou invalide, le bouton reste actif mais la validation s'affiche au clic, bloquant le passage à l'étape suivante.
- Une barre de progression animée en haut indique l'avancement (Step 1 of 3).

#### Étape 2 — Coordonnées & Pièce d'identité

- L'utilisateur remplit son **numéro de téléphone** (le clavier numérique s'ouvre automatiquement).
- Il sélectionne sa **nationalité** depuis un **bottom sheet** animé (liste déroulante native).
- Il choisit le **type de pièce** (CNI / Passeport) via des **boutons radio**.
- Si « Marié(e) » est coché, un champ **« Nom du conjoint »** apparaît dynamiquement.
- Il télécharge sa **pièce d'identité** depuis l'outil de sélection de documents (PDF, image…).

#### Étape 3 — Confirmation

- Un écran personnalisé (type `custom`) récapitule toutes les informations saisies.
- L'utilisateur appuie sur **« Valider »** pour soumettre le formulaire.
- Le callback `onSubmit` reçoit l'objet complet de toutes les données du formulaire.

---

## 3. Architecture des composants

```
src/
├── index.tsx                   ← Point d'entrée public (exporte StepFormBuilder)
├── types.ts                    ← Tous les types TypeScript
└── components/
    ├── StepFormBuilder.tsx     ← Composant racine : orchestre tout le formulaire
    ├── StepFormField.tsx       ← Dispatch vers le bon composant selon le type
    ├── StepFormHeader.tsx      ← Rend le header personnalisé d'une étape
    ├── StepFormProgress.tsx    ← Barre de progression animée + dots
    └── fields/
        ├── DateField.tsx       ← Sélecteur de date natif (DateTimePicker)
        ├── FileField.tsx       ← Sélection de document (expo-document-picker)
        ├── RadioField.tsx      ← Groupe de boutons radio
        ├── SelectField.tsx     ← Dropdown bottom sheet animé
        ├── SwitchField.tsx     ← Toggle bascule
        └── index.ts            ← Barrel export des champs
```

### `StepFormBuilder`

**Rôle :** Chef d'orchestre. C'est le seul composant que l'intégrateur utilise directement.  
**Responsabilités :**

- Gère l'état courant de l'étape (`currentStep`), l'état de traitement (`isProcessing`)
- Instancie `useForm` de React Hook Form avec les `defaultValues`
- Synchronise les `externalValues` via `setValue` (pour pré-remplissage externe)
- Gère les animations de transition (fade-out / fade-in via `Animated.Value`)
- Applique la logique `showWhen` pour filtrer les champs visibles avant la validation
- Appelle le callback `onStepComplete` (opération asynchrone) avant de passer à l'étape suivante
- Gère la position des boutons : `center`, `bottom`, `bottom-raised`
- Contient le sous-composant interne `ButtonsRow` (Précédent / Suivant / Valider)

### `StepFormField`

**Rôle :** Intermédiaire de rendu. Reçoit la config d'un champ et rend le bon composant.  
**Responsabilités :**

- Wrappé dans un `Controller` de React Hook Form
- Détecte le `type` du champ et dispatche vers : `SelectField`, `RadioField`, `SwitchField`, `FileField`, `DateField`, ou `TextInput`
- Pour les champs texte : gère le `keyboardType`, le mode `secureTextEntry` (password), le `multiline`, et le filtrage numérique
- Affiche un compteur de caractères dans le label si `maxLength` est défini (`"Prénom (3/50)"`)
- Affiche les messages d'erreur via `HelperText` de React Native Paper

### `StepFormHeader`

**Rôle :** Rend le header personnalisé de l'étape courante.  
Il appelle simplement `steps[currentStep]?.header?.(data)` — délégant entièrement le rendu à la configuration de l'étape.

### `StepFormProgress`

**Rôle :** Affiche la progression visuelle du formulaire.

- Barre de progression animée (spring animation via `react-native-reanimated`)
- Indicateurs dots pour chaque étape
- Titre et description de l'étape courante

### Composants `fields/`

| Composant     | Type(s) géré(s) | Librairie utilisée                                  |
| ------------- | --------------- | --------------------------------------------------- |
| `DateField`   | `date`          | `@react-native-community/datetimepicker`            |
| `FileField`   | `file`          | `expo-document-picker`                              |
| `RadioField`  | `radio`         | `react-native-paper` (RadioButton)                  |
| `SelectField` | `select`        | React Native Modal + Animated (bottom sheet custom) |
| `SwitchField` | `switch`        | `react-native-paper` (Switch)                       |

---

## 4. Utilisation du composant principal

### Installation

```bash
npm install afrikpay-com-rn-step-form
# dépendances pair requises :
npm install react-hook-form react-native-paper @react-native-community/datetimepicker \
  expo-document-picker @expo/vector-icons react-native-reanimated
```

### Import et utilisation de base

```tsx
import { StepFormBuilder } from 'afrikpay-com-rn-step-form';
import type { FormStep } from 'afrikpay-com-rn-step-form';

const steps: FormStep[] = [
  {
    title: 'Étape 1',
    description: 'Vos informations personnelles',
    fields: [
      {
        name: 'firstName',
        label: 'Prénom',
        type: 'text',
        validation: { required: 'Champs requis' },
      },
    ],
  },
];

export default function MyFormScreen() {
  const handleSubmit = (data: Record<string, any>) => {
    console.log('Données soumises :', data);
  };

  return (
    <StepFormBuilder
      steps={steps}
      onSubmit={handleSubmit}
      onError={(errors) => console.warn('Erreurs :', errors)}
      defaultValues={{ firstName: 'Jean' }}
    />
  );
}
```

### Props de `StepFormBuilder`

| Prop                    | Type                                        | Requis | Description                                                          |
| ----------------------- | ------------------------------------------- | ------ | -------------------------------------------------------------------- |
| `steps`                 | `FormStep[]`                                | ✅     | Tableau de configuration des étapes                                  |
| `onSubmit`              | `(data: FormData) => void \| Promise<void>` | ✅     | Callback appelé à la soumission finale                               |
| `onError`               | `(errors: Record<string, any>) => void`     | ❌     | Callback d'erreur (validation ou étape)                              |
| `defaultValues`         | `FormData`                                  | ❌     | Valeurs initiales des champs                                         |
| `externalValues`        | `FormData`                                  | ❌     | Valeurs injectées depuis l'extérieur (synchronisées via `useEffect`) |
| `onExternalValueChange` | `(name: string, value: any) => void`        | ❌     | Callback lors du changement d'une valeur externe                     |

---

## 5. Configuration des champs (`FormField`)

Chaque champ est décrit par un objet de type `FormField` :

```typescript
type FormField = {
  name: string; // identifiant unique (clé dans FormData)
  label: string; // libellé affiché
  type: FieldType; // voir section 6
  placeholder?: string; // texte indicatif
  defaultValue?: string | number | boolean | Date;
  maxLength?: number; // limite de caractères (affiche un compteur)
  validation?: ValidationRule; // règles React Hook Form
  disabled?: boolean; // désactive le champ
  leftIcon?: () => React.ReactNode; // icône à gauche (TextInput uniquement)
  rightIcon?: () => React.ReactNode; // icône à droite (TextInput uniquement)
  options?: Array<{ label: string; value: string }>; // pour select et radio
  inputProps?: Partial<TextInputProps>; // props supplémentaires (react-native-paper)
  editable?: (formValues: Record<string, any>) => boolean; // accessibilité dynamique
  showWhen?: {
    // affichage conditionnel
    field: string;
    value?: any;
    condition?: (value: any) => boolean;
  };
};
```

### Propriétés communes à tous les types

| Propriété      | Type                                  | Description                                                    |
| -------------- | ------------------------------------- | -------------------------------------------------------------- |
| `name`         | `string`                              | **Obligatoire.** Clé unique dans l'objet de données final.     |
| `label`        | `string`                              | **Obligatoire.** Libellé affiché dans ou au-dessus du champ.   |
| `type`         | `FieldType`                           | **Obligatoire.** Détermine le composant rendu.                 |
| `validation`   | `ValidationRule`                      | Règles de validation React Hook Form.                          |
| `disabled`     | `boolean`                             | Si `true`, le champ est affiché mais non modifiable.           |
| `defaultValue` | `string \| number \| boolean \| Date` | Valeur initiale du champ.                                      |
| `showWhen`     | `object`                              | Rend le champ visible conditionnellement.                      |
| `editable`     | `(values) => boolean`                 | Contrôle l'accessibilité dynamique selon l'état du formulaire. |

---

## 6. Référence par type de champ

### `text` — Champ texte libre

```typescript
{
  name: 'lastName',
  label: 'Nom de famille',
  type: 'text',
  placeholder: 'Entrez votre nom',
  maxLength: 50,
  validation: {
    required: 'Le nom est obligatoire',
    minLength: { value: 2, message: 'Minimum 2 caractères' },
  },
}
```

| Propriété                | Effet                                                                          |
| ------------------------ | ------------------------------------------------------------------------------ |
| `maxLength`              | Affiche un compteur `(3/50)` dans le label et bloque la saisie au-delà         |
| `leftIcon` / `rightIcon` | Fonctions retournant un `ReactNode` (ex : `<TextInput.Icon icon="account" />`) |
| `inputProps`             | Toute prop additionnelle de `TextInputProps` (react-native-paper)              |

---

### `email` — Adresse email

```typescript
{
  name: 'email',
  label: 'Adresse email',
  type: 'email',
  validation: {
    required: 'Email obligatoire',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Format email invalide',
    },
  },
}
```

> **Comportements automatiques :** clavier `email-address`, `autoCapitalize: 'none'`, `autoComplete: 'email'`.

---

### `password` — Mot de passe

```typescript
{
  name: 'password',
  label: 'Mot de passe',
  type: 'password',
  validation: {
    required: 'Mot de passe obligatoire',
    minLength: { value: 8, message: 'Minimum 8 caractères' },
  },
}
```

> **Comportement automatique :** masque le texte, affiche une icône œil pour révéler/masquer.

---

### `number` — Champ numérique

```typescript
{
  name: 'amount',
  label: 'Montant (FCFA)',
  type: 'number',
  maxLength: 10,
  validation: { required: 'Montant requis' },
}
```

> **Comportement automatique :** clavier `numeric`, filtre automatique des caractères non numériques.

---

### `phone` — Numéro de téléphone

```typescript
{
  name: 'phoneNumber',
  label: 'Numéro de téléphone',
  type: 'phone',
  placeholder: '6XXXXXXXX',
  maxLength: 9,
  validation: { required: 'Numéro requis' },
}
```

> **Comportement automatique :** clavier `phone-pad`, filtre les caractères non numériques.

---

### `multiline` — Texte long / Zone de texte

```typescript
{
  name: 'description',
  label: 'Description',
  type: 'multiline',
  maxLength: 500,
  validation: { required: 'Description obligatoire' },
}
```

> **Rendu :** `TextInput` avec `multiline={true}`, `numberOfLines={4}`, hauteur minimale de 100.

---

### `date` — Sélecteur de date

```typescript
{
  name: 'birthDate',
  label: 'Date de naissance',
  type: 'date',
  validation: { required: 'Date de naissance obligatoire' },
}
```

| Comportement       | Détail                                                                 |
| ------------------ | ---------------------------------------------------------------------- |
| **Rendu**          | Champ cliquable ouvrant un `DateTimePicker` natif                      |
| **iOS**            | Affiche en mode `spinner`                                              |
| **Android**        | Affiche le picker par défaut, se ferme automatiquement après sélection |
| **Date maximum**   | Limitée à aujourd'hui (`maximumDate={new Date()}`)                     |
| **Format affiché** | `toLocaleDateString('fr-FR')` (ex : `15/08/1990`)                      |
| **Valeur stockée** | Objet `Date` JavaScript                                                |

---

### `select` — Liste déroulante (bottom sheet)

```typescript
{
  name: 'country',
  label: 'Pays',
  type: 'select',
  placeholder: 'Sélectionnez un pays',
  options: [
    { label: 'Cameroun',  value: 'CM' },
    { label: 'Côte d\'Ivoire', value: 'CI' },
    { label: 'Sénégal',  value: 'SN' },
  ],
  validation: { required: 'Pays obligatoire' },
}
```

| Comportement            | Détail                                                         |
| ----------------------- | -------------------------------------------------------------- |
| **Rendu**               | Champ cliquable, ouvre un bottom sheet avec animation `spring` |
| **Option sélectionnée** | Cochée avec une icône check et fond violet clair               |
| **Fermeture**           | Clic sur l'overlay ou sélection d'une option                   |
| `options`               | **Obligatoire** pour ce type. Tableau `{ label, value }[]`     |

---

### `radio` — Boutons radio

```typescript
{
  name: 'gender',
  label: 'Genre',
  type: 'radio',
  options: [
    { label: 'Homme', value: 'M' },
    { label: 'Femme', value: 'F' },
    { label: 'Autre', value: 'O' },
  ],
  validation: { required: 'Veuillez sélectionner un genre' },
}
```

| Comportement    | Détail                                                           |
| --------------- | ---------------------------------------------------------------- |
| **Rendu**       | Liste verticale avec `RadioButton.Android` de react-native-paper |
| **Interaction** | Toute la ligne est cliquable                                     |
| `options`       | **Obligatoire** pour ce type                                     |

---

### `switch` — Bascule (toggle)

```typescript
{
  name: 'termsAccepted',
  label: 'J\'accepte les conditions générales',
  type: 'switch',
  defaultValue: false,
  validation: { required: 'Vous devez accepter les conditions' },
}
```

| Comportement | Détail                                                   |
| ------------ | -------------------------------------------------------- |
| **Rendu**    | Label à gauche + `Switch` de react-native-paper à droite |
| **Valeur**   | `boolean` (`true` / `false`)                             |

---

### `checkbox` — Case à cocher

```typescript
{
  name: 'newsletter',
  label: 'S\'inscrire à la newsletter',
  type: 'checkbox',
  defaultValue: false,
}
```

> Rendu inline (label + checkbox côte à côte). Le `Checkbox` de react-native-paper est utilisé.

---

### `file` — Sélection de fichier

```typescript
{
  name: 'identityDocument',
  label: 'Pièce d\'identité',
  type: 'file',
  validation: { required: 'Document obligatoire' },
}
```

| Comportement                    | Détail                                                                       |
| ------------------------------- | ---------------------------------------------------------------------------- |
| **Types acceptés**              | Images (`image/*`), PDF, Word (`.doc`, `.docx`), fichiers texte              |
| **Rendu (vide)**                | Zone pointillée avec icône upload et texte "Cliquez pour choisir un fichier" |
| **Rendu (fichier sélectionné)** | Nom du fichier + taille en MB + bouton de suppression                        |
| **Valeur stockée**              | Objet asset Expo : `{ name, size, uri, mimeType, ... }`                      |

---

## 7. Logique de validation

La validation est déléguée à **React Hook Form**. Le champ `validation` de chaque `FormField` accepte toutes les règles de `RegisterOptions`.

### Règles disponibles

| Règle       | Type                         | Exemple                                                     |
| ----------- | ---------------------------- | ----------------------------------------------------------- |
| `required`  | `string \| boolean`          | `required: 'Champ obligatoire'`                             |
| `minLength` | `{ value, message }`         | `minLength: { value: 3, message: 'Min 3 caractères' }`      |
| `maxLength` | `{ value, message }`         | `maxLength: { value: 50, message: 'Max 50 caractères' }`    |
| `pattern`   | `{ value: RegExp, message }` | `pattern: { value: /^\d{9}$/, message: 'Format invalide' }` |
| `min`       | `{ value, message }`         | `min: { value: 18, message: 'Minimum 18 ans' }`             |
| `max`       | `{ value, message }`         | `max: { value: 100, message: 'Valeur trop élevée' }`        |
| `validate`  | `(value) => true \| string`  | Validation custom                                           |

### Comportement de validation dans `StepFormBuilder`

- Le mode de validation est `onChange` (validation en temps réel).
- Lors du clic sur **Suivant**, seuls les champs **visibles** (ceux dont `showWhen` est satisfait) sont validés.
- Si la validation échoue, la navigation est **bloquée** et les messages d'erreur sont affichés.
- Les messages d'erreur apparaissent sous chaque champ (via `HelperText` de react-native-paper).

### `maxLength` — Comportement spécial

```typescript
// Depuis StepFormField.tsx :
// maxLength peut être défini directement sur le champ...
maxLength: 50,

// ...ou dans la validation (les deux sont supportés) :
validation: {
  maxLength: { value: 50, message: 'Trop long' },
}
```

> Quand `maxLength` est défini, le label du champ affiche un **compteur dynamique** : `"Prénom (12/50)"`.

---

## 8. Logique conditionnelle (`showWhen` / `editable`)

### `showWhen` — Affichage conditionnel

Permet d'afficher ou masquer un champ selon la valeur d'un autre champ.

#### Syntaxe simple (égalité stricte)

```typescript
{
  name: 'spouseName',
  label: 'Nom du conjoint',
  type: 'text',
  showWhen: {
    field: 'maritalStatus', // nom du champ à surveiller
    value: 'married',       // valeur déclenchante
  },
}
```

→ Le champ `spouseName` n'est affiché **que si** `maritalStatus === 'married'`.

#### Syntaxe avancée (fonction prédicat)

```typescript
{
  name: 'otherIncomeSource',
  label: 'Autre source de revenus',
  type: 'text',
  showWhen: {
    field: 'hasOtherIncome',
    condition: (value) => value === true || value === 'yes',
  },
}
```

→ La propriété `condition` reçoit la valeur actuelle du champ surveillé et doit retourner `true` pour afficher le champ.

> ⚠️ **Important :** Les champs cachés par `showWhen` sont **automatiquement exclus de la validation** lors du clic sur "Suivant".

---

### `isNextDisabled` — Bloquer le bouton Suivant dynamiquement

Au niveau de l'étape (`FormStep`), vous pouvez contrôler dynamiquement le bouton "Suivant" :

```typescript
{
  title: 'Vérification',
  fields: [/* ... */],
  // Valeur statique :
  isNextDisabled: true,

  // Ou dynamique (fonction) :
  isNextDisabled: (values) => !values.termsAccepted,
}
```

---

### `editable` — Accessibilité dynamique

Contrôle si un champ est activé selon l'état courant du formulaire :

```typescript
{
  name: 'transferAmount',
  label: 'Montant du transfert',
  type: 'number',
  editable: (formValues) => formValues.accountBalance > 0,
}
```

---

## 9. Étapes personnalisées (`type: 'custom'`)

Une étape peut avoir `type: 'custom'` pour afficher un contenu entièrement personnalisé (récapitulatif, vidéo, instructions…) tout en optionnellement incluant des champs.

```typescript
{
  type: 'custom',
  title: 'Récapitulatif',
  render: (data, goToNextStep, goToPreviousStep) => (
    <View>
      <Text>Bonjour, {data.firstName} {data.lastName}</Text>
      <Text>Email : {data.email}</Text>
    </View>
  ),
  // Optionnel : des champs peuvent coexister avec render
  fields: [
    {
      name: 'finalConfirmation',
      label: 'Je confirme l\'exactitude des informations',
      type: 'checkbox',
      validation: { required: 'Confirmation obligatoire' },
    },
  ],
}
```

| Propriété        | Description                                                 |
| ---------------- | ----------------------------------------------------------- |
| `render`         | Fonction `(data, goToNext, goToPrev) => ReactNode`          |
| `header`         | Fonction `(data?) => ReactNode` pour un header personnalisé |
| `fields`         | Peut coexister avec `render`                                |
| `onStepComplete` | Callback asynchrone avant de passer à l'étape suivante      |

### `onStepComplete` — Traitement asynchrone entre étapes

```typescript
{
  title: 'Vérification OTP',
  fields: [/* champ OTP */],
  onStepComplete: async (data) => {
    const result = await verifyOTP(data.otp);
    // Les valeurs retournées sont injectées dans le formulaire
    return { userId: result.userId };
  },
}
```

> **Comportement :** Si `onStepComplete` lance une erreur, le callback `onError` est appelé et la navigation est bloquée. Un état `isProcessing` (spinner) est automatiquement géré.

---

### `buttonPosition` — Position des boutons de navigation

| Valeur            | Comportement                                                 |
| ----------------- | ------------------------------------------------------------ |
| `'center'`        | Boutons dans le flux du `ScrollView` (défaut)                |
| `'bottom'`        | Boutons fixés en bas de l'écran (barre blanche avec bord)    |
| `'bottom-raised'` | Boutons fixés, fond transparent, légèrement surélevés (40px) |

---

### `contentAlign` — Alignement vertical du contenu

| Valeur     | Comportement                                   |
| ---------- | ---------------------------------------------- |
| `'top'`    | Contenu aligné en haut (`flex-start`) — défaut |
| `'center'` | Contenu centré verticalement                   |
| `'bottom'` | Contenu aligné en bas                          |

---

## 10. Exemple complet de configuration

Voici un exemple complet d'un formulaire d'inscription KYC en 4 étapes :

```typescript
import { StepFormBuilder } from 'afrikpay-com-rn-step-form';
import type { FormStep } from 'afrikpay-com-rn-step-form';
import { View, Text } from 'react-native';

const kycSteps: FormStep[] = [
  // ─── Étape 1 : Identité ───────────────────────────────────────────────────
  {
    title: 'Identité',
    description: 'Renseignez vos informations personnelles',
    buttonPosition: 'bottom',
    fields: [
      {
        name: 'firstName',
        label: 'Prénom',
        type: 'text',
        maxLength: 50,
        validation: {
          required: 'Le prénom est obligatoire',
          minLength: { value: 2, message: 'Minimum 2 caractères' },
        },
      },
      {
        name: 'lastName',
        label: 'Nom de famille',
        type: 'text',
        maxLength: 50,
        validation: { required: 'Le nom est obligatoire' },
      },
      {
        name: 'birthDate',
        label: 'Date de naissance',
        type: 'date',
        validation: { required: 'La date de naissance est obligatoire' },
      },
      {
        name: 'gender',
        label: 'Genre',
        type: 'radio',
        options: [
          { label: 'Homme', value: 'M' },
          { label: 'Femme', value: 'F' },
        ],
        validation: { required: 'Veuillez sélectionner votre genre' },
      },
      {
        name: 'maritalStatus',
        label: 'Situation matrimoniale',
        type: 'select',
        placeholder: 'Sélectionnez...',
        options: [
          { label: 'Célibataire', value: 'single' },
          { label: 'Marié(e)',    value: 'married' },
          { label: 'Divorcé(e)', value: 'divorced' },
        ],
        validation: { required: 'Champ obligatoire' },
      },
      {
        // Champ conditionnel : visible uniquement si marié(e)
        name: 'spouseName',
        label: 'Nom du conjoint / de la conjointe',
        type: 'text',
        showWhen: { field: 'maritalStatus', value: 'married' },
        validation: { required: 'Le nom du conjoint est requis' },
      },
    ],
  },

  // ─── Étape 2 : Coordonnées ───────────────────────────────────────────────
  {
    title: 'Coordonnées',
    description: 'Vos informations de contact',
    fields: [
      {
        name: 'email',
        label: 'Adresse email',
        type: 'email',
        validation: {
          required: 'Email obligatoire',
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Format email invalide',
          },
        },
      },
      {
        name: 'phoneNumber',
        label: 'Numéro de téléphone',
        type: 'phone',
        placeholder: '6XXXXXXXX',
        maxLength: 9,
        validation: {
          required: 'Numéro de téléphone obligatoire',
          pattern: { value: /^\d{9}$/, message: 'Format invalide (9 chiffres)' },
        },
      },
      {
        name: 'country',
        label: 'Pays de résidence',
        type: 'select',
        options: [
          { label: 'Cameroun',       value: 'CM' },
          { label: 'Côte d\'Ivoire', value: 'CI' },
          { label: 'Sénégal',        value: 'SN' },
          { label: 'Mali',           value: 'ML' },
        ],
        validation: { required: 'Pays obligatoire' },
      },
    ],
  },

  // ─── Étape 3 : Documents ─────────────────────────────────────────────────
  {
    title: 'Documents',
    description: 'Téléchargez vos pièces justificatives',
    fields: [
      {
        name: 'docType',
        label: 'Type de document',
        type: 'radio',
        options: [
          { label: 'Carte Nationale d\'Identité', value: 'CNI' },
          { label: 'Passeport',                   value: 'PASSPORT' },
          { label: 'Permis de conduire',           value: 'DRIVING' },
        ],
        validation: { required: 'Veuillez choisir un type de document' },
      },
      {
        name: 'identityDoc',
        label: 'Recto de la pièce d\'identité',
        type: 'file',
        validation: { required: 'Document obligatoire' },
      },
      {
        name: 'selfie',
        label: 'Photo selfie avec la pièce',
        type: 'file',
        validation: { required: 'Selfie obligatoire' },
      },
      {
        name: 'termsAccepted',
        label: 'J\'accepte le traitement de mes données personnelles',
        type: 'switch',
        defaultValue: false,
        validation: { required: 'Vous devez accepter les conditions' },
      },
    ],
    isNextDisabled: (values) => !values.termsAccepted,
  },

  // ─── Étape 4 : Récapitulatif (étape custom) ──────────────────────────────
  {
    title: 'Récapitulatif',
    type: 'custom',
    buttonPosition: 'bottom',
    render: (data) => (
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 16 }}>
          Vérifiez vos informations
        </Text>
        <Text>👤 {data.firstName} {data.lastName}</Text>
        <Text>📧 {data.email}</Text>
        <Text>📱 {data.phoneNumber}</Text>
        <Text>🌍 {data.country}</Text>
        <Text>📄 {data.docType}</Text>
      </View>
    ),
    onStepComplete: async (data) => {
      // Appel API avant soumission finale
      const result = await submitKYCDraft(data);
      return { draftId: result.id };
    },
  },
];

// ─── Écran principal ────────────────────────────────────────────────────────
export default function KYCFormScreen() {
  const handleFinalSubmit = async (data: Record<string, any>) => {
    await submitKYCFinal(data);
    console.log('KYC soumis avec succès :', data);
  };

  return (
    <StepFormBuilder
      steps={kycSteps}
      onSubmit={handleFinalSubmit}
      onError={(errors) => console.error('Erreurs formulaire :', errors)}
      defaultValues={{ country: 'CM' }}
    />
  );
}
```

---

## Résumé des types de champs

| Type        | Composant rendu        | Valeur retournée      | Notes                          |
| ----------- | ---------------------- | --------------------- | ------------------------------ |
| `text`      | `TextInput` (outlined) | `string`              | Clavier par défaut             |
| `email`     | `TextInput`            | `string`              | Clavier email, autoComplete    |
| `password`  | `TextInput`            | `string`              | Masqué, icône révéler          |
| `number`    | `TextInput`            | `string` (numérique)  | Clavier numérique, filtre auto |
| `phone`     | `TextInput`            | `string` (numérique)  | Clavier téléphone, filtre auto |
| `multiline` | `TextInput`            | `string`              | 4 lignes, hauteur min 100      |
| `date`      | `DateField`            | `Date`                | Picker natif, format fr-FR     |
| `select`    | `SelectField`          | `string`              | Bottom sheet animé             |
| `radio`     | `RadioField`           | `string`              | Liste de boutons radio         |
| `switch`    | `SwitchField`          | `boolean`             | Toggle on/off                  |
| `checkbox`  | `Checkbox`             | `boolean`             | Inline label + case            |
| `file`      | `FileField`            | `DocumentPickerAsset` | Images, PDF, Word, texte       |

---

## 11. Intégration dans une application — Prérequis

### `PaperProvider` obligatoire

`StepFormBuilder` utilise des composants de `react-native-paper` (`Button`, `TextInput`, `Switch`, `Checkbox`, `HelperText`). Ces composants nécessitent que l'application soit enveloppée dans un `PaperProvider` au niveau racine :

```tsx
import { PaperProvider } from 'react-native-paper';
import { StepFormBuilder } from 'afrikpay-com-rn-step-form';

export default function App() {
  return (
    <PaperProvider>
      {/* votre navigation ou écran */}
      <StepFormBuilder steps={...} onSubmit={...} />
    </PaperProvider>
  );
}
```

> ⚠️ Si `PaperProvider` est absent, les composants Paper ne seront pas rendus correctement et peuvent générer des erreurs de thème.

---

### `KeyboardAvoidingView` recommandé

Pour éviter que le clavier ne masque les champs, encapsulez votre écran dans un `KeyboardAvoidingView`. `StepFormBuilder` le gère **en interne** pour ses propres champs, mais si vous ajoutez du contenu autour, gérez-le également dans le parent :

```tsx
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';

<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView keyboardShouldPersistTaps="handled">
    <StepFormBuilder steps={...} onSubmit={...} />
  </ScrollView>
</KeyboardAvoidingView>
```

---

## 12. Patterns avancés — Tirés de l'application de démonstration

### 12.1 — Champs dynamiques selon l'état externe (`fields` calculés)

Il est possible de calculer le tableau `fields` d'une étape **dynamiquement** selon une variable d'état React externe. C'est utile pour adapter le formulaire selon un choix de l'utilisateur fait en dehors du formulaire (ex : moyen de paiement sélectionné).

#### Cas concret : PIN ou Téléphone selon le moyen de paiement

```tsx
// État React dans le composant parent
const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

const getPaymentConfig = (method: PaymentMethod | null) => {
  if (!method) return null;
  const name = method.name.toLowerCase();
  return {
    requiresPin:   name.includes('afrikpay'),
    requiresPhone: !name.includes('afrikpay'),
  };
};

// Dans la configuration des étapes :
{
  title: 'Récapitulatif',
  type: 'custom',

  // ⬇️ fields est calculé dynamiquement selon selectedMethod
  fields: getPaymentConfig(selectedMethod)?.requiresPin
    ? [
        {
          name: 'pinCode',
          label: 'Code PIN',
          type: 'password',
          validation: {
            required: { value: true, message: 'PIN requis' },
            minLength: { value: 4, message: '4 chiffres minimum' },
            maxLength: { value: 4, message: '4 chiffres maximum' },
          },
        },
      ]
    : [
        {
          name: 'phoneNumber',
          label: 'Téléphone Mobile Money',
          type: 'phone',
          validation: {
            required: { value: true, message: 'Téléphone requis' },
            minLength: { value: 9, message: '9 chiffres requis' },
            maxLength: { value: 9, message: '9 chiffres maximum' },
          },
        },
      ],

  // isNextDisabled adapté au champ actif
  isNextDisabled: (v) => {
    const config = getPaymentConfig(selectedMethod);
    if (!config) return true;
    if (config.requiresPin)   return (v.pinCode?.length ?? 0) !== 4;
    return (v.phoneNumber?.length ?? 0) < 9;
  },

  render: () => (/* récapitulatif de la facture */),

  onStepComplete: async (values) => {
    const config = getPaymentConfig(selectedMethod);
    return {
      payment: {
        serviceFeatureId: selectedMethod?.serviceFeatureId,
        ...(config?.requiresPin  && { pin:         values.pinCode }),
        ...(config?.requiresPhone && { phoneNumber: values.phoneNumber }),
      },
    };
  },
}
```

> **Point clé :** Le tableau `steps` est recalculé à chaque re-render puisque c'est une expression JavaScript. Les champs s'adaptent donc automatiquement quand `selectedMethod` change.

---

### 12.2 — `isNextDisabled` statique (boolean externe)

`isNextDisabled` peut aussi être un **boolean pur** (non une fonction), utile pour déléguer la logique de blocage à une variable externe :

```tsx
const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

{
  title: 'Moyen de paiement',
  type: 'custom',
  // Bloqué tant qu'aucun moyen n'est sélectionné (état externe)
  isNextDisabled: !selectedMethod,
  render: () => (
    <PaymentSelector
      features={paymentFeatures}
      selectedMethod={selectedMethod}
      onSelect={(m) => setSelectedMethod(m)}
    />
  ),
  onStepComplete: async () => {
    if (!selectedMethod) throw new Error('Veuillez sélectionner un moyen');
    await fetchFees();
    return { selectedMethodId: selectedMethod.serviceFeatureId };
  },
}
```

---

### 12.3 — Validation conditionnelle multi-niveaux dans `isNextDisabled`

L'exemple de l'étape "Localisation" illustre une validation imbriquée :

```tsx
{
  title: 'Localisation',
  fields: [
    { name: 'country', label: 'Pays',   type: 'select', options: countries },
    { name: 'city',    label: 'Ville',  type: 'text' },
    {
      name: 'region',
      label: 'Région',
      type: 'select',
      options: regions_cameroun,
      // Affiché uniquement si le pays sélectionné est le Cameroun
      showWhen: { field: 'country', value: 'CM' },
    },
  ],
  isNextDisabled(values) {
    // Règle 1 : pays et ville toujours obligatoires
    if (!values.country || !values.city) return true;

    // Règle 2 : si Cameroun → la région est aussi obligatoire
    if (values.country === 'CM' && !values.region) return true;

    return false;
  },
}
```

> **Pattern recommandé :** Combinez `showWhen` (affichage) et `isNextDisabled` (validation) pour une expérience cohérente : le champ apparaît ET sa validation est activée ensemble.

---

### 12.4 — Étape matrimoniale avec `checkbox` + `showWhen`

```tsx
{
  title: 'Informations Légales',
  fields: [
    {
      name: 'is_married',
      label: 'Êtes-vous marié(e) ?',
      type: 'select',
      options: [
        { label: 'Oui', value: 'Oui' },
        { label: 'Non', value: 'Non' },
      ],
      validation: { required: { value: true, message: 'Requis' } },
    },
    {
      name: 'married',
      label: 'Nom du conjoint',
      type: 'text',
      showWhen: { field: 'is_married', value: 'Oui' },
    },
    {
      name: 'is_worker',
      label: 'Travaillez-vous ?',
      type: 'checkbox',
    },
  ],
  isNextDisabled(values) {
    if (!values.is_married) return true;
    // Si marié, le nom du conjoint devient obligatoire
    if (values.is_married === 'Oui' && !values.married?.trim()) return true;
    return false;
  },
}
```

---

### 12.5 — `externalValues` & `onExternalValueChange` — Valeurs pilotées de l'extérieur

Ces deux props permettent de **synchroniser le formulaire avec un état externe**, par exemple pour pré-remplir des champs depuis une API ou une autre source.

```tsx
const [externalData, setExternalData] = useState({ country: 'CM' });

<StepFormBuilder
  steps={steps}
  onSubmit={handleSubmit}
  defaultValues={{ name: 'cedigno', is_worker: true }}
  externalValues={externalData}
  onExternalValueChange={(name, value) => {
    console.log(`Champ externe modifié : ${name} = ${value}`);
  }}
/>;
```

| Prop                    | Comportement                                                       |
| ----------------------- | ------------------------------------------------------------------ |
| `defaultValues`         | Valeurs initiales définies **une seule fois** au montage           |
| `externalValues`        | Synchronisées **à chaque changement** via `useEffect` → `setValue` |
| `onExternalValueChange` | Callback de notification (log, analytics, etc.)                    |

---

### 12.6 — Composant `PaymentSelector` — Sélecteur de méthode de paiement

`PaymentSelector` est un composant visuel inclus dans la bibliothèque pour afficher une grille de méthodes de paiement avec logo.

```tsx
import PaymentSelector from 'afrikpay-com-rn-step-form/components/PaymentSelector';

<PaymentSelector
  features={paymentFeatures} // PaymentMethod[] : { serviceFeatureId, name, logo }
  paymentLoading={false} // Affiche un loader si true
  selectedMethod={selectedMethod}
  onSelect={(method) => setSelectedMethod(method)}
  title="Choisir un moyen de paiement"
/>;
```

> Utilisez-le dans une étape `type: 'custom'` via la prop `render`.

---

## 13. Tableau récapitulatif des patterns

| Besoin                              | Mécanisme            | Propriété                           |
| ----------------------------------- | -------------------- | ----------------------------------- |
| Champs toujours affichés            | —                    | `fields` (sans `showWhen`)          |
| Champ conditionnel (valeur exacte)  | `showWhen.value`     | `field.showWhen`                    |
| Champ conditionnel (logique custom) | `showWhen.condition` | `field.showWhen`                    |
| Bloquer "Suivant" (logique)         | Fonction             | `step.isNextDisabled`               |
| Bloquer "Suivant" (état externe)    | Boolean              | `step.isNextDisabled`               |
| Action async avant passage d'étape  | Promise              | `step.onStepComplete`               |
| Écran entièrement custom            | JSX                  | `step.render`                       |
| Header personnalisé par étape       | JSX                  | `step.header`                       |
| Valeurs initiales                   | Objet                | `defaultValues`                     |
| Injection externe de valeurs        | Objet réactif        | `externalValues`                    |
| Champs calculés selon état          | Expression           | `fields: condition ? [...] : [...]` |
| Limiter la saisie de caractères     | Nombre entier        | `field.maxLength`                   |
| Valider format texte                | RegExp               | `validation.pattern`                |
| Validation combinée multi-champs    | Closure              | `isNextDisabled(values)`            |

---

_Documentation générée automatiquement par analyse statique du code source — Mars 2026._
