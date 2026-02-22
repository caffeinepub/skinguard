import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useSaveSkinTypeData } from '../hooks/useQueries';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, Loader2, CheckCircle } from 'lucide-react';
import { questions } from '../utils/questionnaireData';
import { SkinType, ConcernLevel, SkinConcerns } from '../backend';

export default function Questionnaire() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const navigate = useNavigate();
  const saveSkinTypeData = useSaveSkinTypeData();

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

  const calculateSkinType = (answers: number[]): SkinType => {
    let oilyScore = 0;
    let dryScore = 0;
    let sensitiveScore = 0;

    if (answers[0] === 0) oilyScore += 3;
    else if (answers[0] === 1) oilyScore += 2;
    else if (answers[0] === 2) dryScore += 1;
    else if (answers[0] === 3) dryScore += 3;

    if (answers[1] === 0) oilyScore += 3;
    else if (answers[1] === 1) oilyScore += 2;
    else if (answers[1] === 3) dryScore += 2;

    if (answers[2] === 0) dryScore += 3;
    else if (answers[2] === 1) dryScore += 2;
    else if (answers[2] === 2) oilyScore += 2;

    if (answers[3] === 0) sensitiveScore += 3;
    else if (answers[3] === 1) sensitiveScore += 2;

    if (answers[4] === 0) oilyScore += 2;
    else if (answers[4] === 1) oilyScore += 1;

    if (answers[5] === 0) dryScore += 3;
    else if (answers[5] === 1) dryScore += 2;

    if (sensitiveScore >= 4) {
      return SkinType.sensitive;
    } else if (oilyScore > 6 && dryScore > 4) {
      return SkinType.combination;
    } else if (oilyScore > 6) {
      return SkinType.oily;
    } else if (dryScore > 6) {
      return SkinType.dry;
    } else {
      return SkinType.normal;
    }
  };

  const mapScoreToConcernLevel = (score: number): ConcernLevel => {
    if (score === 0) return ConcernLevel.none;
    if (score === 1) return ConcernLevel.low;
    if (score === 2) return ConcernLevel.medium;
    return ConcernLevel.high;
  };

  const calculateSkinConcerns = (answers: number[]): SkinConcerns => {
    const acneLevel = mapScoreToConcernLevel(answers[6] || 0);
    const pigmentationLevel = mapScoreToConcernLevel(answers[7] || 0);
    const agingLevel = mapScoreToConcernLevel(answers[8] || 0);
    const drynessLevel = mapScoreToConcernLevel(answers[9] || 0);

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
    const detectedSkinType = calculateSkinType(answers);
    const concerns = calculateSkinConcerns(answers);
    const timestamp = BigInt(Date.now());

    await saveSkinTypeData.mutateAsync({
      answers: answers.map((a) => BigInt(a)),
      detectedSkinType,
      concerns,
      timestamp,
    });

    navigate({ to: '/results' });
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
          <CardTitle className="text-3xl font-bold text-foreground leading-tight">{currentQuestion.question}</CardTitle>
          <CardDescription className="text-base text-muted-foreground leading-relaxed">{currentQuestion.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={answers[currentStep].toString()} onValueChange={handleAnswer}>
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-5 rounded-xl border-2 border-border hover:bg-accent/30 hover:border-primary/40 transition-all duration-200 cursor-pointer"
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
            disabled={!canProceed || saveSkinTypeData.isPending}
            size="lg"
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
          >
            {saveSkinTypeData.isPending ? (
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
