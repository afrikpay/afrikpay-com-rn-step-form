import type { FormStep } from '../types';

type StepFormHeaderProps = {
  steps: FormStep[];
  currentStep: number;
  data: Record<string, any>;
};

export function StepFormHeader({
  steps,
  currentStep,
  data,
}: StepFormHeaderProps) {
  return steps[currentStep]?.header?.(data);
}
