import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './hooks/useGetCallerUserProfile';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import IngredientAnalysisPage from './pages/IngredientAnalysisPage';
import DashboardPage from './pages/DashboardPage';
import FavoritesPage from './pages/FavoritesPage';
import RoutineBuilderPage from './pages/RoutineBuilderPage';
import RoutinesPage from './pages/RoutinesPage';
import ComparisonPage from './pages/ComparisonPage';
import ResourcesPage from './pages/ResourcesPage';
import ProductJournalPage from './pages/ProductJournalPage';
import IngredientDictionaryPage from './pages/IngredientDictionaryPage';
import ProductSuitabilityCheckerPage from './pages/ProductSuitabilityCheckerPage';
import DBMSDocumentationPage from './pages/DBMSDocumentationPage';
import ProfileSetupModal from './components/ProfileSetupModal';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const questionnaireRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/questionnaire',
  component: QuestionnairePage,
});

const resultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/results',
  component: ResultsPage,
});

const ingredientAnalysisRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ingredient-analysis',
  component: IngredientAnalysisPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: DashboardPage,
});

const favoritesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/favorites',
  component: FavoritesPage,
});

const routinesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routines',
  component: RoutinesPage,
});

const routineBuilderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/routines/new',
  component: RoutineBuilderPage,
});

const comparisonRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/compare',
  component: ComparisonPage,
});

const resourcesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/resources',
  component: ResourcesPage,
});

const journalRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/journal',
  component: ProductJournalPage,
});

const ingredientDictionaryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ingredients',
  component: IngredientDictionaryPage,
});

const productCheckerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product-checker',
  component: ProductSuitabilityCheckerPage,
});

const dbmsDocsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dbms-docs',
  component: DBMSDocumentationPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  questionnaireRoute,
  resultsRoute,
  ingredientAnalysisRoute,
  dashboardRoute,
  favoritesRoute,
  routinesRoute,
  routineBuilderRoute,
  comparisonRoute,
  resourcesRoute,
  journalRoute,
  ingredientDictionaryRoute,
  productCheckerRoute,
  dbmsDocsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  
  const isAuthenticated = !!identity;
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  return (
    <>
      <RouterProvider router={router} />
      {showProfileSetup && <ProfileSetupModal />}
    </>
  );
}
