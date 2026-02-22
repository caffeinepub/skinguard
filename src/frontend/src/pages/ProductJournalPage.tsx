import AuthGuard from '../components/AuthGuard';
import { useGetProductNotes } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Loader2, BookMarked, Star } from 'lucide-react';

export default function ProductJournalPage() {
  return (
    <AuthGuard>
      <ProductJournalContent />
    </AuthGuard>
  );
}

function ProductJournalContent() {
  const { data: notes, isLoading } = useGetProductNotes();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto" />
          <p className="text-emerald-700">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
          <BookMarked className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-emerald-900 mb-2">Product Journal</h1>
        <p className="text-emerald-600">Your personal reviews and experiences</p>
      </div>

      {!notes || notes.length === 0 ? (
        <Card className="border-emerald-200">
          <CardContent className="pt-12 pb-12 text-center">
            <BookMarked className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-emerald-900 mb-2">No Journal Entries Yet</h3>
            <p className="text-emerald-600">
              Start adding notes and ratings to products to track your experiences!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {notes.map((note, index) => (
            <Card key={index} className="border-emerald-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-emerald-900">{note.productName}</CardTitle>
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < Number(note.rating) ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    {Number(note.rating)}/5
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {note.notes && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">Notes</h4>
                    <p className="text-emerald-700 text-sm leading-relaxed">{note.notes}</p>
                  </div>
                )}
                {note.experience && (
                  <div>
                    <h4 className="text-sm font-semibold text-emerald-900 mb-1">Experience</h4>
                    <p className="text-emerald-700 text-sm leading-relaxed">{note.experience}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
