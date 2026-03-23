import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, PaperProvider } from 'react-native-paper'; // fournit le theme global
import { useForm } from 'react-hook-form';
import { StepFormField } from './StepFormField';
import { StepFormHeader } from './StepFormHeader';
/*
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
*/
import type { FormData, StepFormBuilderProps } from '../types';

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

  const {
    control, // connecte les champs au formulaire
    handleSubmit,
    trigger, // valide les champs manuellement
    formState: { errors, isValid: formIsValid },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues,
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
      </Portal> */}
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
});
