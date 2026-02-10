import { Outlet, useNavigate, useLocation } from '@tanstack/react-router';
import { useLanguage } from '../../i18n/LanguageProvider';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Menu, Globe, Heart } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import LoginButton from '../auth/LoginButton';
import ProfileSetupModal from '../auth/ProfileSetupModal';

export default function AppShell() {
  const { language, setLanguage, t } = useLanguage();
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;

  const navItems = [
    { path: '/', label: t('nav.home'), public: true },
    { path: '/platforms', label: t('nav.platforms'), public: true },
    { path: '/submissions', label: t('nav.submissions'), public: false },
    { path: '/content', label: t('nav.content'), public: false },
    { path: '/keywords', label: t('nav.keywords'), public: false },
    { path: '/performance', label: t('nav.performance'), public: false },
  ];

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'fa' ? 'en' : 'fa');
  };

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        if (!item.public && !isAuthenticated) return null;
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => handleNavigation(item.path)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-accent hover:text-accent-foreground'
            }`}
          >
            {item.label}
          </button>
        );
      })}
    </>
  );

  const appIdentifier = encodeURIComponent(
    typeof window !== 'undefined' ? window.location.hostname : 'shylaa-seo-app'
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProfileSetupModal />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo-mark.dim_512x512.png"
              alt="Logo"
              className="h-10 w-10 object-contain"
            />
            <span className="font-bold text-lg hidden sm:inline">shylaa.ir</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <NavLinks />
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={toggleLanguage}>
              <Globe className="h-5 w-5" />
            </Button>
            <LoginButton />
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={language === 'fa' ? 'right' : 'left'}>
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-6 mt-auto">
        <div className="container text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2 flex-wrap">
            <span>{t('footer.builtWith')}</span>
            <Heart className="h-4 w-4 text-red-500 fill-current" />
            <span>{t('footer.using')}</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()} shylaa.ir</p>
        </div>
      </footer>
    </div>
  );
}
