import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveQuestionnaireResults } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { questions } from '../utils/questionnaireData';
import { SkinType, ConcernLevel, SkinConcerns } from '../backend';
import { toast } from 'sonner';

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const navigate = useNavigate();
  const saveResults = useSaveQuestionnaireResults();

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const isLastStep = currentStep === questions.length - 1;
  const canProceed = answers[currentStep] !== -1;

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = parseInt(value);
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (canProceed && !isLastStep) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateSkinType = (ans: number[]): SkinType => {
    let oilyScore = 0;
    let dryScore = 0;
    let sensitiveScore = 0;

    // Q0: How does your skin feel a few hours after cleansing?
    // 0=very oily, 1=oily T-zone, 2=comfortable, 3=tight/dry
    if (ans[0] === 0) oilyScore += 3;
    else if (ans[0] === 1) oilyScore += 2;
    else if (ans[0] === 2) { /* normal */ }
    else if (ans[0] === 3) dryScore += 3;

    // Q1: Pore size
    // 0=large, 1=medium T-zone, 2=small, 3=very small
    if (ans[1] === 0) oilyScore += 3;
    else if (ans[1] === 1) oilyScore += 2;
    else if (ans[1] === 2) { /* normal */ }
    else if (ans[1] === 3) dryScore += 2;

    // Q2: How does your skin typically feel?
    // 0=rough/flaky/tight, 1=dry some areas, 2=smooth, 3=oily/slick
    if (ans[2] === 0) dryScore += 3;
    else if (ans[2] === 1) dryScore += 2;
    else if (ans[2] === 2) { /* normal */ }
    else if (ans[2] === 3) oilyScore += 2;

    // Q3: Reaction to new products
    // 0=often irritated, 1=sometimes, 2=rarely, 3=never
    if (ans[3] === 0) sensitiveScore += 3;
    else if (ans[3] === 1) sensitiveScore += 2;

    // Q4: Breakout frequency
    // 0=frequently T-zone, 1=occasionally, 2=rarely, 3=almost never
    if (ans[4] === 0) oilyScore += 2;
    else if (ans[4] === 1) oilyScore += 1;

    // Q5: How does skin feel by midday?
    // 0=very dry, 1=slightly dry, 2=comfortable, 3=oily
    if (ans[5] === 0) dryScore += 3;
    else if (ans[5] === 1) dryScore += 2;
    else if (ans[5] === 3) oilyScore += 2;

    if (sensitiveScore >= 4) {
      return SkinType.sensitive;
    } else if (oilyScore >= 5 && dryScore >= 4) {
      return SkinType.combination;
    } else if (oilyScore >= 5) {
      return SkinType.oily;
    } else if (dryScore >= 5) {
      return SkinType.dry;
    } else {
      return SkinType.normal;
    }
  };

  const mapAnswerToConcernLevel = (answerIndex: number): ConcernLevel => {
    // Options for concern questions are always:
    // 0 = none, 1 = low, 2 = medium, 3 = high
    switch (answerIndex) {
      case 0: return ConcernLevel.none;
      case 1: return ConcernLevel.low;
      case 2: return ConcernLevel.medium;
      case 3: return ConcernLevel.high;
      default: return ConcernLevel.none;
    }
  };

  const calculateSkinConcerns = (ans: number[]): SkinConcerns => {
    // Questions 6-9 are the concern questions
    const acneLevel = mapAnswerToConcernLevel(ans[6] ?? 0);
    const pigmentationLevel = mapAnswerToConcernLevel(ans[7] ?? 0);
    const agingLevel = mapAnswerToConcernLevel(ans[8] ?? 0);
    const drynessLevel = mapAnswerToConcernLevel(ans[9] ?? 0);

    const concernsList: string[] = [];
    if (acneLevel !== ConcernLevel.none) concernsList.push('acne');
    if (pigmentationLevel !== ConcernLevel.none) concernsList.push('pigmentation');
    if (agingLevel !== ConcernLevel.none) concernsList.push('aging');
    if (drynessLevel !== ConcernLevel.none) concernsList.push('dryness');

    return {
      acne: acneLevel,
      pigmentation: pigmentationLevel,
      aging: agingLevel,
      dryness: drynessLevel,
      concerns: concernsList,
    };
  };

  const handleSubmit = async () => {
    if (!canProceed) return;

    const detectedSkinType = calculateSkinType(answers);
    const concerns = calculateSkinConcerns(answers);

    try {
      await saveResults.mutateAsync({
        answers: answers.map((a) => BigInt(Math.max(0, a))),
        detectedSkinType,
        concerns,
      });
      navigate({ to: '/results' });
    } catch (error: any) {
      toast.error('Failed to save results. Please try again.', {
        action: {
          label: 'Retry',
          onClick: () => handleSubmit(),
        },
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-muted-foreground tracking-wide">
            Question {currentStep + 1} of {questions.length}
          </span>
          <span className="text-sm font-semibold text-primary">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 rounded-full" />
      </div>

      <Card className="border-2 border-border shadow-xl rounded-2xl">
        <CardHeader className="space-y-3">
          <CardTitle className="text-3xl font-bold text-foreground leading-tight">
            {currentQuestion.question}
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            {currentQuestion.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentStep] >= 0 ? answers[currentStep].toString() : ''}
            onValueChange={handleAnswer}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswer(index.toString())}
                  className={`flex items-center space-x-4 p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                    answers[currentStep] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:bg-accent/30 hover:border-primary/40'
                  }`}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} className="w-5 h-5" />
                  <Label
                    htmlFor={`option-${index}`}
                    className="flex-1 cursor-pointer text-foreground font-medium text-base leading-relaxed"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {saveResults.isError && (
            <div className="mt-4 flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Something went wrong saving your results. Please try again.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between mt-10">
        <Button
          onClick={handleBack}
          disabled={currentStep === 0}
          variant="outline"
          size="lg"
          className="border-2 border-border text-foreground hover:bg-accent/50 font-semibold rounded-xl transition-all duration-200"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={handleSubmit}
            disabled={!canProceed || saveResults.isPending}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            {saveResults.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Get Results
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
