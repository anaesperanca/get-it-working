import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DB_PATIENTS, DB_PEDIDOS } from '@/data/mockData';
import { Users, ClipboardList, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function DashboardMedico() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const totalPacientes = DB_PATIENTS.length;
  const pedidosPorFazer = DB_PEDIDOS.filter(p => p.estado === 'por_fazer').length;
  const pedidosExpirados = DB_PEDIDOS.filter(p => p.estado === 'expirado').length;
  const pedidosConcluidos = DB_PEDIDOS.filter(p => p.estado === 'concluido').length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-heading font-bold tracking-tight">
              Bem-vindo, {user?.nome}
            </h1>
            <p className="text-muted-foreground mt-2">
              {user?.numero} · Painel do Médico
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-l-4 border-l-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Utentes Acompanhados
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalPacientes}</div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-warning">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Pedidos Pendentes
                </CardTitle>
                <ClipboardList className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{pedidosPorFazer}</div>
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
                <div className="text-3xl font-bold">{pedidosExpirados}</div>
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
                <div className="text-3xl font-bold">{pedidosConcluidos}</div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Utentes Recentes</CardTitle>
              <CardDescription>
                Lista dos seus utentes acompanhados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {DB_PATIENTS.map((patient) => {
                  const requests = DB_PEDIDOS.filter(p => p.consultaAlvoId === patient.id);
                  const pending = requests.filter(r => r.estado === 'por_fazer').length;
                  
                  return (
                    <div
                      key={patient.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                    >
                      <div>
                        <h4 className="font-semibold">{patient.nome}</h4>
                        <p className="text-sm text-muted-foreground">
                          Nº Utente: {patient.utente}
                        </p>
                        {pending > 0 && (
                          <p className="text-sm text-warning mt-1">
                            {pending} pedido{pending !== 1 ? 's' : ''} pendente{pending !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/medico/paciente/${patient.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
