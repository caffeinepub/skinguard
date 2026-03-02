import AuthGuard from '../components/AuthGuard';
import Questionnaire from '../components/Questionnaire';

export default function QuestionnairePage() {
  return (
    <AuthGuard>
      <Questionnaire />
    </AuthGuard>
  );
}
