// Mock database for My São João

function addDays(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}

export interface Patient {
  id: string;
  nome: string;
  utente: string;
  lastConsulta?: string;
  nextConsulta?: string;
}

export interface Request {
  id: string;
  tipo: 'analise' | 'exame';
  nome: string;
  descricao: string;
  estado: 'por_fazer' | 'agendado' | 'concluido' | 'expirado';
  prazoISO: string;
  consultaAlvoId: string;
  fonte: string;
  anexos: string[];
  dataRealizacao?: string;
  agendamento?: string;
}

export const DB_PATIENTS: Patient[] = [
  {
    id: "c123",
    nome: "Bernardo Silva",
    utente: "123456789",
    lastConsulta: addDays(-30),
    nextConsulta: addDays(60)
  },
  {
    id: "c124",
    nome: "Joana Pereira",
    utente: "987654321",
    lastConsulta: addDays(-15),
    nextConsulta: addDays(45)
  }
];

export const DB_PEDIDOS: Request[] = [
  {
    id: "p1",
    tipo: "analise",
    nome: "Hemograma completo",
    descricao: "Colheita simples em laboratório.",
    estado: "por_fazer",
    prazoISO: addDays(7),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: []
  },
  {
    id: "p2",
    tipo: "analise",
    nome: "Glicemia em jejum",
    descricao: "Jejum recomendado de 8 horas antes da colheita.",
    estado: "por_fazer",
    prazoISO: addDays(5),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: []
  },
  {
    id: "p3",
    tipo: "exame",
    nome: "Ecografia abdominal",
    descricao: "Jejum de 6–8 horas antes do exame.",
    estado: "por_fazer",
    prazoISO: addDays(12),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: []
  },
  {
    id: "p4",
    tipo: "exame",
    nome: "Radiografia do Tórax PA",
    descricao: "Projeção posteroanterior.",
    estado: "por_fazer",
    prazoISO: addDays(10),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: []
  },
  {
    id: "p5",
    tipo: "analise",
    nome: "Perfil lipídico",
    descricao: "Colesterol total, HDL, LDL, triglicéridos.",
    estado: "expirado",
    prazoISO: addDays(-2),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: []
  },
  {
    id: "p6",
    tipo: "analise",
    nome: "TSH + T4 livre",
    descricao: "Avaliação da função tiroideia.",
    estado: "concluido",
    prazoISO: addDays(-10),
    consultaAlvoId: "c123",
    fonte: "medico",
    anexos: [],
    dataRealizacao: addDays(-12)
  }
];

const STORAGE_KEY = 'my_sao_joao_pedidos_state';

export const getPedidos = (): Request[] => {
  if (typeof window === 'undefined') return DB_PEDIDOS;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  const overrides = saved ? JSON.parse(saved) as Record<string, Partial<Request>> : {};

  return DB_PEDIDOS.map(request => ({ ...request, ...overrides[request.id] }));
};

export const updatePedidoLocal = (id: string, patch: Partial<Request>) => {
  if (typeof window === 'undefined') return;

  const saved = window.localStorage.getItem(STORAGE_KEY);
  const overrides = saved ? JSON.parse(saved) as Record<string, Partial<Request>> : {};
  overrides[id] = { ...overrides[id], ...patch };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  window.dispatchEvent(new CustomEvent('pedidos-updated'));
};

export const getPatientById = (id: string) => DB_PATIENTS.find(p => p.id === id);
export const getRequestsByPatient = (patientId: string) => getPedidos().filter(r => r.consultaAlvoId === patientId);
