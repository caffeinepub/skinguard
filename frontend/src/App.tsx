import { RouterProvider, createRouter, createRoute, createRootRoute, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetUserProfileIntro } from './hooks/useQueries';
import { useEffect } from 'react';
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
import ProfileIntroPage from './pages/ProfileIntroPage';

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const profileIntroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile-intro',
  component: ProfileIntroPage,
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
  profileIntroRoute,
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

function ProfileRedirectHandler() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { data: userProfileIntro, isLoading: introLoading, isFetched: introFetched } = useGetUserProfileIntro();

  const isAuthenticated = !!identity;

  useEffect(() => {
    // Only redirect if authenticated and data is loaded
    if (!isAuthenticated || introLoading || !introFetched) {
      return;
    }

    // Check if user needs to complete profile intro
    const currentPath = window.location.pathname;
    
    // If user doesn't have intro profile, redirect to profile-intro
    if (userProfileIntro === null && currentPath !== '/profile-intro' && currentPath !== '/') {
      navigate({ to: '/profile-intro' });
    }
  }, [isAuthenticated, userProfileIntro, introLoading, introFetched, navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ProfileRedirectHandler />
    </>
  );
}
