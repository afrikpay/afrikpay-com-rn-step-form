import { View, Text } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated'
import { Check } from 'lucide-react-native'
import type { FormStep } from '../types'

type StepFormProgressProps = {
  steps: FormStep[]
  currentStep: number
  testID?: string
}

export function StepFormProgress({
  steps,
  currentStep,
  testID = 'step-form-progress',
}: StepFormProgressProps) {
  const progress = (currentStep + 1) / steps.length

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progress * 100}%`, {
      damping: 20,
      stiffness: 90,
    }),
  }))

  const step = steps[currentStep]

  return (
    <View testID={testID} className="mb-6">
      <View className="mb-4">
        <Text className="text-sm text-neutral-500 mb-1">
          {currentStep + 1} / {steps.length}
        </Text>
        {step?.title && (
          <Text className="text-2xl font-semibold text-neutral-900 mb-1">
            {step.title}
          </Text>
        )}
        {step?.description && (
          <Text className="text-base text-neutral-600">
            {step.description}
          </Text>
        )}
      </View>

      <View className="h-1 bg-neutral-200 rounded-full mb-6 overflow-hidden">
        <Animated.View
          className="h-full bg-primary-700 rounded-full"
          style={progressStyle}
        />
      </View>

      <View className="flex-row justify-between px-2">
        {steps.map((s, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isLast = index === steps.length - 1

          return (
            <View key={index} className="flex-row items-center flex-1">
              <View className="items-center">
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center ${
                    isCompleted
                      ? 'bg-success-600'
                      : isCurrent
                        ? 'bg-primary-700'
                        : 'bg-neutral-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check size={16} color="#fff" />
                  ) : (
                    <Text
                      className={`text-sm font-semibold ${
                        isCurrent ? 'text-white' : 'text-neutral-500'
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                {s.title && (
                  <Text
                    className={`mt-2 text-xs text-center ${
                      isCurrent
                        ? 'text-primary-700 font-medium'
                        : 'text-neutral-500'
                    }`}
                    numberOfLines={1}
                  >
                    {s.title}
                  </Text>
                )}
              </View>
              {!isLast && (
                <View
                  className={`flex-1 h-0.5 mx-1 ${
                    index < currentStep ? 'bg-success-600' : 'bg-neutral-300'
                  }`}
                />
              )}
            </View>
          )
        })}
      </View>
    </View>
  )
}
