import AuthGuard from '../components/AuthGuard';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Save } from 'lucide-react';
import { useSaveRoutine, useGetProductRecommendations, useGetLatestSkinType, useGetSkinTypeDetectionResults, useGetFavorites } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { SkincareRoutine, RoutineStep } from '../backend';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

export default function RoutineBuilderPage() {
  return (
    <AuthGuard>
      <RoutineBuilderContent />
    </AuthGuard>
  );
}

function RoutineBuilderContent() {
  const navigate = useNavigate();
  const [routineName, setRoutineName] = useState('');
  const [steps, setSteps] = useState<Array<{ productName: string; frequency: number }>>([]);
  
  const { data: latestSkinType } = useGetLatestSkinType();
  const { data: allResults } = useGetSkinTypeDetectionResults();
  const latestResult = allResults && allResults.length > 0 ? allResults[0] : null;
  
  const { data: recommendedProducts } = useGetProductRecommendations(
    latestSkinType || null,
    latestResult?.concerns || null
  );
  const { data: favorites } = useGetFavorites();
  
  const saveRoutine = useSaveRoutine();

  const availableProducts = [
    ...(recommendedProducts || []).map((p) => p.name),
    ...(favorites || []),
  ].filter((name, index, self) => self.indexOf(name) === index);

  const addStep = () => {
    setSteps([...steps, { productName: '', frequency: 1 }]);
  };

  const removeStep = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, field: 'productName' | 'frequency', value: string | number) => {
    const newSteps = [...steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setSteps(newSteps);
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index > 0) {
      const newSteps = [...steps];
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
      setSteps(newSteps);
    } else if (direction === 'down' && index < steps.length - 1) {
      const newSteps = [...steps];
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
      setSteps(newSteps);
    }
  };

  const handleSave = async () => {
    if (!routineName.trim()) {
      alert('Please enter a routine name');
      return;
    }

    if (steps.length === 0) {
      alert('Please add at least one step');
      return;
    }

    if (steps.some((s) => !s.productName)) {
      alert('Please select a product for all steps');
      return;
    }

    const routine: SkincareRoutine = {
      name: routineName,
      steps: steps.map((step, index) => ({
        productName: step.productName,
        order: BigInt(index + 1),
        frequency: BigInt(step.frequency),
      })),
    };

    await saveRoutine.mutateAsync(routine);
    navigate({ to: '/routines' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Create Skincare Routine</h1>
        <p className="text-emerald-600">Build a personalized routine with your favorite products</p>
      </div>

      <Card className="border-emerald-200 shadow-lg mb-6">
        <CardHeader>
          <CardTitle className="text-emerald-900">Routine Details</CardTitle>
          <CardDescription>Give your routine a name and add products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="routineName" className="text-emerald-900 mb-2 block">
              Routine Name
            </Label>
            <Input
              id="routineName"
              value={routineName}
              onChange={(e) => setRoutineName(e.target.value)}
              placeholder="e.g., Morning Routine, Night Routine"
              className="border-emerald-200 focus:border-emerald-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-emerald-900">Routine Steps</Label>
              <Button
                onClick={addStep}
                size="sm"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Step
              </Button>
            </div>

            {steps.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-emerald-200 rounded-lg">
                <p className="text-emerald-600">No steps added yet. Click "Add Step" to begin.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <Card key={index} className="border-emerald-200">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <Badge className="bg-emerald-600 text-white mt-2">{index + 1}</Badge>
                        <div className="flex-1 space-y-3">
                          <div>
                            <Label className="text-emerald-900 text-sm mb-1 block">Product</Label>
                            <Select
                              value={step.productName}
                              onValueChange={(value) => updateStep(index, 'productName', value)}
                            >
                              <SelectTrigger className="border-emerald-200">
                                <SelectValue placeholder="Select a product" />
                              </SelectTrigger>
                              <SelectContent>
                                {availableProducts.map((product) => (
                                  <SelectItem key={product} value={product}>
                                    {product}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label className="text-emerald-900 text-sm mb-1 block">
                              Frequency (every X days)
                            </Label>
                            <Input
                              type="number"
                              min="1"
                              value={step.frequency}
                              onChange={(e) => updateStep(index, 'frequency', parseInt(e.target.value) || 1)}
                              className="border-emerald-200"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(index, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveStep(index, 'down')}
                            disabled={index === steps.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate({ to: '/routines' })}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saveRoutine.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {saveRoutine.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Routine
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
