import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native'
import { useForm } from 'react-hook-form'
import { StepFormField } from './StepFormField'
import { StepFormProgress } from './StepFormProgress'
import { StepFormHeader } from './StepFormHeader'
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  SlideOutLeft,
} from 'react-native-reanimated'
import type { FormData, FormField, StepFormBuilderProps } from '../types'

function isFieldVisible(field: FormField, values: FormData): boolean {
  if (!field.showWhen) return true
  const { field: watchField, value, condition } = field.showWhen
  const watchValue = values[watchField]
  if (condition) return condition(watchValue)
  return watchValue === value
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const isLastStep = currentStep === steps.length - 1
  const step = steps[currentStep]

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
    ...(resolver ? { resolver } : {}),
  })

  const formValues = watch()

  useEffect(() => {
    if (externalValues) {
      Object.entries(externalValues).forEach(([name, value]) => {
        setValue(name, value)
        onExternalValueChange?.(name, value)
      })
    }
  }, [externalValues, setValue, onExternalValueChange])

  const visibleFields = useMemo(
    () => (step?.fields ?? []).filter((f) => isFieldVisible(f, formValues)),
    [step?.fields, formValues]
  )

  const isNextDisabled = useMemo(() => {
    if (!step?.isNextDisabled) return false
    if (typeof step.isNextDisabled === 'function')
      return step.isNextDisabled(formValues)
    return step.isNextDisabled
  }, [step?.isNextDisabled, formValues])

  const goToNext = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
  }, [steps.length])

  const goToPrev = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }, [])

  const handleNext = async () => {
    const fieldNames = visibleFields.map((f) => f.name)
    const isValid = await trigger(fieldNames)
    if (!isValid) return

    const data = getValues()

    if (step?.onStepComplete) {
      setIsProcessing(true)
      try {
        const result = await step.onStepComplete(data)
        if (result) {
          Object.entries(result).forEach(([key, value]) => {
            setValue(key, value)
          })
        }
      } catch (error: unknown) {
        const msg =
          error instanceof Error ? error.message : 'Unknown error'
        onError?.({ stepError: msg })
        return
      } finally {
        setIsProcessing(false)
      }
    }

    goToNext()
  }

  const handleFormSubmit = async (data: FormData) => {
    setIsProcessing(true)
    try {
      await onSubmit(data)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFormError = (error: Record<string, any>) => {
    onError?.(error)
  }

  const renderCustomStep = () => {
    if (!step?.render) return null
    return (
      <>
        {step.render(getValues(), goToNext, goToPrev)}
        {visibleFields.length > 0 &&
          visibleFields.map((field) => (
            <StepFormField
              key={field.name}
              field={field}
              control={control}
              error={errors[field.name]}
              defaultValue={defaultValues?.[field.name]}
              formValues={formValues}
            />
          ))}
      </>
    )
  }

  const buttonPositionClass =
    step?.buttonPosition === 'center'
      ? 'items-center'
      : step?.buttonPosition === 'bottom-raised'
        ? 'mb-8'
        : ''

  return (
    <View testID={testID} className="flex-1 bg-white px-6 pt-6">
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <StepFormProgress
          steps={steps}
          currentStep={currentStep}
          testID={`${testID}-progress`}
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
          className="flex-1 mt-4"
        >
          {step?.type === 'custom' ? (
            renderCustomStep()
          ) : (
            visibleFields.map((field) => (
              <StepFormField
                key={field.name}
                field={field}
                control={control}
                error={errors[field.name]}
                defaultValue={defaultValues?.[field.name]}
                formValues={formValues}
              />
            ))
          )}
        </Animated.View>

        <Animated.View
          className={`flex-row gap-3 mt-6 mb-10 ${buttonPositionClass}`}
          entering={FadeIn}
          exiting={FadeOut}
        >
          {currentStep > 0 && (
            <Pressable
              testID={`${testID}-back`}
              onPress={goToPrev}
              disabled={isProcessing}
              className="flex-1 items-center justify-center py-3.5 rounded-lg border border-neutral-300"
            >
              <Text className="text-base font-medium text-neutral-700">
                {backLabel}
              </Text>
            </Pressable>
          )}
          <Pressable
            testID={`${testID}-next`}
            onPress={
              isLastStep
                ? handleSubmit(handleFormSubmit, handleFormError)
                : handleNext
            }
            disabled={isProcessing || isNextDisabled}
            className={`flex-1 items-center justify-center py-3.5 rounded-lg ${
              isProcessing || isNextDisabled
                ? 'bg-neutral-200'
                : 'bg-primary-700'
            }`}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text
                className={`text-base font-semibold ${
                  isProcessing || isNextDisabled
                    ? 'text-neutral-400'
                    : 'text-white'
                }`}
              >
                {isLastStep ? submitLabel : nextLabel}
              </Text>
            )}
          </Pressable>
        </Animated.View>
      </ScrollView>
    </View>
  )
}
