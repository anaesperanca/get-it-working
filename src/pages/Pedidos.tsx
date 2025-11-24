import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DB_PEDIDOS, getPatientById } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Pedidos() {
  const { user } = useAuth();
  
  const userRequests = user?.patientId 
    ? DB_PEDIDOS.filter(p => p.consultaAlvoId === user.patientId)
    : DB_PEDIDOS;

  const pending = userRequests.filter(r => r.estado === 'por_fazer');
  const completed = userRequests.filter(r => r.estado === 'concluido');
  const expired = userRequests.filter(r => r.estado === 'expirado');

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'por_fazer':
        return <Calendar className="h-5 w-5 text-warning" />;
      case 'concluido':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'expirado':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'por_fazer':
        return <Badge variant="outline" className="bg-warning/10 text-warning border-warning">Pendente</Badge>;
      case 'concluido':
        return <Badge variant="outline" className="bg-success/10 text-success border-success">Concluído</Badge>;
      case 'expirado':
        return <Badge variant="destructive">Expirado</Badge>;
      default:
        return <Badge variant="outline">{estado}</Badge>;
    }
  };

  const RequestCard = ({ request }: { request: typeof DB_PEDIDOS[0] }) => {
    const patient = getPatientById(request.consultaAlvoId);
    
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex gap-3 flex-1">
              {getStatusIcon(request.estado)}
              <div className="flex-1">
                <CardTitle className="text-lg">{request.nome}</CardTitle>
                <CardDescription className="mt-1">
                  {request.descricao}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge(request.estado)}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Tipo:</span>
            <span className="capitalize">{request.tipo}</span>
          </div>
          {user?.role === 'medico' && patient && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium">Utente:</span>
              <span>{patient.nome}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span className={request.estado === 'expirado' ? 'text-destructive' : ''}>
              Prazo: {new Date(request.prazoISO).toLocaleDateString('pt-PT')}
            </span>
          </div>
          {request.dataRealizacao && (
            <div className="flex items-center gap-2 text-sm text-success">
              <CheckCircle2 className="h-4 w-4" />
              <span>
                Realizado: {new Date(request.dataRealizacao).toLocaleDateString('pt-PT')}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              Pedidos & Exames
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestão completa de pedidos e exames médicos
            </p>
          </div>

          <Tabs defaultValue="pending" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="pending" className="gap-2">
                Pendentes
                {pending.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {pending.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="completed">
                Concluídos
                {completed.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {completed.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="expired">
                Expirados
                {expired.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0.5 text-xs">
                    {expired.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4">
              {pending.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Nenhum pedido pendente
                  </CardContent>
                </Card>
              ) : (
                pending.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            <TabsContent value="completed" className="space-y-4">
              {completed.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Nenhum pedido concluído
                  </CardContent>
                </Card>
              ) : (
                completed.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>

            <TabsContent value="expired" className="space-y-4">
              {expired.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    Nenhum pedido expirado
                  </CardContent>
                </Card>
              ) : (
                expired.map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
