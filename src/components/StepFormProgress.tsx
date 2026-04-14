import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import type { FormStep } from '../types';
import { colors } from '../tokens';

type StepFormProgressProps = {
  steps: FormStep[];
  currentStep: number;
  testID?: string;
  showProgress?: boolean;
  showProgressBar?: boolean;
  showStepNumbers?: boolean;
  showStepCount?: boolean;
  // Props pour personnaliser le titre
  titleStyle?: {
    fontSize?: number;
    fontWeight?:
      | 'normal'
      | 'bold'
      | '100'
      | '200'
      | '300'
      | '400'
      | '500'
      | '600'
      | '700'
      | '800'
      | '900';
    color?: string;
    numberOfLines?: number;
  };
};

export function StepFormProgress({
  steps,
  currentStep,
  testID = 'step-form-progress',
  showProgress = true,
  showProgressBar = true,
  showStepNumbers = true,
  showStepCount = true,
  titleStyle,
}: StepFormProgressProps) {
  const progress = (currentStep + 1) / steps.length;

  const progressStyle = useAnimatedStyle(() => ({
    width: withSpring(`${progress * 100}%`, { damping: 20, stiffness: 90 }),
  }));

  const step = steps[currentStep];

  // Si toute la progression est masquée, ne rien afficher
  if (!showProgress) {
    return null;
  }

  // Calculer l'espace en bas en fonction des éléments visibles
  const hasVisibleElements =
    showStepCount || showProgressBar || showStepNumbers;
  const marginBottom = hasVisibleElements ? 2 : 8; // Réduit si seulement le titre est visible

  return (
    <View testID={testID} style={[p.container, { marginBottom }]}>
      <View style={[p.header, { marginBottom: showProgressBar ? 16 : 8 }]}>
        {showStepCount && (
          <Text style={p.stepCount}>
            {currentStep + 1} / {steps.length}
          </Text>
        )}
        {step?.title && (
          <Text
            style={[p.title, titleStyle]}
            numberOfLines={titleStyle?.numberOfLines}
          >
            {step.title}
          </Text>
        )}
        {step?.description && (
          <Text style={p.description}>{step.description}</Text>
        )}
      </View>

      {showProgressBar && (
        <View style={p.barTrack}>
          <Animated.View style={[p.barFill, progressStyle]} />
        </View>
      )}

      {showStepNumbers && (
        <View style={p.dotsRow}>
          {steps.map((st, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;
            const isLast = index === steps.length - 1;

            return (
              <View key={index} style={p.dotGroup}>
                <View style={p.dotCenter}>
                  <View
                    style={[
                      p.dot,
                      isCompleted && p.dotCompleted,
                      isCurrent && p.dotCurrent,
                      !isCompleted && !isCurrent && p.dotInactive,
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={16} color={colors.white} />
                    ) : (
                      <Text
                        style={[
                          p.dotNum,
                          isCurrent ? p.dotNumCurrent : p.dotNumInactive,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    )}
                  </View>
                  {st.title ? (
                    <Text
                      style={[p.dotLabel, isCurrent && p.dotLabelCurrent]}
                      numberOfLines={1}
                    >
                      {st.title}
                    </Text>
                  ) : null}
                </View>
                {!isLast && (
                  <View
                    style={[
                      p.connector,
                      index < currentStep
                        ? p.connectorDone
                        : p.connectorPending,
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const p = StyleSheet.create({
  container: { marginBottom: 24 },
  header: { marginBottom: 16 },
  stepCount: { fontSize: 14, color: colors.neutral500, marginBottom: 4 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.neutral900,
    marginBottom: 4,
  },
  description: { fontSize: 16, color: colors.neutral700 },
  barTrack: {
    height: 4,
    backgroundColor: colors.neutral200,
    borderRadius: 2,
    marginBottom: 24,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: colors.primary700,
    borderRadius: 2,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dotGroup: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  dotCenter: { alignItems: 'center' },
  dot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCompleted: { backgroundColor: colors.success600 },
  dotCurrent: { backgroundColor: colors.primary700 },
  dotInactive: { backgroundColor: colors.neutral300 },
  dotNum: { fontSize: 14, fontWeight: '600' },
  dotNumCurrent: { color: colors.white },
  dotNumInactive: { color: colors.neutral500 },
  dotLabel: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
    color: colors.neutral500,
  },
  dotLabelCurrent: { color: colors.primary700, fontWeight: '500' },
  connector: { flex: 1, height: 2, marginHorizontal: 4 },
  connectorDone: { backgroundColor: colors.success600 },
  connectorPending: { backgroundColor: colors.neutral300 },
});
