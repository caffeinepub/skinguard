import { useState } from 'react';
import { EducationalArticle } from '../utils/educationalContent';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

interface ArticleCardProps {
  article: EducationalArticle;
}

const categoryColors: Record<string, string> = {
  'skin-types': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  concerns: 'bg-amber-100 text-amber-700 border-amber-200',
  ingredients: 'bg-purple-100 text-purple-700 border-purple-200',
  routines: 'bg-blue-100 text-blue-700 border-blue-200',
};

export default function ArticleCard({ article }: ArticleCardProps) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <>
      <Card
        className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer h-full rounded-2xl"
        onClick={() => setShowDialog(true)}
      >
        <CardHeader className="space-y-3">
          <Badge className={`w-fit border-2 font-semibold rounded-lg px-3 py-1 capitalize ${categoryColors[article.category]}`}>
            {article.category.replace('-', ' ')}
          </Badge>
          <CardTitle className="text-xl font-semibold text-foreground leading-tight">{article.title}</CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">{article.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.content.substring(0, 150)}...
          </p>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-3xl max-h-[85vh] rounded-2xl">
          <DialogHeader className="space-y-3">
            <Badge className={`w-fit border-2 font-semibold rounded-lg px-3 py-1 capitalize ${categoryColors[article.category]}`}>
              {article.category.replace('-', ' ')}
            </Badge>
            <DialogTitle className="text-3xl font-bold text-foreground leading-tight">{article.title}</DialogTitle>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">{article.description}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="text-muted-foreground whitespace-pre-line leading-relaxed text-base">{article.content}</div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
