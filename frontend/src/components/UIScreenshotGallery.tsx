import { Layout, Search, FileText, Heart, Calendar, FlaskConical, CheckCircle, BookOpen, Star, Clipboard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { uiScreenshots } from '../utils/uiScreenshots';

const iconMap: Record<string, any> = {
  'Landing Page': Layout,
  'Questionnaire': Clipboard,
  'Results Page': CheckCircle,
  'Dashboard': Layout,
  'Favorites': Heart,
  'Routines': Calendar,
  'Routine Builder': Calendar,
  'Product Journal': FileText,
  'Ingredient Dictionary': FlaskConical,
  'Ingredient Analysis': FlaskConical,
  'Product Suitability Checker': Search,
  'Resources': BookOpen,
};

export default function UIScreenshotGallery() {
  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
        <h4 className="font-semibold text-emerald-900 mb-2">Design Theme</h4>
        <p className="text-sm text-emerald-700">
          Healthcare-inspired aesthetic with soft emerald greens (#10B981 family), clean white backgrounds,
          and accessible typography. The design emphasizes clarity, trust, and ease of use with generous
          spacing, clear visual hierarchies, and intuitive navigation patterns.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {uiScreenshots.map((screenshot, index) => {
          const Icon = iconMap[screenshot.pageName] || Layout;
          return (
            <Card key={index} className="border-emerald-200 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-emerald-900">
                  <Icon className="w-5 h-5 text-emerald-600" />
                  {screenshot.pageName}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-emerald-700">{screenshot.description}</p>

                <div>
                  <h5 className="text-sm font-semibold text-emerald-900 mb-2">Key Features:</h5>
                  <div className="flex flex-wrap gap-2">
                    {screenshot.keyFeatures.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-emerald-900 mb-2">Design Elements:</h5>
                  <ul className="text-xs text-emerald-700 space-y-1">
                    {screenshot.designElements.map((element, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span>{element}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-teal-50 p-3 rounded border border-teal-200">
                  <h5 className="text-xs font-semibold text-teal-900 mb-2">UI Annotations:</h5>
                  <ul className="text-xs text-teal-700 space-y-1">
                    {screenshot.annotations.map((annotation, idx) => (
                      <li key={idx} className="flex items-start gap-1">
                        <CheckCircle className="w-3 h-3 text-teal-600 mt-0.5 flex-shrink-0" />
                        <span>{annotation}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-100 p-4 rounded border border-slate-300 text-center">
                  <p className="text-xs text-slate-600 italic">
                    [Screenshot placeholder for {screenshot.pageName}]
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Capture actual application screenshot here
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-2">📸 Screenshot Instructions</h4>
        <p className="text-sm text-amber-700">
          To complete this documentation, capture high-resolution screenshots of each page listed above.
          Ensure screenshots show both empty states and populated data states where applicable. Use browser
          developer tools to capture full-page screenshots if needed.
        </p>
      </div>
    </div>
  );
}
