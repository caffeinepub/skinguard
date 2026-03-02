import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { BookOpen, Search } from 'lucide-react';
import { educationalContent } from '../utils/educationalContent';
import ArticleCard from '../components/ArticleCard';

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContent = educationalContent.filter(
    (article) =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ['all', 'skin-types', 'concerns', 'ingredients', 'routines'];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Educational Resources</h1>
        <p className="text-emerald-600">Learn about skincare, ingredients, and best practices</p>
      </div>

      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
          <Input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-emerald-200 focus:border-emerald-400"
          />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="skin-types">Skin Types</TabsTrigger>
          <TabsTrigger value="concerns">Concerns</TabsTrigger>
          <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
          <TabsTrigger value="routines">Routines</TabsTrigger>
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category} value={category} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredContent
                .filter((article) => category === 'all' || article.category === category)
                .map((article, index) => (
                  <ArticleCard key={index} article={article} />
                ))}
            </div>
            {filteredContent.filter((article) => category === 'all' || article.category === category)
              .length === 0 && (
              <Card className="border-emerald-200">
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-emerald-600">No articles found matching your search.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
