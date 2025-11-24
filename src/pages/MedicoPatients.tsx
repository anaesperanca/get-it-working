import { Header } from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DB_PATIENTS, DB_PEDIDOS } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, AlertCircle } from 'lucide-react';

export default function MedicoPatients() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              Meus Utentes
            </h1>
            <p className="text-muted-foreground mt-2">
              Gestão completa dos seus utentes
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {DB_PATIENTS.map((patient) => {
              const requests = DB_PEDIDOS.filter(p => p.consultaAlvoId === patient.id);
              const pending = requests.filter(r => r.estado === 'por_fazer').length;
              const expired = requests.filter(r => r.estado === 'expirado').length;
              
              return (
                <Card key={patient.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{patient.nome}</CardTitle>
                          <CardDescription className="mt-1">
                            Nº Utente: {patient.utente}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {patient.lastConsulta && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Última consulta: {new Date(patient.lastConsulta).toLocaleDateString('pt-PT')}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-warning"></div>
                        <span>{pending} pendente{pending !== 1 ? 's' : ''}</span>
                      </div>
                      {expired > 0 && (
                        <div className="flex items-center gap-2 text-destructive">
                          <AlertCircle className="h-4 w-4" />
                          <span>{expired} expirado{expired !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => navigate(`/medico/paciente/${patient.id}`)}
                    >
                      Ver Detalhes do Utente
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
