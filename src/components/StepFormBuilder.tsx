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
import { Button } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { StepFormField } from './StepFormField';
import type { FormData, FormStep, StepFormBuilderProps } from '../types';
import { StepFormHeader } from './StepFormHeader';
import { COLORS } from '../../constantes/color';

// ─── ButtonsRow extrait hors du composant parent (fix: react/no-unstable-nested-components) ───

interface ButtonsRowProps {
  currentStep: number;
  isLastStep: boolean;
  isProcessing: boolean;
  isNextDisabled: boolean;
  onBack: () => void;
  onNext: () => void | Promise<void>;
}

function ButtonsRow({
  currentStep,
  isLastStep,
  isProcessing,
  isNextDisabled,
  onBack,
  onNext,
}: ButtonsRowProps) {
  return (
    <View style={styles.buttonsRow}>
      {currentStep > 0 && (
        <Button mode="outlined" onPress={onBack} style={styles.button}>
          Back
        </Button>
      )}
      <Button
        mode="contained"
        onPress={onNext}
        style={[
          styles.button,
          styles.primaryButton,
          isNextDisabled && styles.disabledButton,
        ]}
        disabled={isProcessing || isNextDisabled}
      >
        <Text
          style={[
            isNextDisabled ? styles.textDisabled : styles.textEnabled,
            styles.text1,
          ]}
        >
          {isLastStep ? 'Valider' : 'Suivant'}
        </Text>
      </Button>
    </View>
  );
}

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
  const formValues = watchedValues;
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

  // Props partagées pour toutes les instances de ButtonsRow
  const buttonsRowProps: ButtonsRowProps = {
    currentStep,
    isLastStep,
    isProcessing,
    isNextDisabled,
    onBack: handleBack,
    onNext: isLastStep
      ? handleSubmit(handleFormSubmit, handleFormError)
      : handleNext,
  };

  return (
    // keyboardAvoidingView: pousse le contenue au dessus du clavier

    <KeyboardAvoidingView
      style={styles.keyboardAvoidingView}
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
            data={formValues}
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
              if (field.showWhen) {
                const {
                  field: watchedField,
                  value: expectedValue,
                  condition,
                } = field.showWhen;

                // On récupère la valeur actuelle ou une chaîne vide par défaut
                const actualValue = watchedValues?.[watchedField];

                if (condition) {
                  if (!condition(actualValue)) return null;
                } else if (actualValue !== expectedValue) {
                  return null;
                }
              }

              return (
                <StepFormField
                  key={field.name}
                  field={field}
                  control={control}
                  error={errors[field.name]}
                  defaultValue={defaultValues?.[field.name]}
                  //formValues={watchedValues}
                />
              );
            })}
          </Animated.View>

          {!isFixedPosition && (
            <View style={styles.buttonsContainerInline}>
              <ButtonsRow {...buttonsRowProps} />
            </View>
          )}
        </ScrollView>

        {buttonPosition === 'bottom' && (
          <View style={styles.buttonsContainerBottom}>
            <ButtonsRow {...buttonsRowProps} />
          </View>
        )}

        {buttonPosition === 'bottom-raised' && (
          <View style={styles.buttonsContainerBottomRaised}>
            <ButtonsRow {...buttonsRowProps} />
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
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
  contentContainer: {
    flexGrow: 1,
  },
  contentContainerWithFixedButtons: {
    paddingBottom: 100,
  }, // espace pour les boutons fixes
  fieldsContainer: {
    marginTop: 62,
  },
  buttonsContainerInline: {
    marginTop: 24,
  },
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
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.8,
  },
  contentContainerNatural: {},
  contentContainerFixed: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  text1: {
    fontSize: 16,
  },
  textEnabled: {
    color: COLORS.while,
  },
  textDisabled: {
    color: '#999',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
});
