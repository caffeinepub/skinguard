import { useNavigate } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Sparkles, Shield, TrendingUp, Zap, FlaskConical, Search, Heart, Calendar, BookOpen } from 'lucide-react';
import ProductSearchBar from '../components/ProductSearchBar';

export default function LandingPage() {
  const navigate = useNavigate();

  const handleProductSelect = (productName: string) => {
    navigate({ 
      to: '/product-checker',
      search: { product: productName }
    });
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/70 py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 fade-in">
              <div className="inline-block">
                <span className="px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wide">
                  Personalized Skincare Analysis
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
                Discover Your Perfect Skincare Routine
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed font-normal">
                Take our comprehensive questionnaire to identify your skin type and get personalized product
                recommendations backed by dermatological science.
              </p>
              
              {/* Product Search Bar */}
              <div className="pt-2">
                <ProductSearchBar
                  onProductSelect={handleProductSelect}
                  placeholder="Search for a product to check its suitability..."
                  className="mb-6"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button
                  size="lg"
                  onClick={() => navigate({ to: '/questionnaire' })}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-primary-foreground text-lg px-8 py-6 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Your Analysis
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: '/ingredient-analysis' })}
                  className="border-2 border-border text-foreground hover:bg-accent/50 text-lg px-8 py-6 rounded-xl font-semibold transition-all duration-200"
                >
                  <FlaskConical className="w-5 h-5 mr-2" />
                  Analyze Ingredients
                </Button>
              </div>
            </div>
            <div className="relative fade-in">
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-primary/10 p-10 shadow-2xl">
                <img
                  src="/assets/generated/skin-types.dim_800x200.png"
                  alt="Skin Types"
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">Comprehensive Skincare Tools</h2>
            <p className="text-xl text-muted-foreground font-normal max-w-2xl mx-auto">
              Everything you need to make informed decisions about your skincare
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/questionnaire' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Skin Type Detection</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Answer a comprehensive questionnaire to accurately identify your skin type and concerns
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/ingredient-analysis' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <FlaskConical className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Ingredient Analysis</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Analyze product ingredients for safety and compatibility with your skin type
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/product-checker' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Search className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Product Checker</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Check if specific products are suitable for your unique skin profile
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/dashboard' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Progress Tracking</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Monitor your skin health journey with detailed analytics and insights
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/favorites' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Favorites & Notes</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Save your favorite products and track your experiences with detailed notes
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-200 cursor-pointer rounded-2xl" onClick={() => navigate({ to: '/resources' })}>
              <CardHeader className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-7 h-7 text-primary" />
                </div>
                <CardTitle className="text-2xl text-foreground font-semibold">Educational Resources</CardTitle>
                <CardDescription className="text-base text-muted-foreground leading-relaxed">
                  Learn about skincare science, ingredients, and best practices
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 px-6 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">How It Works</h2>
            <p className="text-xl text-muted-foreground font-normal max-w-2xl mx-auto">
              Three simple steps to better skincare
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-md">
                <span className="text-4xl font-bold text-primary">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Take the Quiz</h3>
              <p className="text-muted-foreground leading-relaxed">
                Answer questions about your skin to help us understand your unique needs
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-md">
                <span className="text-4xl font-bold text-primary">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Get Results</h3>
              <p className="text-muted-foreground leading-relaxed">
                Receive your personalized skin type analysis and product recommendations
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto shadow-md">
                <span className="text-4xl font-bold text-primary">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-foreground">Track Progress</h3>
              <p className="text-muted-foreground leading-relaxed">
                Monitor your skin health journey and adjust your routine as needed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-primary to-primary/90">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold text-primary-foreground tracking-tight">
            Ready to Transform Your Skincare?
          </h2>
          <p className="text-xl text-primary-foreground/90 font-normal">
            Join thousands of users who have discovered their perfect skincare routine
          </p>
          <Button
            size="lg"
            onClick={() => navigate({ to: '/questionnaire' })}
            className="bg-white text-primary hover:bg-white/90 text-lg px-10 py-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98]"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Get Started Now
          </Button>
        </div>
      </section>
    </div>
  );
}
