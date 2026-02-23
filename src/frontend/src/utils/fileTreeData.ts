export type FileNode = {
  path: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
};

export const projectFileTree: FileNode = {
  path: '',
  name: 'skin-analysis-platform',
  type: 'folder',
  children: [
    {
      path: 'README.md',
      name: 'README.md',
      type: 'file',
    },
    {
      path: 'dfx.json',
      name: 'dfx.json',
      type: 'file',
    },
    {
      path: 'backend',
      name: 'backend',
      type: 'folder',
      children: [
        {
          path: 'backend/main.mo',
          name: 'main.mo',
          type: 'file',
        },
        {
          path: 'backend/ingredient-store.mo',
          name: 'ingredient-store.mo',
          type: 'file',
        },
      ],
    },
    {
      path: 'frontend',
      name: 'frontend',
      type: 'folder',
      children: [
        {
          path: 'frontend/package.json',
          name: 'package.json',
          type: 'file',
        },
        {
          path: 'frontend/tsconfig.json',
          name: 'tsconfig.json',
          type: 'file',
        },
        {
          path: 'frontend/tailwind.config.js',
          name: 'tailwind.config.js',
          type: 'file',
        },
        {
          path: 'frontend/index.html',
          name: 'index.html',
          type: 'file',
        },
        {
          path: 'frontend/src',
          name: 'src',
          type: 'folder',
          children: [
            {
              path: 'frontend/src/index.css',
              name: 'index.css',
              type: 'file',
            },
            {
              path: 'frontend/src/App.tsx',
              name: 'App.tsx',
              type: 'file',
            },
            {
              path: 'frontend/src/main.tsx',
              name: 'main.tsx',
              type: 'file',
            },
            {
              path: 'frontend/src/config.ts',
              name: 'config.ts',
              type: 'file',
            },
            {
              path: 'frontend/src/components',
              name: 'components',
              type: 'folder',
              children: [
                {
                  path: 'frontend/src/components/Layout.tsx',
                  name: 'Layout.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/LoginButton.tsx',
                  name: 'LoginButton.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/ProfileSetupModal.tsx',
                  name: 'ProfileSetupModal.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/AuthGuard.tsx',
                  name: 'AuthGuard.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/Questionnaire.tsx',
                  name: 'Questionnaire.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/ResultsDisplay.tsx',
                  name: 'ResultsDisplay.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/ProductRecommendations.tsx',
                  name: 'ProductRecommendations.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/IngredientAnalysis.tsx',
                  name: 'IngredientAnalysis.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/components/ExportButton.tsx',
                  name: 'ExportButton.tsx',
                  type: 'file',
                },
              ],
            },
            {
              path: 'frontend/src/pages',
              name: 'pages',
              type: 'folder',
              children: [
                {
                  path: 'frontend/src/pages/LandingPage.tsx',
                  name: 'LandingPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/QuestionnairePage.tsx',
                  name: 'QuestionnairePage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/ResultsPage.tsx',
                  name: 'ResultsPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/DashboardPage.tsx',
                  name: 'DashboardPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/ProfileIntroPage.tsx',
                  name: 'ProfileIntroPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/IngredientAnalysisPage.tsx',
                  name: 'IngredientAnalysisPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/ResourcesPage.tsx',
                  name: 'ResourcesPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/IngredientDictionaryPage.tsx',
                  name: 'IngredientDictionaryPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/ProductSuitabilityCheckerPage.tsx',
                  name: 'ProductSuitabilityCheckerPage.tsx',
                  type: 'file',
                },
                {
                  path: 'frontend/src/pages/DBMSDocumentationPage.tsx',
                  name: 'DBMSDocumentationPage.tsx',
                  type: 'file',
                },
              ],
            },
            {
              path: 'frontend/src/hooks',
              name: 'hooks',
              type: 'folder',
              children: [
                {
                  path: 'frontend/src/hooks/useActor.ts',
                  name: 'useActor.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/hooks/useInternetIdentity.ts',
                  name: 'useInternetIdentity.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/hooks/useQueries.ts',
                  name: 'useQueries.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/hooks/useGetCallerUserProfile.ts',
                  name: 'useGetCallerUserProfile.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/hooks/useExportData.ts',
                  name: 'useExportData.ts',
                  type: 'file',
                },
              ],
            },
            {
              path: 'frontend/src/utils',
              name: 'utils',
              type: 'folder',
              children: [
                {
                  path: 'frontend/src/utils/questionnaireData.ts',
                  name: 'questionnaireData.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/utils/skinTypeDescriptions.ts',
                  name: 'skinTypeDescriptions.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/utils/seasonalTips.ts',
                  name: 'seasonalTips.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/utils/exportFormatter.ts',
                  name: 'exportFormatter.ts',
                  type: 'file',
                },
                {
                  path: 'frontend/src/utils/sqlExamples.ts',
                  name: 'sqlExamples.ts',
                  type: 'file',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
