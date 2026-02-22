import AuthGuard from '../components/AuthGuard';
import ResultsDisplay from '../components/ResultsDisplay';

export default function ResultsPage() {
  return (
    <AuthGuard>
      <ResultsDisplay />
    </AuthGuard>
  );
}
