/*import { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Text, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper'; // fournit le theme global
import { useForm } from 'react-hook-form';
import { StepFormField } from './StepFormField';
import { StepFormHeader } from './StepFormHeader';
//import type { FormData, FormStep, StepFormBuilderProps } from './types/types';
/*
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';

import type { FormData, StepFormBuilderProps, FormStep } from '../types'; // formStep

export default function StepFormBuilder({
  steps, // etape du formulaire
  onSubmit, // fonction final
  onError,
  defaultValues,
  externalValues, // valeur externe
}: StepFormBuilderProps) {
  const [isProcessing, setIsProcessing] = useState(false); // indique si une action est en cours
  const [currentStep, setCurrentStep] = useState(0); // etape actuel(premiere etape = 0)
  const isLastStep = currentStep === steps.length - 1; // verifie si on es a la derniere etape
  // const fadeAnim = useRef(new Animated.Value(1)).current;

  const {
    control, // connecte les champs au formulaire
    handleSubmit,
    trigger, // valide les champs manuellement
    formState: { errors, isValid: formIsValid },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues,
    // mode: 'onChange',
  });

  useEffect(() => {
    if (externalValues) {
      Object.entries(externalValues).forEach(([name, value]) => {
        setValue(name, value);
      });
    }
  }, [externalValues, setValue]);

  const handleNext = async () => {
    const fields = steps[currentStep]?.fields.map((field) => field.name); // recupere les nom des champs a l'etat actuel
    const isValid = await trigger(fields); // valide les champs

    if (!isValid) return;

    const currentStepData = getValues();

    if (steps[currentStep]?.onStepComplete) {
      // si une fonction existe a l'etat actuelle on charge les data
      setIsProcessing(true);
      try {
        const result =
          await steps[currentStep]?.onStepComplete(currentStepData); // passe a l'etape suivant

        // If the handler returns data, merge it with the form data
        if (result) {
          Object.entries(result).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      } catch (error: unknown) {
        console.error('Step completion error:', error);
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        onError?.({ stepError: errorMessage });
        return;
      } finally {
        setIsProcessing(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1)); // passe a l'etape suivant
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0)); // retour a l'etape precedente
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormError = (error: Record<string, any>) => {
    onError?.(error);
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always"
        >
          <StepFormHeader
            steps={steps}
            currentStep={currentStep}
            data={getValues()}
          />
          <View key={currentStep} style={styles.fieldsContainer}>
            {steps[currentStep]?.fields.map((field) => (
              <StepFormField
                key={field.name}
                field={field}
                control={control}
                error={errors[field.name]}
                defaultValue={defaultValues?.[field.name]}
              />
            ))}
          </View>
          <View style={styles.buttonsContainer}>
            {currentStep > 0 && (
              <Button
                mode="outlined"
                onPress={handleBack}
                style={styles.button}
                theme={{ roundness: 5 }}
              >
                Back
              </Button>
            )}
            <Button
              mode="contained"
              onPress={
                isLastStep // si dernier etape submit si non on passe a l'etape suivant
                  ? handleSubmit(handleFormSubmit, handleFormError)
                  : handleNext
              }
              loading={isProcessing}
              style={styles.button}
              theme={{ roundness: 5 }}
              disabled={isProcessing || (isLastStep && !formIsValid)}
            >
              {isLastStep ? 'Valider' : 'Suivant'}
            </Button>
          </View>
        </ScrollView>
      </View>
      {/* <Portal>
        <Modal
          onDismiss={console.log}
          contentContainerStyle={{
            flex: 1,
            padding: 20,
          }}
          dismissable={false}
          visible
        >
          <ScrollView contentContainerStyle={{ flex: 1 }}>
            {options?.map(renderOption)}
          </ScrollView>
          <View>
            <Button mode="outlined">Cancel</Button>
            <Button mode="contained-tonal">Done</Button>
          </View>
        </Modal>
      </Portal> *
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    gap: 16,
  },
  contentContainer: { flexGrow: 1 },
  scrollView: {
    flex: 1,
  },
  fieldsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
});*/

import { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Animated,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Button, PaperProvider } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { StepFormField } from './StepFormField';
import type { FormData, FormStep, StepFormBuilderProps } from '../types'; // les types pour le formulaire
import { StepFormHeader } from './StepFormHeader';
import { COLORS } from '../../constantes/color';

