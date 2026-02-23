import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useUpdateProfileIntro } from '../hooks/useQueries';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Loader2, UserCircle } from 'lucide-react';
import { toast } from 'sonner';
import AuthGuard from '../components/AuthGuard';

export default function ProfileIntroPage() {
  const navigate = useNavigate();
  const updateProfile = useUpdateProfileIntro();

  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    age?: string;
    email?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Validate name
    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate age
    const ageNum = parseInt(age);
    if (!age || isNaN(ageNum)) {
      newErrors.age = 'Age is required';
    } else if (ageNum < 1 || ageNum > 120) {
      newErrors.age = 'Age must be between 1 and 120';
    }

    // Validate email (optional, but if provided must be valid)
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await updateProfile.mutateAsync({
        name: name.trim(),
        age: parseInt(age),
        email: email.trim() || null,
      });

      toast.success('Profile created successfully!');
      navigate({ to: '/questionnaire' });
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.message || 'Failed to create profile. Please try again.');
    }
  };

  const handleBlur = (field: 'name' | 'age' | 'email') => {
    // Trigger validation on blur
    const newErrors = { ...errors };

    if (field === 'name' && !name.trim()) {
      newErrors.name = 'Name is required';
    } else if (field === 'name') {
      delete newErrors.name;
    }

    if (field === 'age') {
      const ageNum = parseInt(age);
      if (!age || isNaN(ageNum)) {
        newErrors.age = 'Age is required';
      } else if (ageNum < 1 || ageNum > 120) {
        newErrors.age = 'Age must be between 1 and 120';
      } else {
        delete newErrors.age;
      }
    }

    if (field === 'email' && email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        delete newErrors.email;
      }
    } else if (field === 'email') {
      delete newErrors.email;
    }

    setErrors(newErrors);
  };

  const isFormValid = name.trim() && age && !errors.name && !errors.age && !errors.email;

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
              <UserCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-semibold text-foreground mb-2">
              Welcome to SkinCare Analyzer
            </h1>
            <p className="text-muted-foreground">
              Help us personalize your skincare analysis experience by sharing a few details about yourself.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card rounded-xl border border-border p-6 shadow-md">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-foreground">
                Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleBlur('name')}
                className={errors.name ? 'border-destructive focus:ring-destructive/20' : ''}
                disabled={updateProfile.isPending}
              />
              {errors.name && (
                <p className="text-sm text-destructive mt-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-medium text-foreground">
                Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id="age"
                type="number"
                placeholder="Enter your age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                onBlur={() => handleBlur('age')}
                min="1"
                max="120"
                className={errors.age ? 'border-destructive focus:ring-destructive/20' : ''}
                disabled={updateProfile.isPending}
              />
              {errors.age && (
                <p className="text-sm text-destructive mt-1">{errors.age}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email <span className="text-muted-foreground text-xs">(optional)</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur('email')}
                className={errors.email ? 'border-destructive focus:ring-destructive/20' : ''}
                disabled={updateProfile.isPending}
              />
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
              disabled={!isFormValid || updateProfile.isPending}
            >
              {updateProfile.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Continue to Questionnaire'
              )}
            </Button>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
}
