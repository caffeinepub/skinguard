import { Key, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Column {
  name: string;
  type: string;
  constraints: string[];
}

interface SchemaTableProps {
  tableName: string;
  columns: Column[];
  isJunction?: boolean;
}

export default function SchemaTable({ tableName, columns, isJunction = false }: SchemaTableProps) {
  return (
    <Card className={`${isJunction ? 'border-amber-300 bg-amber-50/30' : 'border-emerald-200'}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-emerald-900 flex items-center gap-2">
          {tableName}
          {isJunction && <span className="text-xs font-normal text-amber-700">(Junction Table)</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {columns.map((column, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm p-2 rounded hover:bg-emerald-50/50 transition-colors"
            >
              <div className="flex-shrink-0 w-5 mt-0.5">
                {column.constraints.includes('PK') && (
                  <span title="Primary Key">
                    <Key className="w-4 h-4 text-amber-600" />
                  </span>
                )}
                {column.constraints.some(c => c.startsWith('FK')) && (
                  <span title="Foreign Key">
                    <Link className="w-4 h-4 text-blue-600" />
                  </span>
                )}
              </div>
              <div className="flex-1">
                <div className="font-mono font-medium text-emerald-900">{column.name}</div>
                <div className="text-emerald-600 text-xs">{column.type}</div>
                {column.constraints.length > 0 && (
                  <div className="text-emerald-500 text-xs mt-0.5">
                    {column.constraints.join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
