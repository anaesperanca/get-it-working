import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, User, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'utente' | 'medico'>('utente');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = login(username, password);
    
    if (result.ok) {
      toast.success('Login efetuado com sucesso!');
      setTimeout(() => {
        navigate('/');
      }, 500);
    } else {
      if (result.reason === 'user_not_found') {
        toast.error('Utilizador não encontrado');
      } else {
        toast.error('Palavra-passe incorreta');
      }
    }
  };

  const fillDemo = (role: 'utente' | 'medico') => {
    if (role === 'utente') {
      setUsername('utente123');
      setPassword('1234');
    } else {
      setUsername('medico1');
      setPassword('1234');
    }
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
              <Activity className="h-9 w-9 text-primary-foreground" />
            </div>
          </div>
          <div>
            <CardTitle className="text-3xl font-heading">SNS 24</CardTitle>
            <CardDescription className="text-base mt-2">
              Aceda à sua área reservada
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Utilizador"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="Palavra-passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg">
              Entrar
            </Button>
          </form>

          <div className="space-y-3">
            <p className="text-sm text-center text-muted-foreground">Credenciais de demonstração:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={selectedRole === 'utente' ? 'default' : 'outline'}
                size="sm"
                onClick={() => fillDemo('utente')}
                className="w-full"
              >
                Utente Demo
              </Button>
              <Button
                type="button"
                variant={selectedRole === 'medico' ? 'default' : 'outline'}
                size="sm"
                onClick={() => fillDemo('medico')}
                className="w-full"
              >
                Médico Demo
              </Button>
            </div>
            <div className="text-xs text-center space-y-1 bg-muted p-3 rounded-lg">
              <div className="font-medium">Utente: <span className="font-mono">utente123 / 1234</span></div>
              <div className="font-medium">Médico: <span className="font-mono">medico1 / 1234</span></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
