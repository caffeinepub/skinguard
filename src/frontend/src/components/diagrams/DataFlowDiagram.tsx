import { Card } from '../ui/card';

export default function DataFlowDiagram() {
  return (
    <div className="space-y-6">
      <Card className="p-6 bg-white overflow-x-auto">
        <div className="min-w-[800px]">
          <img 
            src="/assets/generated/dataflow-diagram.dim_1000x700.png" 
            alt="Data Flow Diagram"
            className="w-full h-auto"
          />
        </div>
      </Card>

      <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-4">Data Flow Layers:</h4>
        <div className="space-y-3 text-sm text-blue-800">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <p className="font-medium">UI Component Layer (React)</p>
              <p className="text-blue-700">User interacts with React components, triggering data requests or mutations</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <p className="font-medium">React Query Layer</p>
              <p className="text-blue-700">useQuery/useMutation hooks manage data fetching, caching, and state synchronization</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <p className="font-medium">Actor Layer (useActor Hook)</p>
              <p className="text-blue-700">Initializes backend actor with Internet Identity authentication</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div>
              <p className="font-medium">Motoko Backend Canister</p>
              <p className="text-blue-700">Processes requests, executes business logic, and manages data storage</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center font-bold flex-shrink-0">5</div>
            <div>
              <p className="font-medium">Data Storage (Stable Memory)</p>
              <p className="text-blue-700">Persistent storage using Motoko stable variables and data structures</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-4">Authentication Flow:</h4>
        <p className="text-sm text-amber-800 mb-3">
          Internet Identity service provides secure, passwordless authentication using WebAuthn/passkeys.
          The identity is validated and used to authorize all backend operations.
        </p>
        <ul className="space-y-2 text-sm text-amber-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>User clicks login button</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>Internet Identity authentication window opens</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>User authenticates with passkey/biometric</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>Identity delegation returned to application</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>Actor initialized with authenticated identity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-900">→</span>
            <span>All subsequent requests include identity for authorization</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
