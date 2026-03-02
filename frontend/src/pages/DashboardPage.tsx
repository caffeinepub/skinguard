import AuthGuard from '../components/AuthGuard';
import { useGetSkinTypeDetectionResults, useGetRoutines } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Loader2, TrendingUp, Calendar, Activity, Plus } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import AnalysisHistory from '../components/AnalysisHistory';
import ProgressTracker from '../components/ProgressTracker';
import RoutineList from '../components/RoutineList';
import ReminderCard from '../components/ReminderCard';
import ExportButton from '../components/ExportButton';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const navigate = useNavigate();
  const { data: analysisHistory, isLoading: loadingHistory } = useGetSkinTypeDetectionResults();
  const { data: routines, isLoading: loadingRoutines } = useGetRoutines();

  if (loadingHistory) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-14 h-14 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-foreground tracking-tight">Your Dashboard</h1>
          <p className="text-xl text-muted-foreground">Track your skincare journey and progress</p>
        </div>
        <ExportButton type="dashboard" />
      </div>

      <ReminderCard />

      <ProgressTracker />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/results' })}>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Activity className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-foreground">Analyses</CardTitle>
                <CardDescription className="text-muted-foreground">View your skin profile</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{analysisHistory?.length || 0}</p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Total assessments</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/favorites' })}>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-md">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-foreground">Favorites</CardTitle>
                <CardDescription className="text-muted-foreground">Your saved products</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full border-2 border-border text-foreground hover:bg-accent/50 font-semibold rounded-xl transition-all duration-200">
              View Favorites
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/routines' })}>
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center shadow-md">
                <Calendar className="w-7 h-7 text-white" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-xl font-semibold text-foreground">Routines</CardTitle>
                <CardDescription className="text-muted-foreground">Your skincare schedules</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{routines?.length || 0}</p>
            <p className="text-sm text-muted-foreground mt-2 font-medium">Active routines</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">Analysis History</h2>
          </div>
          <AnalysisHistory history={analysisHistory || []} />
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold text-foreground tracking-tight">My Routines</h2>
            <Button
              size="sm"
              onClick={() => navigate({ to: '/routines/new' })}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Routine
            </Button>
          </div>
          <RoutineList routines={routines || []} />
        </div>
      </div>
    </div>
  );
}
