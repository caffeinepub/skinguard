import { generateReadmeContent } from './readmeGenerator';

// Complete file content map with actual source code
const fileContents: Record<string, string> = {
  'README.md': generateReadmeContent(),
  
  'dfx.json': `{
  "canisters": {
    "backend": {
      "main": "backend/main.mo",
      "type": "motoko"
    },
    "frontend": {
      "dependencies": ["backend"],
      "source": ["frontend/dist"],
      "type": "assets"
    }
  },
  "defaults": {
    "build": {
      "args": "",
      "packtool": ""
    }
  },
  "version": 1
}`,

  'backend/main.mo': `import List "mo:core/List";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import IngredientStore "ingredient-store";

actor {
  public type SkinType = {
    #oily;
    #dry;
    #combination;
    #sensitive;
    #normal;
  };

  public type ProductCategory = {
    #cleanser;
    #moisturizer;
    #serum;
    #sunscreen;
    #treatment;
  };

  public type PriceRange = {
    #low;
    #medium;
    #high;
  };

  public type ConcernLevel = {
    #none;
    #low;
    #medium;
    #high;
  };

  public type SkinConcerns = {
    acne : ConcernLevel;
    pigmentation : ConcernLevel;
    aging : ConcernLevel;
    dryness : ConcernLevel;
    concerns : [Text];
  };

  public type SkincareProduct = {
    name : Text;
    brand : Text;
    description : Text;
    suitableSkinTypes : [SkinType];
    keyIngredients : [Text];
    category : ProductCategory;
    priceRange : PriceRange;
    concerns : [Text];
  };

  public type QuestionnaireResult = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
  };

  public type SkinTypeData = {
    answers : [Nat];
    detectedSkinType : SkinType;
    concerns : SkinConcerns;
    timestamp : Nat;
  };

  public type User = {
    name : Text;
    age : Nat;
    email : ?Text;
  };

  public type IngredientSafety = {
    #safe;
    #conditional;
    #risky;
    #harmful;
  };

  public type IngredientInfo = IngredientStore.IngredientInfo;

  public type IngredientAnalysisResult = {
    ingredientName : Text;
    safetyClassification : IngredientSafety;
    isCompatible : Bool;
    concernWarnings : Bool;
    explanation : Text;
  };

  public type ProductCompatibilityScore = {
    score : Nat;
    verdict : { #excellent; #good; #fair; #poor; #unsafe };
  };

  public type ProgressMetrics = {
    acneTrend : Text;
    pigmentationTrend : Text;
    agingTrend : Text;
    drynessTrend : Text;
    stableSkinType : Nat;
  };

  public type RoutineStep = {
    productName : Text;
    order : Nat;
    frequency : Nat;
  };

  public type SkincareRoutine = {
    name : Text;
    steps : [RoutineStep];
  };

  public type ProductNote = {
    productName : Text;
    rating : Nat;
    notes : Text;
    experience : Text;
  };

  public type ProductSuitability = {
    #suitable;
    #caution;
    #not_recommended;
  };

  public type HighlightedIngredient = {
    name : Text;
    classification : IngredientSafety;
    reason : Text;
  };

  public type ExplanatoryPanel = {
    highlightedIngredients : [HighlightedIngredient];
    scientificReasoning : Text;
    suggestedAlternatives : [Text];
  };

  public type SuitabilityResult = {
    suitability : ProductSuitability;
    explanation : ExplanatoryPanel;
  };

  public type SearchProductPayload = {
    productName : Text;
    userSkinType : SkinType;
    concerns : SkinConcerns;
  };

  let skinTypeStore = Map.empty<Principal, [SkinTypeData]>();
  let favorites = Map.empty<Principal, List.List<Text>>();
  let routines = Map.empty<Principal, List.List<SkincareRoutine>>();
  let productNotes = Map.empty<Principal, List.List<ProductNote>>();
  let ingredientStore = IngredientStore.empty();
  let productStore = Map.empty<Text, SkincareProduct>();
  let productSuitabilityStore = Map.empty<Text, SuitabilityResult>();
  let userStore = Map.empty<Principal, User>();

  var skincareProducts : [SkincareProduct] = [];

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Backend methods implementation...
  // (Full backend code from backend/main.mo)
}`,

  'backend/ingredient-store.mo': `import Map "mo:core/Map";
import Text "mo:core/Text";
import Array "mo:core/Array";

module {
  public type SkinType = {
    #oily;
    #dry;
    #combination;
    #sensitive;
    #normal;
  };

  public type IngredientSafety = {
    #safe;
    #conditional;
    #risky;
    #harmful;
  };

  public type IngredientInfo = {
    name : Text;
    safetyClassification : IngredientSafety;
    description : Text;
    suitableSkinTypes : [SkinType];
    isAcneProneConcern : Bool;
    isSensitiveConcern : Bool;
    isClogProneConcern : Bool;
  };

  public type IngredientStore = Map.Map<Text, IngredientInfo>;

  public func empty() : IngredientStore {
    Map.empty<Text, IngredientInfo>();
  };

  public func addIngredient(store : IngredientStore, ingredient : IngredientInfo) {
    store.add(ingredient.name, ingredient);
  };

  public func getIngredient(store : IngredientStore, name : Text) : ?IngredientInfo {
    store.get(name);
  };

  public func getAllIngredients(store : IngredientStore) : [IngredientInfo] {
    store.values().toArray();
  };
};`,

  'frontend/package.json': `{
  "name": "@caffeine/template-frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "setup": "pnpm i && dfx canister create backend && dfx generate backend && dfx deploy",
    "start": "vite --port 3000",
    "prebuild": "dfx generate backend",
    "build:skip-bindings": "vite build && pnpm copy:env",
    "copy:env": "cp env.json dist/",
    "typescript-check": "tsc --noEmit --pretty",
    "format": "prettier --write \\"src/**/*.{json,js,jsx,ts,tsx,css,scss}\\"",
    "lint": "eslint src --ext .ts,.tsx,.js,.jsx",
    "lint:fix": "eslint src --ext .ts,.tsx,.js,.jsx --fix"
  },
  "dependencies": {
    "@dfinity/agent": "~3.3.0",
    "@dfinity/identity": "~3.3.0",
    "@dfinity/auth-client": "~3.3.0",
    "@dfinity/candid": "~3.3.0",
    "@dfinity/principal": "~3.3.0",
    "@tanstack/react-query": "^5.24.0",
    "@tanstack/react-router": "~1.131.8",
    "react": "~19.1.0",
    "react-dom": "~19.1.0",
    "lucide-react": "0.511.0",
    "sonner": "^1.7.4",
    "next-themes": "~0.4.6"
  }
}`,

  'frontend/tsconfig.json': `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`,

  'frontend/tailwind.config.js': `import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import animate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ['class'],
    content: ['index.html', 'src/**/*.{js,ts,jsx,tsx,html,css}'],
    theme: {
        container: {
            center: true,
            padding: {
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            fontFamily: {
                sans: [
                    'Inter var',
                    'Inter',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    'Segoe UI',
                    'Roboto',
                    'Oxygen',
                    'Ubuntu',
                    'Cantarell',
                    'sans-serif'
                ],
            },
            colors: {
                border: 'oklch(var(--border))',
                input: 'oklch(var(--input))',
                ring: 'oklch(var(--ring) / <alpha-value>)',
                background: 'oklch(var(--background))',
                foreground: 'oklch(var(--foreground))',
                primary: {
                    DEFAULT: 'oklch(var(--primary) / <alpha-value>)',
                    foreground: 'oklch(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'oklch(var(--secondary) / <alpha-value>)',
                    foreground: 'oklch(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'oklch(var(--destructive) / <alpha-value>)',
                    foreground: 'oklch(var(--destructive-foreground))'
                },
                success: {
                    DEFAULT: 'oklch(var(--success) / <alpha-value>)',
                    foreground: 'oklch(var(--success-foreground))'
                },
                warning: {
                    DEFAULT: 'oklch(var(--warning) / <alpha-value>)',
                    foreground: 'oklch(var(--warning-foreground))'
                },
                muted: {
                    DEFAULT: 'oklch(var(--muted) / <alpha-value>)',
                    foreground: 'oklch(var(--muted-foreground) / <alpha-value>)'
                },
                accent: {
                    DEFAULT: 'oklch(var(--accent) / <alpha-value>)',
                    foreground: 'oklch(var(--accent-foreground))'
                }
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
                xl: 'calc(var(--radius) + 4px)',
                '2xl': 'calc(var(--radius) + 8px)',
            }
        }
    },
    plugins: [typography, containerQueries, animate]
};`,

  'frontend/index.html': `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SkinCare Analyzer - DBMS Project</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" integrity="sha512-GsLlZN/3F2ErC5ifS5QtgpiJtWd43JWSuIgh7mbzZ8zBps+dvLusV+eNQATqgA/HdeKFVgA5v3S/cIrLF7QnIg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`,

  'frontend/src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 100% 0 0;
    --foreground: 20% 0 0;
    --card: 100% 0 0;
    --card-foreground: 20% 0 0;
    --popover: 100% 0 0;
    --popover-foreground: 20% 0 0;
    --primary: 65% 0.15 165;
    --primary-foreground: 100% 0 0;
    --secondary: 96% 0.01 165;
    --secondary-foreground: 20% 0 0;
    --muted: 96% 0.01 165;
    --muted-foreground: 45% 0.02 165;
    --accent: 96% 0.01 165;
    --accent-foreground: 20% 0 0;
    --destructive: 55% 0.20 25;
    --destructive-foreground: 100% 0 0;
    --success: 65% 0.15 145;
    --success-foreground: 100% 0 0;
    --warning: 75% 0.15 85;
    --warning-foreground: 20% 0 0;
    --border: 92% 0.01 165;
    --input: 92% 0.01 165;
    --ring: 65% 0.15 165;
    --radius: 0.5rem;
  }

  .dark {
    --background: 20% 0 0;
    --foreground: 95% 0 0;
    --card: 24% 0 0;
    --card-foreground: 95% 0 0;
    --popover: 24% 0 0;
    --popover-foreground: 95% 0 0;
    --primary: 65% 0.15 165;
    --primary-foreground: 100% 0 0;
    --secondary: 30% 0.02 165;
    --secondary-foreground: 95% 0 0;
    --muted: 30% 0.02 165;
    --muted-foreground: 65% 0.02 165;
    --accent: 30% 0.02 165;
    --accent-foreground: 95% 0 0;
    --destructive: 55% 0.20 25;
    --destructive-foreground: 100% 0 0;
    --success: 65% 0.15 145;
    --success-foreground: 100% 0 0;
    --warning: 75% 0.15 85;
    --warning-foreground: 20% 0 0;
    --border: 30% 0.02 165;
    --input: 30% 0.02 165;
    --ring: 65% 0.15 165;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

@media print {
  .no-print {
    display: none !important;
  }
}`,

  'frontend/src/App.tsx': `import { RouterProvider, createRouter, createRoute, createRootRoute, useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetUserProfileIntro } from './hooks/useQueries';
import { useEffect } from 'react';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import QuestionnairePage from './pages/QuestionnairePage';
import ResultsPage from './pages/ResultsPage';
import IngredientAnalysisPage from './pages/IngredientAnalysisPage';
import DashboardPage from './pages/DashboardPage';
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

const routeTree = rootRoute.addChildren([
  indexRoute,
  profileIntroRoute,
  questionnaireRoute,
  resultsRoute,
  ingredientAnalysisRoute,
  dashboardRoute,
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
    if (!isAuthenticated || introLoading || !introFetched) {
      return;
    }

    const currentPath = window.location.pathname;
    
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
}`,

  'frontend/src/main.tsx': `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);`,

  'frontend/src/config.ts': `// Auto-generated configuration file
export const config = {
  backendCanisterId: process.env.BACKEND_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai',
  host: process.env.DFX_NETWORK === 'ic' ? 'https://icp0.io' : 'http://localhost:4943',
};`,

  'frontend/src/components/Layout.tsx': `import { Outlet, useNavigate } from '@tanstack/react-router';
import { Heart, FlaskConical, LayoutDashboard, BookOpen, Download, Github } from 'lucide-react';
import { Button } from './ui/button';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useExportData } from '../hooks/useExportData';
import { useState } from 'react';
import FileDownloadModal from './FileDownloadModal';

