import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { sqlExamples } from '../utils/sqlExamples';

export default function SQLQuerySection() {
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
    <Tabs defaultValue="create" className="w-full">
      <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
        <TabsTrigger value="create">CREATE</TabsTrigger>
        <TabsTrigger value="insert">INSERT</TabsTrigger>
        <TabsTrigger value="select">SELECT</TabsTrigger>
        <TabsTrigger value="update">UPDATE</TabsTrigger>
        <TabsTrigger value="delete">DELETE</TabsTrigger>
        <TabsTrigger value="joins">JOINs</TabsTrigger>
      </TabsList>

      <TabsContent value="create" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">CREATE TABLE Statements</h4>
          <p className="text-sm text-emerald-700">
            Define all database tables with proper data types, constraints (PRIMARY KEY, FOREIGN KEY,
            NOT NULL, UNIQUE, CHECK), and relationships.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.create, 'create')}
      </TabsContent>

      <TabsContent value="insert" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">INSERT Statements</h4>
          <p className="text-sm text-emerald-700">
            Sample data insertion for users, products, ingredients, and their relationships including
            junction table entries for many-to-many relationships.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.insert, 'insert')}
      </TabsContent>

      <TabsContent value="select" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">SELECT Queries</h4>
          <p className="text-sm text-emerald-700">
            Retrieve data for all major features: user profiles, skin type results, product
            recommendations, ingredient analysis, favorites, routines, and analysis history.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.select, 'select')}
      </TabsContent>

      <TabsContent value="update" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">UPDATE Statements</h4>
          <p className="text-sm text-emerald-700">
            Modify existing records with proper WHERE clauses to ensure safe, targeted updates.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.update, 'update')}
      </TabsContent>

      <TabsContent value="delete" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">DELETE Statements</h4>
          <p className="text-sm text-emerald-700">
            Remove records with CASCADE behavior for related data. Always use WHERE clauses to prevent
            accidental data loss.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.delete, 'delete')}
      </TabsContent>

      <TabsContent value="joins" className="space-y-4">
        <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
          <h4 className="font-semibold text-emerald-900 mb-2">Complex JOIN Queries</h4>
          <p className="text-sm text-emerald-700">
            Demonstrate table relationships using INNER JOIN, LEFT JOIN, and aggregate functions to
            retrieve comprehensive data across multiple tables.
          </p>
        </div>
        {renderCodeBlock(sqlExamples.complexJoins, 'joins')}
      </TabsContent>
    </Tabs>
  );
}
