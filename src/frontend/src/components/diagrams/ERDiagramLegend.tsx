import { Card, CardContent } from '../ui/card';

export default function ERDiagramLegend() {
  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
      <CardContent className="pt-6">
        <h3 className="font-semibold text-emerald-900 mb-4">ER Diagram Notation Legend:</h3>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 border-2 border-emerald-600 bg-white rounded"></div>
            <span className="text-emerald-800">Entity (Rectangle)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-6 border-2 border-teal-600 bg-teal-50 rounded-full"></div>
            <span className="text-emerald-800">Attribute (Oval)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-12 h-8 border-2 border-amber-600 bg-amber-50 rotate-45"></div>
            <span className="text-emerald-800 ml-2">Relationship (Diamond)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <div className="w-8 h-0.5 bg-emerald-600"></div>
              <span className="text-xs font-bold text-emerald-800 ml-1">1:N</span>
            </div>
            <span className="text-emerald-800">Cardinality</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