export default function StepFormBuilder({
  steps,
  onSubmit,
  onError,
  defaultValues,
  externalValues,
}: StepFormBuilderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    watch, // pour
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
  });

  const isLastStep = currentStep === steps.length - 1;
  const currentStepConfig: FormStep | undefined = steps[currentStep];

  const contentAlign = currentStepConfig?.contentAlign ?? 'top';

  const watchedValues = watch(); // récupère les valeurs des champs(formulaires)
  const isNextDisabled =
    typeof currentStepConfig?.isNextDisabled === 'function'
      ? currentStepConfig.isNextDisabled(watchedValues) // si isNextDisabled est une fonction
      : (currentStepConfig?.isNextDisabled ?? false); // sinon, on utilise la valeur par défaut

  const justifyContentMap: Record<
    typeof contentAlign,
    'flex-start' | 'center' | 'flex-end'
  > = {
    top: 'flex-start',
    center: 'center',
    bottom: 'flex-end',
  };

  useEffect(() => {
    if (externalValues) {
      Object.entries(externalValues).forEach(([name, value]) => {
        setValue(name, value);
      });
    }
  }, [externalValues, setValue]);

  const animateTransition = (callback: () => void) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      callback();
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleNext = async () => {
    if (!currentStepConfig) return;

    // Filtre uniquement les champs visibles (showWhen respecté)
    const getVisibleFields = (fields: typeof currentStepConfig.fields) =>
      (fields ?? [])
        .filter((f) => {
          if (!f.showWhen) return true; // pas de condition → toujours visible
          return watchedValues[f.showWhen.field] === f.showWhen.value;
        })
        .map((f) => f.name);

    if (!currentStepConfig.type || currentStepConfig.type === 'form') {
      const fields = getVisibleFields(currentStepConfig.fields); // remplace .map((f) => f.name)
      if (fields.length > 0) {
        const isValid = await trigger(fields);
        if (!isValid) return;
      }
    }

    // Pour type 'custom' avec fields
    if (currentStepConfig.type === 'custom' && currentStepConfig.fields) {
      const fields = getVisibleFields(currentStepConfig.fields);
      if (fields.length > 0) {
        const isValid = await trigger(fields);
        if (!isValid) return;
      }
    }

    if (currentStepConfig.onStepComplete) {
      setIsProcessing(true);
      try {
        const result = await currentStepConfig.onStepComplete(getValues());
        if (result) {
          Object.entries(result).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Unknown error';
        onError?.({ stepError: errorMessage });
        return;
      } finally {
        setIsProcessing(false);
      }
    }

    animateTransition(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    });
  };

  const handleBack = () => {
    animateTransition(() => {
      setCurrentStep((prev) => Math.max(prev - 1, 0));
    });
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormError = (error: Record<string, any>) => {
    onError?.(error);
  };

  if (!currentStepConfig) return null;

  const buttonPosition = currentStepConfig.buttonPosition ?? 'center';
  const isFixedPosition = buttonPosition !== 'center';

  const ButtonsRow = () => (
    <View style={styles.buttonsRow}>
      {currentStep > 0 && (
        <Button mode="outlined" onPress={handleBack} style={styles.button}>
          Back
        </Button>
      )}
      <Button
        mode="contained"
        onPress={
          isLastStep
            ? handleSubmit(handleFormSubmit, handleFormError)
            : handleNext
        }
        style={[
          styles.button,
          styles.primaryButton,
          isNextDisabled && styles.disabledButton,
        ]}
        disabled={isProcessing || isNextDisabled}
      >
        <Text
          style={{
            color: isNextDisabled ? '#999' : COLORS.while,
            fontSize: 16,
          }}
        >
          {isLastStep ? 'Valider' : 'Suivant'}
        </Text>
      </Button>
    </View>
  );

  return (
    // keyboardAvoidingView: pousse le contenue au dessus du clavier
    <PaperProvider>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={[
              styles.contentContainer,
              isFixedPosition
                ? styles.contentContainerFixed
                : styles.contentContainerNatural,
            ]}
            showsVerticalScrollIndicator={false}
            //keyboardShouldPersistTaps="always"
            keyboardShouldPersistTaps="handled" // permet de taper sans que le clavier disparaisse
          >
            <StepFormHeader
              steps={steps}
              currentStep={currentStep}
              data={getValues()}
            />

            <Animated.View
              style={[
                styles.fieldsContainer,
                {
                  opacity: fadeAnim,
                  justifyContent: justifyContentMap[contentAlign],
                },
              ]}
            >
              {/* render ET fields coexistent (étape custom avec champs) */}
              {currentStepConfig.render?.(
                getValues(),
                () => {},
                () => {}
              )}

              {currentStepConfig.fields?.map((field) => {
                console.log(
                  'field:',
                  field.name,
                  '| showWhen:',
                  field.showWhen,
                  '| watchedValues:',
                  watchedValues
                ); // 👈
                // Vérifier la condition showWhen
                if (field.showWhen) {
                  const { field: watchedField, value: expectedValue } =
                    field.showWhen;
                  if (watchedValues[watchedField] !== expectedValue) {
                    return null; // cacher le champ
                  }
                }

                return (
                  <StepFormField
                    key={field.name}
                    field={field}
                    control={control}
                    error={errors[field.name]}
                    defaultValue={defaultValues?.[field.name]}
                  />
                );
              })}
            </Animated.View>

            {!isFixedPosition && (
              <View style={styles.buttonsContainerInline}>
                <ButtonsRow />
              </View>
            )}
          </ScrollView>

          {buttonPosition === 'bottom' && (
            <View style={styles.buttonsContainerBottom}>
              <ButtonsRow />
            </View>
          )}

          {buttonPosition === 'bottom-raised' && (
            <View style={styles.buttonsContainerBottomRaised}>
              <ButtonsRow />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, gap: 16 },
  scrollView: { flex: 1 },
  contentContainer: { flexGrow: 1 },
  contentContainerWithFixedButtons: { paddingBottom: 100 }, // espace pour les boutons fixes
  fieldsContainer: { marginTop: 62 },
  buttonsContainerInline: { marginTop: 24 },
  buttonsContainerBottom: {
    position: 'absolute',
    bottom: 0,
    left: 24,
    right: 24,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  buttonsContainerBottomRaised: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    paddingVertical: 16,
    backgroundColor: 'transparent',
  },
  buttonsRow: { flexDirection: 'row', gap: 12 },
  button: { flex: 1 },
  primaryButton: { backgroundColor: COLORS.primary },
  disabledButton: { backgroundColor: '#ccc', opacity: 0.8 },
  contentContainerNatural: {},
  contentContainerFixed: { flexGrow: 1, paddingBottom: 100 },
});
