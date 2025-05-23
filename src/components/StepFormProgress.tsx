import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import type { FormStep } from '../types';

type StepFormProgressProps = {
  steps: FormStep[];
  currentStep: number;
};

export function StepFormProgress({
  steps,
  currentStep,
}: StepFormProgressProps) {
  const progress = (currentStep + 1) / steps.length;

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progress * 100}%`, {
      damping: 20,
      stiffness: 90,
    }),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.stepCount}>
          Step {currentStep + 1} of {steps.length}
        </Text>
        <Text style={styles.stepTitle}>{steps[currentStep]?.title}</Text>
        {steps[currentStep]?.description && (
          <Text style={styles.stepDescription}>
            {steps[currentStep].description}
          </Text>
        )}
      </View>

      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </View>

      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <View
            key={index}
            style={[styles.step, index <= currentStep && styles.stepCompleted]}
          >
            <View
              style={[
                styles.dot,
                index <= currentStep && styles.dotCompleted,
                index === currentStep && styles.dotCurrent,
              ]}
            />
            <Text
              style={[
                styles.stepLabel,
                index <= currentStep && styles.stepLabelCompleted,
              ]}
            >
              {step.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    marginBottom: 16,
  },
  stepCount: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 16,
    color: '#4B5563',
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  step: {
    alignItems: 'center',
    flex: 1,
  },
  stepCompleted: {},
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
    marginBottom: 8,
  },
  dotCompleted: {
    backgroundColor: '#3B82F6',
  },
  dotCurrent: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#3B82F6',
    borderWidth: 3,
    borderColor: '#BFDBFE',
  },
  stepLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  stepLabelCompleted: {
    color: '#111827',
    fontWeight: '500',
  },
});
