import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DB_PATIENTS, getPatientById, getPedidos, updatePedidoLocal, type Request } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileText, Calendar, AlertCircle, CheckCircle2, Upload, Plus, Building2, Clock } from 'lucide-react';
import { toast } from 'sonner';

export default function Pedidos() {
  const { user } = useAuth();
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [distrito, setDistrito] = useState('');
  const [showLabs, setShowLabs] = useState(false);
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [requests, setRequests] = useState<Request[]>(() => getPedidos());
  
  const userRequests = user?.patientId 
    ? requests.filter(p => p.consultaAlvoId === user.patientId)
    : selectedPatient
    ? requests.filter(p => p.consultaAlvoId === selectedPatient)
    : requests;

  const pending = userRequests.filter(r => r.estado === 'por_fazer' || r.estado === 'agendado');
  const completed = userRequests.filter(r => r.estado === 'concluido');
  const expired = userRequests.filter(r => r.estado === 'expirado');

  const refreshRequests = () => setRequests(getPedidos());

  const distritosPortugal = [
    'Aveiro', 'Beja', 'Braga', 'Bragança', 'Castelo Branco', 'Coimbra', 'Évora', 'Faro', 'Guarda',
    'Leiria', 'Lisboa', 'Portalegre', 'Porto', 'Santarém', 'Setúbal', 'Viana do Castelo', 'Vila Real', 'Viseu'
  ];

  const labs = [
    { id: 'synlab', nome: 'Synlab', distrito: 'todos', endereco: 'Rede nacional Synlab', url: 'https://www.synlab.pt', api: true },
    { id: 'gs-lisboa', nome: 'Germano de Sousa', distrito: 'Lisboa', endereco: 'Av. da Liberdade, 123', url: 'https://www.germanodesousa.com', api: false },
    { id: 'jcs-lisboa', nome: 'Joaquim Chaves Saúde', distrito: 'Lisboa', endereco: 'Praça de Espanha, 78', url: 'https://www.jcs.pt', api: false },
    { id: 'gs-porto', nome: 'Germano de Sousa', distrito: 'Porto', endereco: 'Rua de Sá da Bandeira, 210', url: 'https://www.germanodesousa.com', api: false },
    { id: 'trofa-braga', nome: 'Trofa Saúde', distrito: 'Braga', endereco: 'Av. Central, 34', url: 'https://www.trofasaude.pt', api: false },
    { id: 'cuf-coimbra', nome: 'CUF', distrito: 'Coimbra', endereco: 'Rua General Humberto Delgado, 12', url: 'https://www.cuf.pt', api: false },
    { id: 'lus-setubal', nome: 'Lusíadas Saúde', distrito: 'Setúbal', endereco: 'Av. Luísa Todi, 91', url: 'https://www.lusiadas.pt', api: false },
    { id: 'hpa-faro', nome: 'HPA Saúde', distrito: 'Faro', endereco: 'Estrada de Alvor, 8500', url: 'https://www.grupohpa.com', api: false },
  ];

  const availableLabs = distrito
    ? labs.filter(lab => lab.distrito === distrito || lab.id === 'synlab')
    : [];

  const synlabAgenda = distrito
    ? [
        { id: `${distrito}-manha`, label: 'Amanhã', hora: '09:20', local: `Synlab ${distrito} Centro` },
        { id: `${distrito}-tarde`, label: 'Amanhã', hora: '15:40', local: `Synlab ${distrito} Norte` },
        { id: `${distrito}-semana`, label: 'Daqui a 2 dias', hora: '11:10', local: `Synlab ${distrito} Sul` },
      ]
    : [];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>, requestId?: string) => {
    const file = e.target.files?.[0];
    if (file) {
      if (requestId) {
        updatePedidoLocal(requestId, {
          estado: 'concluido',
          dataRealizacao: new Date().toISOString(),
          anexos: [file.name],
        });
        refreshRequests();
        toast.success(`Documento "${file.name}" carregado. Exame concluído e progresso atualizado!`);
        return;
      }
      toast.success(`Documento "${file.name}" carregado com sucesso!`);
    }
  };

  const handleSchedule = (request: Request) => {
    setSelectedRequest(request);
    setIsScheduleModalOpen(true);
    setDistrito('');
    setShowLabs(false);
    setSelectedLab('');
    setSelectedSlot('');
  };

  const procurarLabs = () => {
    if (!distrito) {
      toast.error('Por favor, selecione um distrito');
      return;
    }
    setShowLabs(true);
    setSelectedLab('synlab');
    setSelectedSlot(synlabAgenda[0]?.id || '');
    toast.success('Agenda Synlab consultada com sucesso');
  };

  const confirmarAgendamento = () => {
    if (!selectedLab) {
      toast.error('Por favor, selecione um laboratório');
      return;
    }
    if (selectedLab === 'synlab' && !selectedSlot) {
      toast.error('Por favor, selecione uma vaga da Synlab');
      return;
    }
    const lab = labs.find(l => l.id === selectedLab);
    const slot = synlabAgenda.find(s => s.id === selectedSlot);
    toast.success(
      selectedLab === 'synlab'
        ? `Agendamento Synlab confirmado: ${slot?.label} às ${slot?.hora}`
        : `Agendamento confirmado em ${lab?.nome}!`
    );
    if (selectedRequest) {
      updatePedidoLocal(selectedRequest.id, {
        estado: 'agendado',
        agendamento: selectedLab === 'synlab'
          ? `${slot?.local} · ${slot?.label} às ${slot?.hora}`
          : lab?.nome,
      });
      refreshRequests();
    }
    setIsScheduleModalOpen(false);
  };

  const handleCreateRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    toast.success(`Pedido de ${formData.get('tipo')} criado com sucesso!`);
    setIsCreateModalOpen(false);
  };

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

  const RequestCard = ({ request }: { request: Request }) => {
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
        <CardContent className="space-y-3">
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
          
          {request.estado === 'por_fazer' && (
            <div className="flex gap-2 mt-4 pt-3 border-t">
              <Input
                type="file"
                id={`fileUpload-${request.id}`}
                accept=".pdf,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => handleUpload(e, request.id)}
              />
              <Button size="sm" onClick={() => document.getElementById(`fileUpload-${request.id}`)?.click()}>
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleSchedule(request)}>
                <Calendar className="h-4 w-4 mr-1" />
                Agendar
              </Button>
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
              {user?.role === 'utente' 
                ? 'Aceda aos pedidos associados à sua consulta' 
                : 'Gerir pedidos e exames dos utentes'}
            </p>
          </div>

          {/* Actions bar */}
          <div className="flex flex-wrap items-center gap-3">
            <Input
              type="file"
              id="fileUploadGeneral"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => handleUpload(e)}
            />
            <Button onClick={() => document.getElementById('fileUploadGeneral')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Documento
            </Button>

            {user?.role === 'medico' && (
              <>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="w-[250px]">
                    <SelectValue placeholder="Todos os utentes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os utentes</SelectItem>
                    {DB_PATIENTS.map(patient => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Pedido
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Novo Pedido</DialogTitle>
                      <DialogDescription>
                        Preencha os dados para criar um novo pedido de exame ou análise
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateRequest} className="space-y-4">
                      <div>
                        <Label htmlFor="tipo">Tipo</Label>
                        <Select name="tipo" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="analise">Análise</SelectItem>
                            <SelectItem value="exame">Exame</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="nome">Nome do Exame/Análise</Label>
                        <Input name="nome" required placeholder="ex: Hemograma completo" />
                      </div>
                      <div>
                        <Label htmlFor="descricao">Descrição</Label>
                        <Input name="descricao" placeholder="Instruções adicionais" />
                      </div>
                      <div>
                        <Label htmlFor="patientId">Utente</Label>
                        <Select name="patientId" required>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o utente" />
                          </SelectTrigger>
                          <SelectContent>
                            {DB_PATIENTS.map(patient => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button type="submit" className="w-full">Criar Pedido</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
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

      {/* Schedule Modal */}
      <Dialog open={isScheduleModalOpen} onOpenChange={setIsScheduleModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Agendar Exame</DialogTitle>
            <DialogDescription>
              Procure laboratórios disponíveis na sua cidade
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="bg-muted p-3 rounded-lg mb-4">
              <p className="font-semibold">{selectedRequest.nome}</p>
              <p className="text-sm text-muted-foreground">{selectedRequest.descricao}</p>
            </div>
          )}

          {!showLabs ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="distrito">Distrito</Label>
                <Select value={distrito} onValueChange={setDistrito}>
                  <SelectTrigger id="distrito">
                    <SelectValue placeholder="Selecione um distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {distritosPortugal.map(item => (
                      <SelectItem key={item} value={item}>{item}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={procurarLabs} className="w-full">
                Procurar Laboratórios
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm">Laboratórios disponíveis no distrito de <strong>{distrito}</strong>:</p>
              
              <div className="space-y-2">
                {availableLabs.map(lab => (
                  <Card 
                    key={lab.id} 
                    className={`cursor-pointer transition-all ${selectedLab === lab.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => {
                      setSelectedLab(lab.id);
                      setSelectedSlot(lab.id === 'synlab' ? synlabAgenda[0]?.id || '' : '');
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Building2 className="h-5 w-5 text-primary mt-1" />
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-semibold">{lab.nome}</h4>
                            {lab.api && <Badge variant="secondary">API agenda</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">{lab.endereco}</p>
                          {lab.id === 'synlab' && selectedLab === 'synlab' && (
                            <div className="mt-3 grid gap-2">
                              {synlabAgenda.map(slot => (
                                <button
                                  key={slot.id}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedSlot(slot.id);
                                  }}
                                  className={`flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors ${selectedSlot === slot.id ? 'border-primary bg-primary/10' : 'border-border bg-background'}`}
                                >
                                  <span>{slot.local}</span>
                                  <span className="flex items-center gap-1 font-medium"><Clock className="h-4 w-4" />{slot.label} · {slot.hora}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={confirmarAgendamento} className="flex-1">
                  Agendar e visitar site
                </Button>
                <Button variant="outline" onClick={() => setShowLabs(false)} className="flex-1">
                  Voltar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}