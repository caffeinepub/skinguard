import AuthGuard from '../components/AuthGuard';
import { useGetRoutines } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Loader2, Plus, Calendar } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import RoutineList from '../components/RoutineList';

export default function RoutinesPage() {
  return (
    <AuthGuard>
      <RoutinesContent />
    </AuthGuard>
  );
}

function RoutinesContent() {
  const navigate = useNavigate();
  const { data: routines, isLoading } = useGetRoutines();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Loading your routines...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-emerald-900 mb-2">My Routines</h1>
          <p className="text-emerald-600">Manage your skincare schedules</p>
        </div>
        <Button
          onClick={() => navigate({ to: '/routines/new' })}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Routine
        </Button>
      </div>

      <RoutineList routines={routines || []} />
    </div>
  );
}
