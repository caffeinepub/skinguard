import { Card } from '../ui/card';
import ERDiagramLegend from './ERDiagramLegend';

export default function ERDiagram() {
  return (
    <div className="space-y-6">
      <ERDiagramLegend />
      
      <Card className="p-6 bg-white overflow-x-auto">
        <div className="min-w-[1000px]">
          <img 
            src="/assets/generated/er-diagram.dim_1200x800.png" 
            alt="Entity-Relationship Diagram"
            className="w-full h-auto"
          />
        </div>
      </Card>

      <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
        <h4 className="font-semibold text-emerald-900 mb-4">Entity Descriptions:</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-emerald-800">
          <div>
            <p className="font-medium mb-1">User</p>
            <p className="text-emerald-700">Stores user profile information including name and principal ID</p>
          </div>
          <div>
            <p className="font-medium mb-1">SkinTypeResult</p>
            <p className="text-emerald-700">Records skin type detection results with concerns and timestamp</p>
          </div>
          <div>
            <p className="font-medium mb-1">Product</p>
            <p className="text-emerald-700">Contains product details, brand, category, and suitable skin types</p>
          </div>
          <div>
            <p className="font-medium mb-1">Ingredient</p>
            <p className="text-emerald-700">Ingredient database with safety classifications and properties</p>
          </div>
          <div>
            <p className="font-medium mb-1">Favorite</p>
            <p className="text-emerald-700">User's saved favorite products for quick access</p>
          </div>
          <div>
            <p className="font-medium mb-1">Routine</p>
            <p className="text-emerald-700">Custom skincare routines created by users</p>
          </div>
          <div>
            <p className="font-medium mb-1">RoutineStep</p>
            <p className="text-emerald-700">Individual steps within a routine with order and frequency</p>
          </div>
          <div>
            <p className="font-medium mb-1">ProductNote</p>
            <p className="text-emerald-700">Personal notes, ratings, and experiences with products</p>
          </div>
          <div>
            <p className="font-medium mb-1">AnalysisHistory</p>
            <p className="text-emerald-700">Historical record of all skin analyses performed</p>
          </div>
        </div>
      </div>

      <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
        <h4 className="font-semibold text-teal-900 mb-4">Key Relationships:</h4>
        <ul className="space-y-2 text-sm text-teal-800">
          <li><strong>User ↔ SkinTypeResult (1:N):</strong> One user can have multiple skin type detection results over time</li>
          <li><strong>User ↔ Favorite (1:N):</strong> One user can save multiple favorite products</li>
          <li><strong>User ↔ Routine (1:N):</strong> One user can create multiple skincare routines</li>
          <li><strong>Routine ↔ RoutineStep (1:N):</strong> One routine contains multiple ordered steps</li>
          <li><strong>User ↔ ProductNote (1:N):</strong> One user can write notes for multiple products</li>
          <li><strong>Product ↔ Ingredient (M:N):</strong> Products contain multiple ingredients; ingredients appear in multiple products</li>
          <li><strong>User ↔ AnalysisHistory (1:N):</strong> One user has multiple analysis history records</li>
        </ul>
      </div>
    </div>
  );
}
