import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from './ui/button';
import { LogIn, Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { identity, loginStatus, login } = useInternetIdentity();
  const navigate = useNavigate();

  const isAuthenticated = !!identity;
  const isInitializing = loginStatus === 'initializing';

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      // Optionally redirect to home
      // navigate({ to: '/' });
    }
  }, [isInitializing, isAuthenticated, navigate]);

  if (isInitializing) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto px-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto">
            <LogIn className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-emerald-900">Login Required</h2>
          <p className="text-emerald-700">
            Please log in to access your personalized skin analysis and questionnaire.
          </p>
          <Button
            onClick={login}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Login to Continue
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
