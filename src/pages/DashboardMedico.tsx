import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DB_PATIENTS, DB_PEDIDOS, getRequestsByPatient } from '@/data/mockData';
import { Users, ClipboardList, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export default function DashboardMedico() {
  const { user } = useAuth();
  
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

          <div>
            <h3 className="text-2xl font-heading font-bold mb-2">Utentes</h3>
            <p className="text-muted-foreground mb-4">
              Selecione um utente para ver os respetivos pedidos & exames.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {DB_PATIENTS.map((patient) => {
              const requests = getRequestsByPatient(patient.id);
              const pendingCount = requests.filter(r => r.estado === 'por_fazer').length;
              const completedCount = requests.filter(r => r.estado === 'concluido').length;
              const expiredCount = requests.filter(r => r.estado === 'expirado').length;
              
              return (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {patient.nome}
                      {pendingCount > 0 && (
                        <Badge variant="secondary" className="bg-warning/10 text-warning border-warning">
                          <Clock className="h-3 w-3 mr-1" />
                          {pendingCount} pendentes
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription>Nº Utente: {patient.utente}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingCount > 0 ? (
                      <p className="text-sm text-muted-foreground">
                        Tem pedidos de análises e exames <strong className="text-warning">pendentes</strong> para a próxima consulta.
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Neste momento não existem pedidos críticos
                        {completedCount > 0 && ', mas há exames '}
                        {completedCount > 0 && <strong className="text-success">recentemente concluídos</strong>}
                        .
                      </p>
                    )}
                    
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-warning" />
                          <p className="text-xs font-medium text-muted-foreground">Pendentes</p>
                        </div>
                        <p className="text-2xl font-bold">{pendingCount}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                          <p className="text-xs font-medium text-muted-foreground">Concluídos</p>
                        </div>
                        <p className="text-2xl font-bold">{completedCount}</p>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <AlertCircle className="h-4 w-4 text-destructive" />
                          <p className="text-xs font-medium text-muted-foreground">Expirados</p>
                        </div>
                        <p className="text-2xl font-bold">{expiredCount}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/medico/paciente/${patient.id}`}>Ver Pedidos & Exames</Link>
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => alert('No protótipo real, aqui abriria o detalhe clínico do utente.')}>
                        Ver Ficha
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                <strong>Nota de protótipo:</strong> nesta visão o médico consegue ter uma
                visão rápida dos utentes com mais exames pendentes e pode navegar para a
                página de <em>Pedidos & Exames</em> já filtrada para cada utente.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}