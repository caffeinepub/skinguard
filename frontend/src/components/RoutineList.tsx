import { SkincareRoutine } from '../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Trash2, Calendar } from 'lucide-react';
import { useDeleteRoutine } from '../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';

interface RoutineListProps {
  routines: SkincareRoutine[];
}

export default function RoutineList({ routines }: RoutineListProps) {
  const deleteRoutine = useDeleteRoutine();
  const navigate = useNavigate();

  if (routines.length === 0) {
    return (
      <Card className="border-emerald-200">
        <CardContent className="pt-12 pb-12 text-center">
          <Calendar className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
          <p className="text-emerald-600 mb-4">No routines created yet</p>
          <Button
            onClick={() => navigate({ to: '/routines/new' })}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            Create Your First Routine
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleDelete = async (routineName: string) => {
    if (confirm(`Are you sure you want to delete "${routineName}"?`)) {
      await deleteRoutine.mutateAsync(routineName);
    }
  };

  return (
    <div className="space-y-4">
      {routines.map((routine, index) => (
        <Card key={index} className="border-emerald-200 hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-emerald-900">{routine.name}</CardTitle>
                <CardDescription>{routine.steps.length} steps</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(routine.name)}
                disabled={deleteRoutine.isPending}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {routine.steps
                .sort((a, b) => Number(a.order) - Number(b.order))
                .map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded bg-emerald-50">
                    <Badge className="bg-emerald-600 text-white">{Number(step.order)}</Badge>
                    <span className="flex-1 text-sm text-emerald-900">{step.productName}</span>
                    <span className="text-xs text-emerald-600">Every {Number(step.frequency)} days</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
