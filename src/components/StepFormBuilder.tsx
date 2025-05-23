import { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { StepFormField } from './StepFormField';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { StepFormHeader } from './StepFormHeader';
import type { FormData, StepFormBuilderProps } from '../types';

export default function StepFormBuilder({
  steps,
  onSubmit,
  onError,
  defaultValues,
  externalValues,
}: StepFormBuilderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;

  const {
    control,
    handleSubmit,
    trigger,
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
    const fields = steps[currentStep]?.fields.map((field) => field.name);
    const isValid = await trigger(fields);

    if (!isValid) return;

    const currentStepData = getValues();

    if (steps[currentStep]?.onStepComplete) {
      setIsProcessing(true);
      try {
        const result =
          await steps[currentStep]?.onStepComplete(currentStepData);

        // If the handler returns data, merge it with the form data
        if (result) {
          Object.entries(result).forEach(([key, value]) => {
            setValue(key, value);
          });
        }
      } catch (error) {
        console.error('Step completion error:', error);
        onError?.({ stepError: error?.message });
        return;
      } finally {
        setIsProcessing(false);
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormError = (errors: Record<string, any>) => {
    onError?.(errors);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <StepFormHeader
          steps={steps}
          currentStep={currentStep}
          data={getValues()}
        />
        <Animated.View
          entering={SlideInRight}
          exiting={SlideOutLeft}
          key={currentStep}
          style={styles.fieldsContainer}
        >
          {steps[currentStep]?.fields.map((field) => (
            <StepFormField
              key={field.name}
              field={field}
              control={control}
              error={errors[field.name]}
            />
          ))}
        </Animated.View>
        <Animated.View
          style={styles.buttonsContainer}
          entering={FadeIn}
          exiting={FadeOut}
        >
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
              isLastStep
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
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    gap: 16,
  },
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
