import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, Activity } from 'lucide-react';

export const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold text-foreground">SNS 24</span>
              <span className="text-xs text-muted-foreground">Sistema Nacional de Saúde</span>
            </div>
          </Link>

          {user && (
            <nav className="hidden md:flex items-center gap-6">
              {user.role === 'medico' && (
                <>
                  <Link to="/medico/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/medico/pacientes" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Meus Utentes
                  </Link>
                  <Link to="/medico/pedidos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Pedidos & Exames
                  </Link>
                </>
              )}
              {user.role === 'utente' && (
                <>
                  <Link to="/utente/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Meu Perfil
                  </Link>
                  <Link to="/utente/pedidos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    Pedidos & Exames
                  </Link>
                </>
              )}
            </nav>
          )}

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-medium">{user.nome}</span>
                <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
              </div>
              <Button variant="outline" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
