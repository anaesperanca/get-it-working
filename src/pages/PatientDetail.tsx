import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getPatientById, getRequestsByPatient } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, Bell, FileText, CalendarPlus } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const patient = getPatientById(id || '');
  const requests = getRequestsByPatient(id || '');

  if (!patient) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <p>Utente não encontrado</p>
        </main>
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.estado === 'por_fazer');
  const completedRequests = requests.filter(r => r.estado === 'concluido');
  const progress = requests.length > 0 ? (completedRequests.length / requests.length) * 100 : 0;

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{patient.nome}</CardTitle>
                  <CardDescription className="mt-2">
                    Nº Utente: {patient.utente}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {patient.lastConsulta && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Última consulta: {new Date(patient.lastConsulta).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              )}
              {patient.nextConsulta && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">
                    Próxima consulta: {new Date(patient.nextConsulta).toLocaleDateString('pt-PT')}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso até à próxima consulta</CardTitle>
              <CardDescription>
                {completedRequests.length} de {requests.length} pedidos concluídos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">
                {Math.round(progress)}% completo
              </p>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Button
              className="h-auto py-4 flex-col gap-2"
              onClick={() => toast.success('Lembrete enviado ao utente')}
            >
              <Bell className="h-5 w-5" />
              Enviar Lembrete
            </Button>
            <Button
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
              onClick={() => toast.info('Funcionalidade em desenvolvimento')}
            >
              <FileText className="h-5 w-5" />
              Prescrever Pedido
            </Button>
            <Button
              className="h-auto py-4 flex-col gap-2"
              variant="outline"
              onClick={() => toast.info('Funcionalidade em desenvolvimento')}
            >
              <CalendarPlus className="h-5 w-5" />
              Agendar Consulta
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Pedidos & Exames</CardTitle>
              <CardDescription>
                Histórico completo de pedidos do utente
              </CardDescription>
            </CardHeader>
            <CardContent>
              {requests.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum pedido registado
                </p>
              ) : (
                <div className="space-y-4">
                  {requests.map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">{request.nome}</h4>
                          {getStatusBadge(request.estado)}
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
