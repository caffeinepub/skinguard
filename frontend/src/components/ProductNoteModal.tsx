import { useState } from 'react';
import { SkincareProduct, ProductNote } from '../backend';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Star, Loader2 } from 'lucide-react';
import { useAddProductNote } from '../hooks/useQueries';

interface ProductNoteModalProps {
  product: SkincareProduct;
  existingNote?: ProductNote;
  onClose: () => void;
}

export default function ProductNoteModal({ product, existingNote, onClose }: ProductNoteModalProps) {
  const [rating, setRating] = useState(existingNote ? Number(existingNote.rating) : 0);
  const [notes, setNotes] = useState(existingNote?.notes || '');
  const [experience, setExperience] = useState(existingNote?.experience || '');
  const addNote = useAddProductNote();

  const handleSave = async () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    const note: ProductNote = {
      productName: product.name,
      rating: BigInt(rating),
      notes,
      experience,
    };

    await addNote.mutateAsync(note);
    onClose();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-emerald-900">{product.name}</DialogTitle>
          <DialogDescription className="text-emerald-600">{product.brand}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-emerald-900 mb-2 block">Rating</Label>
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      i < rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300 hover:text-amber-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes" className="text-emerald-900 mb-2 block">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What do you think about this product?"
              className="border-emerald-200 focus:border-emerald-400"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="experience" className="text-emerald-900 mb-2 block">
              Usage Experience
            </Label>
            <Textarea
              id="experience"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="How has this product worked for you?"
              className="border-emerald-200 focus:border-emerald-400"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-emerald-300 text-emerald-700 hover:bg-emerald-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={addNote.isPending}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              {addNote.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Note'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
