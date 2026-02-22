import AuthGuard from '../components/AuthGuard';
import IngredientAnalysis from '../components/IngredientAnalysis';

export default function IngredientAnalysisPage() {
  return (
    <AuthGuard>
      <IngredientAnalysis />
    </AuthGuard>
  );
}
