import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Home, 
  FileText, 
  Search, 
  PlusCircle, 
  User, 
  LogOut, 
  Menu, 
  X,
  Building2,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CitizenLayoutProps {
  children: ReactNode;
}

const navItems = [
  { href: '/citizen', label: 'Dashboard', icon: Home },
  { href: '/citizen/submit', label: 'Submit Grievance', icon: PlusCircle },
  { href: '/citizen/track', label: 'Track Status', icon: Search },
  { href: '/citizen/history', label: 'My Complaints', icon: FileText },
];

export function CitizenLayout({ children }: CitizenLayoutProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 border-b bg-card shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/citizen" className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <div className="hidden sm:block">
                <h1 className="text-lg font-bold text-foreground leading-tight">Municipal Grievance Portal</h1>
                <p className="text-xs text-muted-foreground">Thane Municipal Corporation</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                    location.pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden sm:inline text-sm font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                    <span className="inline-flex mt-1 items-center rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      Citizen
                    </span>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/help" className="flex items-center gap-2">
                      <HelpCircle className="h-4 w-4" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden border-t bg-card px-4 py-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  location.pathname === item.href
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 mb-20 md:mb-6">
        {children}
      </main>

      {/* Floating Action Button for Mobile */}
      <Link 
        to="/citizen/submit" 
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl bg-primary hover:scale-105 transition-transform flex items-center justify-center text-primary-foreground z-[100] md:hidden"
        data-testid="fab-submit-grievance"
      >
        <PlusCircle className="h-7 w-7" />
      </Link>

      {/* Footer */}
      <footer className="border-t bg-card py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} Municipal Grievance Analytics Portal</p>
            <p>TYCS Sem 6 Project • Mumbai University</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
