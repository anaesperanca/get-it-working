import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatientById, getRequestsByPatient } from '@/data/mockData';
import { User, Calendar, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function DashboardUtente() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [updateKey, setUpdateKey] = useState(0);
  
  useEffect(() => {
    const refresh = () => setUpdateKey(key => key + 1);
    window.addEventListener('pedidos-updated', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('pedidos-updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  
  const patient = getPatientById(user?.patientId || '');
  void updateKey;
  const requests = getRequestsByPatient(user?.patientId || '');
  
  const pending = requests.filter(r => r.estado === 'por_fazer').length;
  const completed = requests.filter(r => r.estado === 'concluido').length;
  const expired = requests.filter(r => r.estado === 'expirado').length;
  const progress = requests.length > 0 ? (completed / requests.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-heading font-bold tracking-tight">
              Olá, {user?.nome}
            </h1>
            <p className="text-muted-foreground mt-2">
              Bem-vindo à sua área pessoal SNS 24
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary">
                  <User className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">{patient?.nome}</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Nº Utente: {patient?.utente}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient?.lastConsulta && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Última consulta: {new Date(patient.lastConsulta).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              )}
              {patient?.nextConsulta && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">
                    Próxima consulta: {new Date(patient.nextConsulta).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-warning">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pedidos Pendentes
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pending}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Aguardam realização
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-success">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Concluídos
                </CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Já realizados
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-destructive">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Expirados
                </CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{expired}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Requerem atenção
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Progresso até à próxima consulta</CardTitle>
              <CardDescription>
                {completed} de {requests.length} pedidos concluídos ({Math.round(progress)}%)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-3" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pedidos Recentes</CardTitle>
                  <CardDescription className="mt-1">
                    Últimos pedidos e exames
                  </CardDescription>
                </div>
                <Button onClick={() => navigate('/utente/pedidos')}>
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {requests.slice(0, 3).length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum pedido registado
                </p>
              ) : (
                <div className="space-y-4">
                  {requests.slice(0, 3).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{request.nome}</h4>
                          <Badge
                            variant={
                              request.estado === 'concluido'
                                ? 'default'
                                : request.estado === 'expirado'
                                ? 'destructive'
                                : 'outline'
                            }
                          >
                            {request.estado === 'por_fazer'
                              ? 'Pendente'
                              : request.estado === 'concluido'
                              ? 'Concluído'
                              : 'Expirado'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {request.descricao}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Prazo: {new Date(request.prazoISO).toLocaleDateString('pt-PT')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
