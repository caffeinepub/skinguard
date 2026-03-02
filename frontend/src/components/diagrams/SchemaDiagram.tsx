import SchemaTable from './SchemaTable';

export default function SchemaDiagram() {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border border-emerald-200 overflow-x-auto">
        <div className="min-w-[1000px]">
          <img 
            src="/assets/generated/schema-diagram.dim_1200x900.png" 
            alt="Database Schema Diagram"
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <SchemaTable
          tableName="users"
          columns={[
            { name: 'user_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          ]}
        />

        <SchemaTable
          tableName="skin_type_results"
          columns={[
            { name: 'result_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'user_id', type: 'TEXT', constraints: ['FK → users'] },
            { name: 'detected_skin_type', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'concerns', type: 'JSON', constraints: [] },
            { name: 'timestamp', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          ]}
        />

        <SchemaTable
          tableName="products"
          columns={[
            { name: 'product_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL', 'UNIQUE'] },
            { name: 'brand', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'description', type: 'TEXT', constraints: [] },
            { name: 'category', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'price_range', type: 'TEXT', constraints: [] },
          ]}
        />

        <SchemaTable
          tableName="ingredients"
          columns={[
            { name: 'ingredient_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL', 'UNIQUE'] },
            { name: 'description', type: 'TEXT', constraints: [] },
            { name: 'safety_classification', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'suitable_skin_types', type: 'JSON', constraints: [] },
            { name: 'concerns', type: 'JSON', constraints: [] },
          ]}
        />

        <SchemaTable
          tableName="product_ingredients"
          columns={[
            { name: 'product_id', type: 'TEXT', constraints: ['FK → products'] },
            { name: 'ingredient_id', type: 'TEXT', constraints: ['FK → ingredients'] },
            { name: 'PRIMARY KEY', type: '(product_id, ingredient_id)', constraints: [] },
          ]}
          isJunction
        />

        <SchemaTable
          tableName="favorites"
          columns={[
            { name: 'favorite_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'user_id', type: 'TEXT', constraints: ['FK → users'] },
            { name: 'product_name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          ]}
        />

        <SchemaTable
          tableName="routines"
          columns={[
            { name: 'routine_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'user_id', type: 'TEXT', constraints: ['FK → users'] },
            { name: 'name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'created_at', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          ]}
        />

        <SchemaTable
          tableName="routine_steps"
          columns={[
            { name: 'step_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'routine_id', type: 'TEXT', constraints: ['FK → routines'] },
            { name: 'product_name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'order', type: 'INTEGER', constraints: ['NOT NULL'] },
            { name: 'frequency', type: 'INTEGER', constraints: ['NOT NULL'] },
          ]}
        />

        <SchemaTable
          tableName="product_notes"
          columns={[
            { name: 'note_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'user_id', type: 'TEXT', constraints: ['FK → users'] },
            { name: 'product_name', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'rating', type: 'INTEGER', constraints: ['CHECK (rating >= 1 AND rating <= 5)'] },
            { name: 'notes', type: 'TEXT', constraints: [] },
            { name: 'experience', type: 'TEXT', constraints: [] },
          ]}
        />

        <SchemaTable
          tableName="analysis_history"
          columns={[
            { name: 'history_id', type: 'TEXT', constraints: ['PK'] },
            { name: 'user_id', type: 'TEXT', constraints: ['FK → users'] },
            { name: 'skin_type', type: 'TEXT', constraints: ['NOT NULL'] },
            { name: 'concerns', type: 'JSON', constraints: [] },
            { name: 'timestamp', type: 'TIMESTAMP', constraints: ['NOT NULL'] },
          ]}
        />
      </div>
    </div>
  );
}
