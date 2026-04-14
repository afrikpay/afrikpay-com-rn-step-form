import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated';
import { colors } from '../tokens';
import type { FormData, FormField, StepFormBuilderProps } from '../types';
import { StepFormField } from './StepFormField';
import { StepFormHeader } from './StepFormHeader';
import { StepFormProgress } from './StepFormProgress';

function isFieldVisible(field: FormField, values: FormData): boolean {
  if (!field.showWhen) return true;
  const { field: watchField, value, condition } = field.showWhen;
  const watchValue = values[watchField];
  if (condition) return condition(watchValue);
  return watchValue === value;
}

export default function StepFormBuilder({
  steps,
  onSubmit,
  onError,
  defaultValues,
  externalValues,
  onExternalValueChange,
  resolver,
  nextLabel = 'Suivant',
  backLabel = 'Retour',
  submitLabel = 'Valider',
  testID = 'step-form',
}: StepFormBuilderProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const isLastStep = currentStep === steps.length - 1;
  const step = steps[currentStep];

  // Options de progression pour l'étape actuelle
  const progressOptions = {
    showProgress: step?.showProgress ?? true,
    showProgressBar: step?.showProgressBar ?? true,
    showStepNumbers: step?.showStepNumbers ?? true,
    showStepCount: step?.showStepCount ?? true,
  };

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    ...(resolver ? { resolver } : {}),
  });

  const formValues = watch();

  useEffect(() => {
    if (externalValues) {
      Object.entries(externalValues).forEach(([n, v]) => {
        setValue(n, v);
        onExternalValueChange?.(n, v);
      });
    }
  }, [externalValues, setValue, onExternalValueChange]);

  const visibleFields = useMemo(
    () => (step?.fields ?? []).filter((f) => isFieldVisible(f, formValues)),
    [step?.fields, formValues]
  );

  const isNextDisabled = useMemo(() => {
    if (!step?.isNextDisabled) return false;
    if (typeof step.isNextDisabled === 'function')
      return step.isNextDisabled(formValues);
    return step.isNextDisabled;
  }, [step, formValues]);

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const handleNext = async () => {
    const fieldNames = visibleFields.map((f) => f.name);
    const isValid = await trigger(fieldNames);
    if (!isValid) return;

    const data = getValues();
    if (step?.onStepComplete) {
      setIsProcessing(true);
      try {
        const result = await step.onStepComplete(data);
        if (result) {
          Object.entries(result).forEach(([key, val]) => setValue(key, val));
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown error';
        onError?.({ stepError: msg });
        return;
      } finally {
        setIsProcessing(false);
      }
    }
    goToNext();
  };

  const handleFormSubmit = async (data: FormData) => {
    setIsProcessing(true);
    try {
      await onSubmit(data);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormError = (err: Record<string, any>) => {
    onError?.(err);
  };

  const renderFields = () => {
    return visibleFields.map((field) => (
      <StepFormField
        key={field.name}
        field={field}
        control={control}
        error={errors[field.name]}
        defaultValue={defaultValues?.[field.name]}
        formValues={formValues}
      />
    ));
  };

  const btnDisabled = isProcessing || isNextDisabled;

  return (
    <View testID={testID} style={b.root}>
      <ScrollView
        style={b.scroll}
        contentContainerStyle={b.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepFormProgress
          steps={steps}
          currentStep={currentStep}
          testID={`${testID}-progress`}
          {...progressOptions}
        />

        <StepFormHeader
          steps={steps}
          currentStep={currentStep}
          data={getValues()}
        />

        <Animated.View
          entering={SlideInRight.duration(250)}
          exiting={SlideOutLeft.duration(200)}
          key={currentStep}
          style={b.fieldsWrap}
        >
          {step?.type === 'custom' && step.render ? (
            <>
              {step.render(getValues(), goToNext, goToPrev)}
              {visibleFields.length > 0 && renderFields()}
            </>
          ) : (
            renderFields()
          )}
        </Animated.View>

        <Animated.View
          style={[
            b.buttonsRow,
            step?.buttonPosition === 'center' && b.buttonsCenter,
            step?.buttonPosition === 'bottom-raised' && b.buttonsRaised,
          ]}
          entering={FadeIn}
          exiting={FadeOut}
        >
          {currentStep > 0 && (
            <Pressable
              testID={`${testID}-back`}
              onPress={goToPrev}
              disabled={isProcessing}
              style={b.backBtn}
            >
              <Text style={b.backText}>{backLabel}</Text>
            </Pressable>
          )}
          <Pressable
            testID={`${testID}-next`}
            onPress={
              isLastStep
                ? handleSubmit(handleFormSubmit, handleFormError)
                : handleNext
            }
            disabled={btnDisabled}
            style={[
              b.nextBtn,
              btnDisabled ? b.nextBtnDisabled : b.nextBtnActive,
            ]}
          >
            {isProcessing ? (
              <ActivityIndicator color={colors.white} size="small" />
            ) : (
              <Text style={[b.nextText, btnDisabled && b.nextTextDisabled]}>
                {isLastStep ? submitLabel : nextLabel}
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const b = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  scroll: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30, // Espace pour éviter que le contenu colle au footer
  },
  fieldsWrap: {
    marginTop: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  buttonsCenter: { alignItems: 'center' },
  buttonsRaised: { marginBottom: 32 },
  backBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Réduit de 14 à 10
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.neutral300,
  },
  backText: { fontSize: 16, fontWeight: '500', color: colors.neutral700 },
  nextBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10, // Réduit de 14 à 10
    borderRadius: 8,
  },
  nextBtnActive: { backgroundColor: colors.primary700 },
  nextBtnDisabled: { backgroundColor: colors.neutral200 },
  nextText: { fontSize: 16, fontWeight: '600', color: colors.white },
  nextTextDisabled: { color: colors.neutral400 },
});
