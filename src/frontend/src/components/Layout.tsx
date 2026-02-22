import { Outlet, useNavigate } from '@tanstack/react-router';
import { Heart, FlaskConical, LayoutDashboard, BookOpen, Star, Calendar, BookMarked, Search, FileText } from 'lucide-react';
import { Button } from './ui/button';
import LoginButton from './LoginButton';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function Layout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  
  const appIdentifier = typeof window !== 'undefined' 
    ? encodeURIComponent(window.location.hostname) 
    : 'skincare-analyzer';

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/50">
      <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-white/90 backdrop-blur-lg shadow-sm no-print">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate({ to: '/' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">SkinCare Analyzer</h1>
          </div>
          <nav className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/resources' })}
              className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Resources
            </Button>
            {isAuthenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/favorites' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Favorites
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/journal' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <BookMarked className="w-4 h-4 mr-2" />
                  Journal
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/ingredients' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <FlaskConical className="w-4 h-4 mr-2" />
                  Ingredients
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/product-checker' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Check Product
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/dbms-docs' })}
                  className="text-foreground/80 hover:text-foreground hover:bg-accent/50 font-medium transition-all duration-200"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Documentation
                </Button>
              </>
            )}
            <div className="ml-2">
              <LoginButton />
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border/60 bg-white/70 backdrop-blur-sm py-8 mt-16 no-print">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            © {new Date().getFullYear()} SkinCare Analyzer. Built with{' '}
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors duration-200"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
