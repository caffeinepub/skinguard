import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { connectivityExamples } from '../utils/connectivityExamples';

export default function ConnectivityCodeSection() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const renderCodeBlock = (code: string, section: string) => (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-2 right-2 z-10"
        onClick={() => copyToClipboard(code, section)}
      >
        {copiedSection === section ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </Button>
      <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <Tabs defaultValue="actor" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="actor">Actor Init</TabsTrigger>
        <TabsTrigger value="auth">Authentication</TabsTrigger>
        <TabsTrigger value="query">Query Hooks</TabsTrigger>
        <TabsTrigger value="mutation">Mutations</TabsTrigger>
        <TabsTrigger value="error">Error Handling</TabsTrigger>
        <TabsTrigger value="loading">Loading States</TabsTrigger>
      </TabsList>

      <TabsContent value="actor" className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">Actor Initialization</h4>
          <p className="text-sm text-blue-700">
            The useActor hook initializes the backend actor with Internet Identity authentication,
            providing a typed interface to call backend canister methods.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.actorInitialization, 'actor')}
      </TabsContent>

      <TabsContent value="auth" className="space-y-4">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-semibold text-amber-900 mb-2">Internet Identity Authentication</h4>
          <p className="text-sm text-amber-700">
            Secure, passwordless authentication using WebAuthn/passkeys. The identity is persisted
            and used to authorize all backend operations.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.authentication, 'auth')}
      </TabsContent>

      <TabsContent value="query" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">React Query Hooks (GET Operations)</h4>
          <p className="text-sm text-emerald-700">
            Query hooks fetch data from the backend with automatic caching, refetching, and state
            management. They handle loading and error states automatically.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.queryHooks, 'query')}
      </TabsContent>

      <TabsContent value="mutation" className="space-y-4">
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <h4 className="font-semibold text-teal-900 mb-2">Mutation Hooks (POST/PUT/DELETE Operations)</h4>
          <p className="text-sm text-teal-700">
            Mutation hooks handle data modifications with automatic cache invalidation and refetching.
            They provide loading states and error handling for user feedback.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.mutationHooks, 'mutation')}
      </TabsContent>

      <TabsContent value="error" className="space-y-4">
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h4 className="font-semibold text-red-900 mb-2">Error Handling Patterns</h4>
          <p className="text-sm text-red-700">
            Comprehensive error handling with try-catch blocks, error states from React Query, and
            user-friendly error messages. Backend traps are caught and displayed appropriately.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.errorHandling, 'error')}
      </TabsContent>

      <TabsContent value="loading" className="space-y-4">
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <h4 className="font-semibold text-purple-900 mb-2">Loading State Management</h4>
          <p className="text-sm text-purple-700">
            React Query provides built-in loading states (isLoading, isFetching, isPending) for
            optimal user experience. Cache configuration controls data freshness and refetching behavior.
          </p>
        </div>
        {renderCodeBlock(connectivityExamples.loadingStates, 'loading')}
      </TabsContent>
    </Tabs>
  );
}