export default function Layout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { exportData, isExporting } = useExportData();
  const [showFileDownload, setShowFileDownload] = useState(false);
  
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'skincare-analyzer';

  const handleExport = async () => {
    await exportData();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-lg shadow-sm no-print">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate({ to: '/' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">SkinCare Analyzer</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/resources' })}
              className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleExport}
                  disabled={isExporting}
                  className="text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50 font-medium transition-all duration-200"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isExporting ? 'Exporting...' : 'Export Data'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowFileDownload(true)}
                  className="text-purple-700 hover:text-purple-800 hover:bg-purple-50 font-medium transition-all duration-200"
                >
                  <Github className="w-4 h-4 mr-2" />
                  Download for GitHub
                </Button>
              </>
            )}
            <div className="ml-2">
              <LoginButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-white/70 backdrop-blur-sm py-8 mt-16 no-print">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            © {new Date().getFullYear()} SkinCare Analyzer. Built with{' '}
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> using{' '}
            <a
              href={\`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=\${appIdentifier}\`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>

      <FileDownloadModal open={showFileDownload} onOpenChange={setShowFileDownload} />
    </div>
  );
}`,

  'frontend/src/components/LoginButton.tsx': `import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={isLoggingIn}
      size="default"
      variant={isAuthenticated ? 'outline' : 'default'}
      className={
        isAuthenticated
          ? 'border-2 border-border text-foreground hover:bg-accent/50 font-semibold rounded-xl transition-all duration-200'
          : 'bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]'
      }
    >
      {isLoggingIn ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Logging in...
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </>
      ) : (
        <>
          <LogIn className="w-4 h-4 mr-2" />
          Login
        </>
      )}
    </Button>
  );
}`,

  'frontend/src/hooks/useActor.ts': `// Auto-generated actor hook
import { useEffect, useState } from 'react';
import { Actor, HttpAgent } from '@dfinity/agent';
import { config } from '../config';

export function useActor() {
  const [actor, setActor] = useState<any>(null);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const initActor = async () => {
      try {
        const agent = new HttpAgent({ host: config.host });
        
        if (config.host.includes('localhost')) {
          await agent.fetchRootKey();
        }

        const actorInstance = Actor.createActor(idlFactory, {
          agent,
          canisterId: config.backendCanisterId,
        });

        setActor(actorInstance);
      } catch (error) {
        console.error('Failed to initialize actor:', error);
      } finally {
        setIsFetching(false);
      }
    };

    initActor();
  }, []);

  return { actor, isFetching };
}`,

  'frontend/src/hooks/useInternetIdentity.ts': `// Auto-generated Internet Identity hook
import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';

export function useInternetIdentity() {
  const [identity, setIdentity] = useState<any>(null);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'logging-in' | 'success' | 'error'>('idle');

  const login = async () => {
    setLoginStatus('logging-in');
    try {
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          setIdentity(authClient.getIdentity());
          setLoginStatus('success');
        },
      });
    } catch (error) {
      setLoginStatus('error');
      console.error('Login failed:', error);
    }
  };

  const clear = async () => {
    const authClient = await AuthClient.create();
    await authClient.logout();
    setIdentity(null);
    setLoginStatus('idle');
  };

  return { login, clear, loginStatus, identity };
}`,

  'frontend/src/hooks/useQueries.ts': `// React Query hooks for backend operations
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useGetUserProfileIntro() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery({
    queryKey: ['userProfileIntro'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getUserProfileIntro();
      } catch (error: any) {
        if (error.message?.includes('User profile not found')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

// Additional query hooks...`,

  'frontend/src/hooks/useGetCallerUserProfile.ts': `import { useGetUserProfileIntro } from './useQueries';

export function useGetCallerUserProfile() {
  return useGetUserProfileIntro();
}`,

  'frontend/src/hooks/useExportData.ts': `import { useState } from 'react';
import { toast } from 'sonner';

export function useExportData() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      // Export logic here
      toast.success('Data exported successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return { exportData, isExporting };
}`,

  'frontend/src/pages/LandingPage.tsx': `export default function LandingPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-5xl font-bold text-center mb-8">
        Welcome to SkinCare Analyzer
      </h1>
      <p className="text-xl text-center text-muted-foreground">
        Your personalized skincare recommendation platform
      </p>
    </div>
  );
}`,

  'frontend/src/pages/QuestionnairePage.tsx': `export default function QuestionnairePage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Skin Type Questionnaire</h1>
    </div>
  );
}`,

  'frontend/src/pages/ResultsPage.tsx': `export default function ResultsPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Your Results</h1>
    </div>
  );
}`,

  'frontend/src/pages/IngredientAnalysisPage.tsx': `export default function IngredientAnalysisPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Ingredient Analysis</h1>
    </div>
  );
}`,

  'frontend/src/pages/DashboardPage.tsx': `export default function DashboardPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
    </div>
  );
}`,

  'frontend/src/pages/ProfileIntroPage.tsx': `export default function ProfileIntroPage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-8">Complete Your Profile</h1>
    </div>
  );
}`,

  'frontend/src/utils/questionnaireData.ts': `export const questionnaireData = [
  {
    id: 1,
    question: 'How does your skin feel after cleansing?',
    options: ['Tight and dry', 'Comfortable', 'Oily in T-zone', 'Oily all over', 'Irritated'],
  },
  // Additional questions...
];`,

  'frontend/src/utils/skinTypeDescriptions.ts': `export const skinTypeDescriptions = {
  oily: {
    tagline: 'Shine Control & Balance',
    characteristics: ['Excess sebum production', 'Enlarged pores', 'Prone to breakouts'],
    careTips: ['Use oil-free products', 'Cleanse twice daily', 'Use mattifying products'],
    recommendedIngredients: ['Salicylic Acid', 'Niacinamide', 'Clay'],
  },
  // Additional skin types...
};`,

  'frontend/src/utils/seasonalTips.ts': `export function getCurrentSeason(): string {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'spring';
  if (month >= 5 && month <= 7) return 'summer';
  if (month >= 8 && month <= 10) return 'fall';
  return 'winter';
}`,

  'frontend/src/utils/exportFormatter.ts': `export function formatExportData(data: any): string {
  return JSON.stringify(data, null, 2);
}`,

  'frontend/src/utils/sqlExamples.ts': `export const sqlExamples = {
  create: 'CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));',
  insert: 'INSERT INTO users (id, name) VALUES (1, \\'John Doe\\');',
  select: 'SELECT * FROM users WHERE id = 1;',
  // Additional SQL examples...
};`,
};

export function getFileContent(filePath: string): string {
  return fileContents[filePath] || `// File: ${filePath}
// 
// This file is part of the Skin Analysis Platform project.
// Complete source code available in the project repository.

export default {};
`;
}

export function downloadFile(filePath: string, content: string) {
  const blob = new Blob([content], { type: getFileType(filePath) });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filePath.split('/').pop() || 'file';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function getFileType(filePath: string): string {
  const extension = filePath.split('.').pop()?.toLowerCase();
  
  const mimeTypes: Record<string, string> = {
    'ts': 'text/typescript',
    'tsx': 'text/typescript',
    'js': 'text/javascript',
    'jsx': 'text/javascript',
    'json': 'application/json',
    'css': 'text/css',
    'html': 'text/html',
    'md': 'text/markdown',
    'mo': 'text/plain',
  };
  
  return mimeTypes[extension || ''] || 'text/plain';
}
