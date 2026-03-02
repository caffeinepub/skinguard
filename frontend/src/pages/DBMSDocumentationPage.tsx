import { useRef } from 'react';
import { FileText, Database, Code, Layout, Link2, CheckCircle } from 'lucide-react';
import AuthGuard from '../components/AuthGuard';
import ERDiagram from '../components/diagrams/ERDiagram';
import SchemaDiagram from '../components/diagrams/SchemaDiagram';
import SQLQuerySection from '../components/SQLQuerySection';
import UIScreenshotGallery from '../components/UIScreenshotGallery';
import DataFlowDiagram from '../components/diagrams/DataFlowDiagram';
import ConnectivityCodeSection from '../components/ConnectivityCodeSection';
import PDFExportButton from '../components/PDFExportButton';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Separator } from '../components/ui/separator';

export default function DBMSDocumentationPage() {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Export Button - Sticky at top */}
        <div className="sticky top-4 z-10 mb-8 flex justify-end no-print">
          <PDFExportButton contentRef={contentRef} />
        </div>

        {/* Main Content */}
        <div ref={contentRef}>
          {/* Header */}
          <div className="text-center mb-12 print-avoid-break">
            <h1 className="text-4xl font-bold text-emerald-900 mb-2">
              SkinCare Analyzer
            </h1>
            <h2 className="text-2xl font-semibold text-emerald-700 mb-4">
              DB Application Project Development
            </h2>
            <p className="text-lg text-emerald-600">
              Database Management System Microproject
            </p>
          </div>

          <Separator className="mb-12" />

          {/* AIM Section */}
          <section className="mb-16 print-avoid-break">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">AIM</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-800 leading-relaxed">
                  To design an application UI and a normalized database for a{' '}
                  <strong>Skincare Analysis and Recommendation System</strong> that helps users identify
                  their skin type, track skincare concerns, discover suitable products, analyze ingredient
                  safety, and build personalized routines. The system performs comprehensive operations after
                  establishing necessary connectivity between the React frontend and Motoko backend canister.
                  Additionally, generate schema diagrams and ER diagrams for the designed database.
                </p>
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* ER DIAGRAM Section */}
          <section className="mb-16 print-avoid-break">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">ER DIAGRAM</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-emerald-700 mb-6">
                  Entity-Relationship diagram showing all entities, attributes, and relationships with
                  cardinality notation (1:1, 1:N, M:N).
                </p>
                <ERDiagram />
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* DATABASE SCHEMA Section */}
          <section className="mb-16 print-avoid-break">
            <div className="flex items-center gap-3 mb-6">
              <Database className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">DATABASE SCHEMA</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-emerald-700 mb-6">
                  Normalized database schema (3NF) with table structures, column definitions, data types,
                  primary keys (PK), and foreign keys (FK).
                </p>
                <SchemaDiagram />
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* SQL QUERIES Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">SQL QUERIES AND TABLE DATA</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-emerald-700 mb-6">
                  Comprehensive SQL query examples demonstrating CREATE, INSERT, SELECT, UPDATE, DELETE
                  operations, and complex JOINs with sample data.
                </p>
                <SQLQuerySection />
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* UI DESIGN Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Layout className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">USER INTERFACE DESIGN</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-emerald-700 mb-6">
                  Healthcare-inspired UI design with soft emerald greens, clean typography, and intuitive
                  navigation. Screenshots showcase all major pages and interactive features.
                </p>
                <UIScreenshotGallery />
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* DB CONNECTIVITY Section */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <Link2 className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">DB CONNECTIVITY STEPS / CODE</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <p className="text-emerald-700 mb-6">
                  Integration between Motoko backend canister and React frontend using Internet Identity
                  authentication, React Query for data fetching, and actor-based communication.
                </p>
                
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-emerald-800 mb-4">Data Flow Architecture</h3>
                  <DataFlowDiagram />
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-emerald-800 mb-4">Code Implementation</h3>
                  <ConnectivityCodeSection />
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="page-break" />

          {/* OUTPUT Section */}
          <section className="mb-16 print-avoid-break">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">OUTPUT</h2>
            </div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-emerald-800 mb-4">Key Application Features</h3>
                <ul className="space-y-3 text-emerald-700">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Skin Type Detection:</strong> Multi-step questionnaire analyzing oil levels, dryness, sensitivity, pore size, and concerns (acne, pigmentation, aging, dryness)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Personalized Product Recommendations:</strong> Filtered by detected skin type and specific concerns with category organization</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ingredient Safety Analysis:</strong> Comprehensive database of 80+ ingredients with safety classifications (Safe, Conditional, Risky, Harmful)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Product Suitability Checker:</strong> Three-criteria evaluation (ingredient safety, skin-type compatibility, concern relevance) with scientific reasoning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Smart Product Search:</strong> Real-time autocomplete with prefix-based filtering and keyboard navigation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Favorites Management:</strong> Save and organize preferred products for quick access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Routine Builder:</strong> Create custom morning/night skincare routines with product ordering and frequency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Product Journal:</strong> Personal notes, ratings, and experience tracking for tried products</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Analysis History:</strong> Timeline of skin type detections and concern progression over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Progress Metrics:</strong> Trend analysis for acne, pigmentation, aging, and dryness concerns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Educational Resources:</strong> Searchable articles organized by skin types, concerns, ingredients, and routines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span><strong>Ingredient Dictionary:</strong> Comprehensive database with scientific names, benefits, and safety information</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* RESULT Section */}
          <section className="mb-16 print-avoid-break">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-emerald-900">RESULT</h2>
            </div>
            <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardContent className="pt-6">
                <p className="text-lg text-emerald-800 leading-relaxed">
                  <strong>Developed a DB-based application project successfully</strong> integrating a normalized
                  database (represented through Motoko stable memory structures) with a React frontend. The system
                  implements comprehensive CRUD operations, authentication with Internet Identity and role-based
                  access control, and provides users with a complete skincare analysis and personalization platform.
                  The application demonstrates effective use of the Internet Computer's capabilities, React's
                  component architecture, and user-centered design principles to create a valuable tool for skincare
                  enthusiasts seeking personalized product guidance based on their unique skin characteristics.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </AuthGuard>
  );
}
