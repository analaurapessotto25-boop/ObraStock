import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import {
  LayoutDashboard, Package, ShoppingCart, Warehouse, Factory,
  Truck, BarChart2, AlertTriangle, FileText, Menu, X, Bell,
  Plus, Search, Edit2, Trash2, ChevronDown, Upload, Download,
  RefreshCw, Printer, CheckCircle, Clock, XCircle, TrendingUp,
  TrendingDown, Activity, ArrowRight, Filter, MoreVertical,
  Eye, EyeOff, LogIn, LogOut, Shield, Users, Lock
} from "lucide-react";

// ─── auth ─────────────────────────────────────────────────────────────────────

interface User {
  name: string;
  role: string;
  login: string;
  password: string;
  avatar: string;
}

const USERS: User[] = [
  { name: "Administrador", role: "Administrador", login: "admin", password: "admin123", avatar: "AD" },
  { name: "Ana Paula Souza", role: "Gerente Logístico", login: "ana.souza", password: "logistica", avatar: "AS" },
  { name: "Carlos Mendes", role: "Operador de Estoque", login: "carlos.mendes", password: "estoque", avatar: "CM" },
  { name: "Demo", role: "Visitante", login: "demo", password: "demo", avatar: "DM" },
];

function LoginPage({ onLogin }: { onLogin: (u: User) => void }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const user = USERS.find(u => u.login === login && u.password === password);
      if (user) {
        onLogin(user);
      } else {
        setError("Login ou senha incorretos.");
        setLoading(false);
      }
    }, 600);
  }

  function quickLogin(u: User) {
    setLogin(u.login);
    setPassword(u.password);
  }

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#0f1c36" }}
    >
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[52%] p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #0a1628 0%, #0f1c36 40%, #1a2d52 100%)" }}>

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "48px 48px"
          }} />

        {/* Accent circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #1d6fdb 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }} />

        {/* Brand */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40">
              <Truck size={20} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-xl tracking-wide" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
                LogiControl
              </div>
              <div className="text-slate-400 text-xs">Sistema de Gestão Integrada Logística</div>
            </div>
          </div>

          <h2 className="text-white font-bold leading-tight mb-4"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "2.6rem" }}>
            Controle total<br />
            <span className="text-blue-400">da sua operação</span><br />
            logística.
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
            Gerencie suprimentos, estoque, armazenagem, produção, distribuição
            e indicadores de desempenho em uma única plataforma integrada.
          </p>
        </div>

        {/* Feature pills */}
        <div className="relative z-10 space-y-3">
          {[
            { icon: <Package size={14} />, label: "Controle de Estoque em Tempo Real" },
            { icon: <BarChart2 size={14} />, label: "KPIs e Indicadores Logísticos" },
            { icon: <Shield size={14} />, label: "Não Conformidades e Plano 5W2H" },
            { icon: <Truck size={14} />, label: "Rastreamento de Entregas e OTIF" },
          ].map((f, i) => (
            <div key={i} className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-6 h-6 rounded-md bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
                {f.icon}
              </div>
              {f.label}
            </div>
          ))}
        </div>

        <div className="relative z-10 text-xs text-slate-600">
          © 2025 LogiControl · Curso Técnico em Logística
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8"
        style={{ background: "#eef1f7" }}>
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
              <Truck size={18} className="text-white" />
            </div>
            <div>
              <div className="text-slate-900 font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.15rem" }}>LogiControl</div>
              <div className="text-slate-500 text-xs">Gestão Logística</div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-800 mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            Acesso ao sistema
          </h1>
          <p className="text-sm text-slate-500 mb-7">Informe suas credenciais para continuar.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Login</label>
              <input
                value={login}
                onChange={e => setLogin(e.target.value)}
                placeholder="seu.login"
                autoComplete="username"
                className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1.5">Senha</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full px-3.5 py-2.5 pr-10 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5">
                <AlertTriangle size={13} />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-semibold py-2.5 rounded-lg text-sm transition-all shadow-sm shadow-blue-200">
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Autenticando…</>
                : <><LogIn size={15} /> Entrar no Sistema</>
              }
            </button>
          </form>

          {/* Quick access */}
          <div className="mt-7">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400 font-medium">Acesso rápido (demo)</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {USERS.map(u => (
                <button key={u.login} onClick={() => quickLogin(u)}
                  className="flex items-center gap-2 px-3 py-2 text-left rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
                  <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 group-hover:bg-blue-600 transition-colors">
                    {u.avatar}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-slate-700 truncate">{u.name.split(" ")[0]}</div>
                    <div className="text-xs text-slate-400 truncate">{u.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-slate-400 mt-6">
            LogiControl v1.0 · Dados salvos localmente no navegador
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── types ───────────────────────────────────────────────────────────────────

type Module =
  | "dashboard" | "estoque" | "suprimentos" | "armazenagem"
  | "producao" | "distribuicao" | "indicadores" | "naoConformidades" | "relatorios";

interface Product {
  id: string; codigo: string; nome: string; categoria: string;
  unidade: string; qtdAtual: number; estoqueMin: number; estoqueMax: number;
  estoqueSeguranca: number; localizacao: string; validade?: string;
}

interface Supplier {
  id: string; nome: string; cnpj: string; contato: string;
  prazoEntrega: number; tipoMaterial: string; avaliacao: number;
}

interface PurchaseOrder {
  id: string; produtoId: string; fornecedorId: string;
  qtdSolicitada: number; dataPedido: string; previsaoEntrega: string;
  status: "pendente" | "em_andamento" | "entregue" | "atrasado";
}

interface WarehouseSector {
  id: string; setor: string; capacidade: number; ocupado: number; tipo: string;
}

interface ProductionOrder {
  id: string; numero: string; produto: string; qtdPlanejada: number;
  qtdProduzida: number; materiais: string; dataInicio: string;
  dataConclusao: string; status: "planejada" | "em_producao" | "concluida" | "atrasada";
}

interface Delivery {
  id: string; numero: string; cliente: string; produto: string;
  quantidade: number; endereco: string; transportadora: string;
  dataPrevista: string; dataReal: string; custoFrete: number;
  status: "aguardando" | "em_transporte" | "entregue" | "atrasado" | "devolvido";
}

interface NonConformity {
  id: string; codigo: string; setor: string; descricao: string;
  dataOcorrencia: string; responsavel: string;
  gravidade: "baixa" | "media" | "alta";
  status: "aberta" | "em_analise" | "em_correcao" | "concluida";
  plano5w2h?: {
    what: string; why: string; where: string; when: string;
    who: string; how: string; howMuch: string;
  };
}

interface AppData {
  products: Product[];
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  warehouseSectors: WarehouseSector[];
  productionOrders: ProductionOrder[];
  deliveries: Delivery[];
  nonConformities: NonConformity[];
}

// ─── seed data ────────────────────────────────────────────────────────────────

const SEED: AppData = {
  products: [
    { id: "p1", codigo: "MAT-001", nome: "Parafuso Sextavado M8", categoria: "Matéria-Prima", unidade: "kg", qtdAtual: 450, estoqueMin: 100, estoqueMax: 800, estoqueSeguranca: 150, localizacao: "A-01-03" },
    { id: "p2", codigo: "MAT-002", nome: "Chapa de Aço 2mm", categoria: "Matéria-Prima", unidade: "m²", qtdAtual: 85, estoqueMin: 200, estoqueMax: 600, estoqueSeguranca: 250, localizacao: "B-02-01" },
    { id: "p3", codigo: "PRD-001", nome: "Caixa de Papelão 40x30", categoria: "Embalagem", unidade: "un", qtdAtual: 1200, estoqueMin: 500, estoqueMax: 3000, estoqueSeguranca: 600, localizacao: "C-01-02" },
    { id: "p4", codigo: "PRD-002", nome: "Fita Adesiva Reforçada", categoria: "Embalagem", unidade: "rolo", qtdAtual: 320, estoqueMin: 100, estoqueMax: 500, estoqueSeguranca: 120, localizacao: "C-01-04" },
    { id: "p5", codigo: "QUI-001", nome: "Óleo Hidráulico ISO 46", categoria: "Químico", unidade: "L", qtdAtual: 60, estoqueMin: 80, estoqueMax: 300, estoqueSeguranca: 100, localizacao: "D-03-01", validade: "2026-03-15" },
    { id: "p6", codigo: "ELE-001", nome: "Relé Temporizado 24V", categoria: "Elétrico", unidade: "un", qtdAtual: 28, estoqueMin: 20, estoqueMax: 100, estoqueSeguranca: 25, localizacao: "E-01-01" },
    { id: "p7", codigo: "MAT-003", nome: "Tubo PVC 50mm", categoria: "Matéria-Prima", unidade: "m", qtdAtual: 380, estoqueMin: 150, estoqueMax: 700, estoqueSeguranca: 180, localizacao: "A-02-02" },
    { id: "p8", codigo: "PRD-003", nome: "Etiqueta Logística RFID", categoria: "Embalagem", unidade: "un", qtdAtual: 5000, estoqueMin: 1000, estoqueMax: 10000, estoqueSeguranca: 1200, localizacao: "C-02-01" },
  ],
  suppliers: [
    { id: "s1", nome: "MetalSul Distribuidora", cnpj: "12.345.678/0001-90", contato: "(11) 3344-5566", prazoEntrega: 7, tipoMaterial: "Metais e Fixadores", avaliacao: 5 },
    { id: "s2", nome: "Aço Brasil Ltda", cnpj: "23.456.789/0001-12", contato: "(21) 4455-6677", prazoEntrega: 14, tipoMaterial: "Chapas e Perfis", avaliacao: 4 },
    { id: "s3", nome: "EmbalaFlex Nordeste", cnpj: "34.567.890/0001-34", contato: "(85) 5566-7788", prazoEntrega: 5, tipoMaterial: "Embalagens", avaliacao: 4 },
    { id: "s4", nome: "QuimicPro Indústria", cnpj: "45.678.901/0001-56", contato: "(31) 6677-8899", prazoEntrega: 10, tipoMaterial: "Insumos Químicos", avaliacao: 3 },
    { id: "s5", nome: "Eletro Componentes Sul", cnpj: "56.789.012/0001-78", contato: "(51) 7788-9900", prazoEntrega: 8, tipoMaterial: "Componentes Elétricos", avaliacao: 5 },
  ],
  purchaseOrders: [
    { id: "po1", produtoId: "p2", fornecedorId: "s2", qtdSolicitada: 300, dataPedido: "2025-06-10", previsaoEntrega: "2025-06-24", status: "pendente" },
    { id: "po2", produtoId: "p5", fornecedorId: "s4", qtdSolicitada: 200, dataPedido: "2025-06-08", previsaoEntrega: "2025-06-18", status: "atrasado" },
    { id: "po3", produtoId: "p1", fornecedorId: "s1", qtdSolicitada: 500, dataPedido: "2025-06-12", previsaoEntrega: "2025-06-19", status: "em_andamento" },
    { id: "po4", produtoId: "p6", fornecedorId: "s5", qtdSolicitada: 50, dataPedido: "2025-06-14", previsaoEntrega: "2025-06-22", status: "pendente" },
    { id: "po5", produtoId: "p3", fornecedorId: "s3", qtdSolicitada: 2000, dataPedido: "2025-06-01", previsaoEntrega: "2025-06-06", status: "entregue" },
  ],
  warehouseSectors: [
    { id: "w1", setor: "Setor A — Matérias-Primas", capacidade: 1000, ocupado: 830, tipo: "Matéria-Prima" },
    { id: "w2", setor: "Setor B — Chapas e Perfis", capacidade: 800, ocupado: 720, tipo: "Estrutural" },
    { id: "w3", setor: "Setor C — Embalagens", capacidade: 1500, ocupado: 650, tipo: "Embalagem" },
    { id: "w4", setor: "Setor D — Químicos", capacidade: 400, ocupado: 160, tipo: "Químico" },
    { id: "w5", setor: "Setor E — Elétricos", capacidade: 300, ocupado: 85, tipo: "Elétrico" },
  ],
  productionOrders: [
    { id: "op1", numero: "OP-2025-001", produto: "Conjunto Estrutural Ref. A", qtdPlanejada: 200, qtdProduzida: 180, materiais: "Chapa de Aço 2mm, Parafuso M8", dataInicio: "2025-06-10", dataConclusao: "2025-06-20", status: "em_producao" },
    { id: "op2", numero: "OP-2025-002", produto: "Kit Embalagem Industrial", qtdPlanejada: 500, qtdProduzida: 500, materiais: "Caixa 40x30, Fita Adesiva, Etiqueta RFID", dataInicio: "2025-06-05", dataConclusao: "2025-06-15", status: "concluida" },
    { id: "op3", numero: "OP-2025-003", produto: "Módulo Hidráulico Compacto", qtdPlanejada: 50, qtdProduzida: 12, materiais: "Tubo PVC 50mm, Óleo Hidráulico", dataInicio: "2025-06-12", dataConclusao: "2025-06-25", status: "atrasada" },
    { id: "op4", numero: "OP-2025-004", produto: "Painel Elétrico Padrão", qtdPlanejada: 30, qtdProduzida: 0, materiais: "Relé Temporizado 24V", dataInicio: "2025-06-18", dataConclusao: "2025-06-30", status: "planejada" },
  ],
  deliveries: [
    { id: "d1", numero: "ENT-2025-0041", cliente: "Construções Oliveira SA", produto: "Conjunto Estrutural Ref. A", quantidade: 60, endereco: "São Paulo, SP", transportadora: "TransLog Express", dataPrevista: "2025-06-15", dataReal: "2025-06-15", custoFrete: 1850, status: "entregue" },
    { id: "d2", numero: "ENT-2025-0042", cliente: "Indústria Metálica RJ", produto: "Kit Embalagem Industrial", quantidade: 200, endereco: "Rio de Janeiro, RJ", transportadora: "RapidCargo", dataPrevista: "2025-06-17", dataReal: "", custoFrete: 2300, status: "em_transporte" },
    { id: "d3", numero: "ENT-2025-0043", cliente: "Distribuidora Norte Ltda", produto: "Módulo Hidráulico Compacto", quantidade: 10, endereco: "Belém, PA", transportadora: "Norte Frete", dataPrevista: "2025-06-14", dataReal: "", custoFrete: 3100, status: "atrasado" },
    { id: "d4", numero: "ENT-2025-0044", cliente: "Comércio Sul Alegre", produto: "Parafuso Sextavado M8", quantidade: 150, endereco: "Porto Alegre, RS", transportadora: "TransLog Express", dataPrevista: "2025-06-22", dataReal: "", custoFrete: 980, status: "aguardando" },
    { id: "d5", numero: "ENT-2025-0045", cliente: "Fábrica Centro-Oeste", produto: "Etiqueta Logística RFID", quantidade: 2000, endereco: "Goiânia, GO", transportadora: "RapidCargo", dataPrevista: "2025-06-18", dataReal: "2025-06-19", custoFrete: 1420, status: "entregue" },
  ],
  nonConformities: [
    { id: "nc1", codigo: "NC-2025-001", setor: "armazenagem", descricao: "Produto químico armazenado sem sinalização de risco adequada, em desacordo com NR-26.", dataOcorrencia: "2025-06-08", responsavel: "Carlos Mendes", gravidade: "alta", status: "em_correcao", plano5w2h: { what: "Instalar sinalização NR-26 em todos os pontos de armazenagem química", why: "Adequação à norma regulamentadora e eliminação de risco de acidente", where: "Setor D — Químicos", when: "2025-06-20", who: "Supervisor de Segurança", how: "Aquisição e instalação de placas e EPCs adequados", howMuch: "R$ 2.800,00" } },
    { id: "nc2", codigo: "NC-2025-002", setor: "distribuicao", descricao: "Entrega ENT-2025-0043 com atraso superior a 3 dias sem comunicação prévia ao cliente.", dataOcorrencia: "2025-06-15", responsavel: "Ana Paula Souza", gravidade: "media", status: "em_analise" },
    { id: "nc3", codigo: "NC-2025-003", setor: "producao", descricao: "OP-2025-003 apresenta eficiência de 24%, muito abaixo da meta de 85%.", dataOcorrencia: "2025-06-16", responsavel: "Roberto Lima", gravidade: "alta", status: "aberta" },
    { id: "nc4", codigo: "NC-2025-004", setor: "suprimentos", descricao: "Fornecedor QuimicPro entregou produto (Óleo ISO 46) fora do prazo contratual.", dataOcorrencia: "2025-06-18", responsavel: "Fernanda Alves", gravidade: "media", status: "aberta" },
  ],
};

// ─── localStorage helpers ─────────────────────────────────────────────────────

const STORAGE_KEY = "logicontrol_v1";

function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppData;
  } catch {}
  return SEED;
}

function saveData(data: AppData) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// ─── small helpers ────────────────────────────────────────────────────────────

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function stockStatus(p: Product): "critico" | "atencao" | "adequado" {
  if (p.qtdAtual <= p.estoqueMin) return "critico";
  if (p.qtdAtual <= p.estoqueSeguranca) return "atencao";
  return "adequado";
}

function occupancyPct(s: WarehouseSector) {
  return Math.round((s.ocupado / s.capacidade) * 100);
}

function Stars({ n }: { n: number }) {
  return (
    <span className="text-yellow-400 tracking-tight text-sm">
      {"★".repeat(n)}{"☆".repeat(5 - n)}
    </span>
  );
}

// ─── Status badges ────────────────────────────────────────────────────────────

const STOCK_BADGE: Record<string, string> = {
  adequado: "bg-emerald-100 text-emerald-700",
  atencao: "bg-amber-100 text-amber-700",
  critico: "bg-red-100 text-red-700",
};

const ORDER_STATUS_LABEL: Record<string, string> = {
  pendente: "Pendente", em_andamento: "Em Andamento",
  entregue: "Entregue", atrasado: "Atrasado",
};
const DELIVERY_STATUS_LABEL: Record<string, string> = {
  aguardando: "Aguardando", em_transporte: "Em Transporte",
  entregue: "Entregue", atrasado: "Atrasado", devolvido: "Devolvido",
};
const PROD_STATUS_LABEL: Record<string, string> = {
  planejada: "Planejada", em_producao: "Em Produção",
  concluida: "Concluída", atrasada: "Atrasada",
};
const NC_STATUS_LABEL: Record<string, string> = {
  aberta: "Aberta", em_analise: "Em Análise",
  em_correcao: "Em Correção", concluida: "Concluída",
};
const NC_SEVERITY_LABEL: Record<string, string> = {
  baixa: "Baixa", media: "Média", alta: "Alta",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${color}`}>
      {label}
    </span>
  );
}

function statusBadge(status: string, map: Record<string, string>, labelMap: Record<string, string>) {
  const colors: Record<string, string> = {
    pendente: "bg-amber-100 text-amber-700",
    em_andamento: "bg-blue-100 text-blue-700",
    entregue: "bg-emerald-100 text-emerald-700",
    atrasado: "bg-red-100 text-red-700",
    aguardando: "bg-slate-100 text-slate-600",
    em_transporte: "bg-blue-100 text-blue-700",
    devolvido: "bg-purple-100 text-purple-700",
    planejada: "bg-slate-100 text-slate-600",
    em_producao: "bg-blue-100 text-blue-700",
    concluida: "bg-emerald-100 text-emerald-700",
    atrasada: "bg-red-100 text-red-700",
    aberta: "bg-red-100 text-red-700",
    em_analise: "bg-amber-100 text-amber-700",
    em_correcao: "bg-blue-100 text-blue-700",
    baixa: "bg-emerald-100 text-emerald-700",
    media: "bg-amber-100 text-amber-700",
    alta: "bg-red-100 text-red-700",
  };
  return <Badge label={labelMap[status] ?? status} color={colors[status] ?? "bg-slate-100 text-slate-600"} />;
}

// ─── UI primitives ────────────────────────────────────────────────────────────

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-slate-200/60 ${className}`}>
      {children}
    </div>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-5">
      <div>
        <h2 className="text-xl font-semibold text-slate-800 tracking-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, className = "", type = "button", size = "md" }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "danger" | "ghost";
  onClick?: () => void; className?: string; type?: "button" | "submit";
  size?: "sm" | "md";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded transition-all";
  const sz = size === "sm" ? "px-2.5 py-1 text-xs" : "px-3.5 py-1.5 text-sm";
  const v: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    ghost: "text-slate-500 hover:text-slate-800 hover:bg-slate-100",
  };
  return (
    <button type={type} onClick={onClick} className={`${base} ${sz} ${v[variant]} ${className}`}>
      {children}
    </button>
  );
}

function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
      <input {...props} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition" />
    </div>
  );
}

function Select({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
      <select {...props} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition">
        {children}
      </select>
    </div>
  );
}

function Textarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-xs font-medium text-slate-600">{label}</label>}
      <textarea {...props} className="w-full px-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition resize-none" />
    </div>
  );
}

function Modal({ open, title, onClose, children }: { open: boolean; title: string; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,28,54,0.45)" }}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h3 className="font-semibold text-slate-800" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem" }}>{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition"><X size={18} /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, sub, color = "blue", icon }: {
  label: string; value: string | number; sub?: string;
  color?: "blue" | "green" | "amber" | "red" | "purple"; icon: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600", green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600", red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <Card className="p-4 flex items-start gap-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-slate-800 leading-tight" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
        <div className="text-sm font-medium text-slate-600 mt-0.5">{label}</div>
        {sub && <div className="text-xs text-slate-400 mt-0.5">{sub}</div>}
      </div>
    </Card>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({ data }: { data: AppData }) {
  const { products, suppliers, purchaseOrders, deliveries, productionOrders, nonConformities, warehouseSectors } = data;

  const belowMin = products.filter(p => p.qtdAtual <= p.estoqueMin).length;
  const pendingOrders = purchaseOrders.filter(p => p.status === "pendente").length;
  const lateDeliveries = deliveries.filter(d => d.status === "atrasado").length;
  const totalOcupado = warehouseSectors.reduce((a, s) => a + s.ocupado, 0);
  const totalCapacity = warehouseSectors.reduce((a, s) => a + s.capacidade, 0);
  const occupancyPctTotal = Math.round((totalOcupado / totalCapacity) * 100);
  const activeSuppliers = suppliers.length;
  const openProds = productionOrders.filter(o => o.status === "em_producao" || o.status === "planejada").length;
  const openNCs = nonConformities.filter(nc => nc.status !== "concluida").length;

  const stockChartData = products.slice(0, 6).map(p => ({
    name: p.nome.length > 14 ? p.nome.slice(0, 14) + "…" : p.nome,
    atual: p.qtdAtual, minimo: p.estoqueMin, maximo: p.estoqueMax,
  }));

  const deliveryData = [
    { name: "No Prazo", value: deliveries.filter(d => d.status === "entregue").length },
    { name: "Atrasadas", value: lateDeliveries },
    { name: "Em Trânsito", value: deliveries.filter(d => d.status === "em_transporte").length },
  ];

  const warehouseData = warehouseSectors.map(s => ({
    setor: s.setor.split("—")[0].trim(), pct: occupancyPct(s), cap: s.capacidade,
  }));

  const ncBySector = [
    { setor: "Armazenagem", qt: nonConformities.filter(n => n.setor === "armazenagem").length },
    { setor: "Distribuição", qt: nonConformities.filter(n => n.setor === "distribuicao").length },
    { setor: "Produção", qt: nonConformities.filter(n => n.setor === "producao").length },
    { setor: "Suprimentos", qt: nonConformities.filter(n => n.setor === "suprimentos").length },
  ].filter(x => x.qt > 0);

  const PIE_COLORS = ["#16a34a", "#dc2626", "#1d6fdb", "#d97706"];

  return (
    <div>
      <SectionHeader title="Dashboard Geral" subtitle="Visão consolidada dos processos logísticos" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Produtos Cadastrados" value={products.length} color="blue" icon={<Package size={18} />} />
        <StatCard label="Abaixo do Mínimo" value={belowMin} color={belowMin > 0 ? "red" : "green"} icon={<AlertTriangle size={18} />} sub={belowMin > 0 ? "Requer atenção" : "Estoque OK"} />
        <StatCard label="Pedidos Pendentes" value={pendingOrders} color="amber" icon={<ShoppingCart size={18} />} />
        <StatCard label="Entregas Atrasadas" value={lateDeliveries} color={lateDeliveries > 0 ? "red" : "green"} icon={<Truck size={18} />} />
        <StatCard label="Ocupação Armazém" value={`${occupancyPctTotal}%`} color={occupancyPctTotal > 85 ? "red" : occupancyPctTotal > 70 ? "amber" : "green"} icon={<Warehouse size={18} />} />
        <StatCard label="Fornecedores Ativos" value={activeSuppliers} color="blue" icon={<Activity size={18} />} />
        <StatCard label="Ordens em Aberto" value={openProds} color="purple" icon={<Factory size={18} />} />
        <StatCard label="Não Conformidades" value={openNCs} color={openNCs > 2 ? "red" : "amber"} icon={<XCircle size={18} />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Estoque por Produto</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={stockChartData} margin={{ top: 0, right: 10, bottom: 0, left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="atual" fill="#1d6fdb" name="Atual" radius={[3, 3, 0, 0]} />
              <Bar dataKey="minimo" fill="#fbbf24" name="Mínimo" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Status das Entregas</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={deliveryData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {deliveryData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Ocupação do Armazém (%)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={warehouseData} layout="vertical" margin={{ left: 60, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="setor" tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" fill="#7c3aed" name="Ocupação" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">NC por Setor</h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={ncBySector}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="setor" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="qt" fill="#dc2626" name="NCs" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ─── Products / Estoque ───────────────────────────────────────────────────────

function EstoqueModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Partial<Product>>({});
  const [movModal, setMovModal] = useState<{ type: "entrada" | "saida"; product: Product } | null>(null);
  const [movQty, setMovQty] = useState("");

  const filtered = data.products.filter(p =>
    p.nome.toLowerCase().includes(search.toLowerCase()) ||
    p.codigo.toLowerCase().includes(search.toLowerCase())
  );

  function openNew() { setEditing(null); setForm({}); setModal(true); }
  function openEdit(p: Product) { setEditing(p); setForm(p); setModal(true); }
  function save() {
    const p = { ...form, id: editing?.id ?? uid() } as Product;
    const products = editing
      ? data.products.map(x => x.id === p.id ? p : x)
      : [...data.products, p];
    setData({ ...data, products });
    setModal(false);
  }
  function remove(id: string) {
    setData({ ...data, products: data.products.filter(p => p.id !== id) });
  }
  function applyMove() {
    if (!movModal) return;
    const qty = parseInt(movQty);
    if (!qty || qty <= 0) return;
    const products = data.products.map(p => {
      if (p.id !== movModal.product.id) return p;
      const qtdAtual = movModal.type === "entrada" ? p.qtdAtual + qty : Math.max(0, p.qtdAtual - qty);
      return { ...p, qtdAtual };
    });
    setData({ ...data, products });
    setMovModal(null);
    setMovQty("");
  }

  return (
    <div>
      <SectionHeader
        title="Produtos e Estoque"
        subtitle={`${data.products.length} produtos cadastrados`}
        action={<Btn onClick={openNew}><Plus size={14} /> Novo Produto</Btn>}
      />
      <Card>
        <div className="flex gap-2 p-3 border-b border-slate-100">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por código ou nome…"
              className="w-full pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Código</th>
                <th className="text-left px-4 py-2.5 font-medium">Nome</th>
                <th className="text-left px-4 py-2.5 font-medium">Categoria</th>
                <th className="text-right px-4 py-2.5 font-medium">Atual</th>
                <th className="text-right px-4 py-2.5 font-medium">Mín.</th>
                <th className="text-left px-4 py-2.5 font-medium">Local</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(p => {
                const st = stockStatus(p);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{p.codigo}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{p.nome}</td>
                    <td className="px-4 py-2.5 text-slate-600">{p.categoria}</td>
                    <td className="px-4 py-2.5 text-right font-mono font-medium">{p.qtdAtual} {p.unidade}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-slate-500">{p.estoqueMin}</td>
                    <td className="px-4 py-2.5 text-slate-500 text-xs">{p.localizacao}</td>
                    <td className="px-4 py-2.5">
                      <Badge label={st === "critico" ? "Crítico" : st === "atencao" ? "Atenção" : "Adequado"} color={STOCK_BADGE[st]} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 justify-end">
                        <Btn size="sm" variant="ghost" onClick={() => setMovModal({ type: "entrada", product: p })}>+E</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => setMovModal({ type: "saida", product: p })}>-S</Btn>
                        <Btn size="sm" variant="ghost" onClick={() => openEdit(p)}><Edit2 size={12} /></Btn>
                        <Btn size="sm" variant="danger" onClick={() => remove(p.id)}><Trash2 size={12} /></Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal} title={editing ? "Editar Produto" : "Novo Produto"} onClose={() => setModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Código" value={form.codigo ?? ""} onChange={e => setForm({ ...form, codigo: e.target.value })} />
          <Input label="Nome" value={form.nome ?? ""} onChange={e => setForm({ ...form, nome: e.target.value })} />
          <Select label="Categoria" value={form.categoria ?? ""} onChange={e => setForm({ ...form, categoria: e.target.value })}>
            <option value="">Selecione…</option>
            {["Matéria-Prima", "Embalagem", "Químico", "Elétrico", "Produto Acabado"].map(c => <option key={c}>{c}</option>)}
          </Select>
          <Input label="Unidade" value={form.unidade ?? ""} onChange={e => setForm({ ...form, unidade: e.target.value })} placeholder="kg, un, m², L…" />
          <Input label="Qtd. Atual" type="number" value={form.qtdAtual ?? ""} onChange={e => setForm({ ...form, qtdAtual: +e.target.value })} />
          <Input label="Estoque Mínimo" type="number" value={form.estoqueMin ?? ""} onChange={e => setForm({ ...form, estoqueMin: +e.target.value })} />
          <Input label="Estoque Máximo" type="number" value={form.estoqueMax ?? ""} onChange={e => setForm({ ...form, estoqueMax: +e.target.value })} />
          <Input label="Estoque de Segurança" type="number" value={form.estoqueSeguranca ?? ""} onChange={e => setForm({ ...form, estoqueSeguranca: +e.target.value })} />
          <Input label="Localização" value={form.localizacao ?? ""} onChange={e => setForm({ ...form, localizacao: e.target.value })} placeholder="A-01-03" />
          <Input label="Validade (opcional)" type="date" value={form.validade ?? ""} onChange={e => setForm({ ...form, validade: e.target.value })} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Salvar Produto</Btn>
        </div>
      </Modal>

      <Modal open={!!movModal} title={movModal?.type === "entrada" ? "Registrar Entrada" : "Registrar Saída"} onClose={() => setMovModal(null)}>
        {movModal && (
          <div className="space-y-3">
            <p className="text-sm text-slate-600">Produto: <strong>{movModal.product.nome}</strong> — Atual: <strong>{movModal.product.qtdAtual} {movModal.product.unidade}</strong></p>
            <Input label="Quantidade" type="number" value={movQty} onChange={e => setMovQty(e.target.value)} />
            <div className="flex justify-end gap-2 mt-3">
              <Btn variant="secondary" onClick={() => setMovModal(null)}>Cancelar</Btn>
              <Btn onClick={applyMove}>Confirmar</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Suprimentos ─────────────────────────────────────────────────────────────

function SuprimentosModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [tab, setTab] = useState<"fornecedores" | "pedidos">("fornecedores");
  const [suppModal, setSuppModal] = useState(false);
  const [editSupp, setEditSupp] = useState<Supplier | null>(null);
  const [suppForm, setSuppForm] = useState<Partial<Supplier>>({});
  const [orderModal, setOrderModal] = useState(false);
  const [orderForm, setOrderForm] = useState<Partial<PurchaseOrder>>({});

  function saveSupp() {
    const s = { ...suppForm, id: editSupp?.id ?? uid() } as Supplier;
    const suppliers = editSupp
      ? data.suppliers.map(x => x.id === s.id ? s : x)
      : [...data.suppliers, s];
    setData({ ...data, suppliers });
    setSuppModal(false);
  }
  function removeSupp(id: string) {
    setData({ ...data, suppliers: data.suppliers.filter(s => s.id !== id) });
  }
  function saveOrder() {
    const o = { ...orderForm, id: uid() } as PurchaseOrder;
    setData({ ...data, purchaseOrders: [...data.purchaseOrders, o] });
    setOrderModal(false);
    setOrderForm({});
  }
  function removeOrder(id: string) {
    setData({ ...data, purchaseOrders: data.purchaseOrders.filter(o => o.id !== id) });
  }
  function updateOrderStatus(id: string, status: PurchaseOrder["status"]) {
    setData({ ...data, purchaseOrders: data.purchaseOrders.map(o => o.id === id ? { ...o, status } : o) });
  }

  const prodMap = Object.fromEntries(data.products.map(p => [p.id, p]));
  const suppMap = Object.fromEntries(data.suppliers.map(s => [s.id, s]));

  return (
    <div>
      <SectionHeader title="Suprimentos" subtitle="Fornecedores e pedidos de compra" />
      <div className="flex gap-1 mb-4">
        {(["fornecedores", "pedidos"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 text-sm font-medium rounded transition-all ${tab === t ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
            {t === "fornecedores" ? "Fornecedores" : "Pedidos de Compra"}
          </button>
        ))}
      </div>

      {tab === "fornecedores" && (
        <>
          <div className="flex justify-end mb-3">
            <Btn onClick={() => { setEditSupp(null); setSuppForm({}); setSuppModal(true); }}><Plus size={14} /> Novo Fornecedor</Btn>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-2.5 font-medium">Nome</th>
                    <th className="text-left px-4 py-2.5 font-medium">CNPJ</th>
                    <th className="text-left px-4 py-2.5 font-medium">Contato</th>
                    <th className="text-left px-4 py-2.5 font-medium">Material</th>
                    <th className="text-center px-4 py-2.5 font-medium">Prazo</th>
                    <th className="text-center px-4 py-2.5 font-medium">Avaliação</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.suppliers.map(s => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{s.nome}</td>
                      <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{s.cnpj}</td>
                      <td className="px-4 py-2.5 text-slate-600">{s.contato}</td>
                      <td className="px-4 py-2.5 text-slate-600">{s.tipoMaterial}</td>
                      <td className="px-4 py-2.5 text-center text-slate-600">{s.prazoEntrega}d</td>
                      <td className="px-4 py-2.5 text-center"><Stars n={s.avaliacao} /></td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1 justify-end">
                          <Btn size="sm" variant="ghost" onClick={() => { setEditSupp(s); setSuppForm(s); setSuppModal(true); }}><Edit2 size={12} /></Btn>
                          <Btn size="sm" variant="danger" onClick={() => removeSupp(s.id)}><Trash2 size={12} /></Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      {tab === "pedidos" && (
        <>
          <div className="flex justify-end mb-3">
            <Btn onClick={() => { setOrderForm({ status: "pendente", dataPedido: new Date().toISOString().slice(0, 10) }); setOrderModal(true); }}><Plus size={14} /> Novo Pedido</Btn>
          </div>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-2.5 font-medium">Produto</th>
                    <th className="text-left px-4 py-2.5 font-medium">Fornecedor</th>
                    <th className="text-right px-4 py-2.5 font-medium">Qtd</th>
                    <th className="text-left px-4 py-2.5 font-medium">Pedido</th>
                    <th className="text-left px-4 py-2.5 font-medium">Previsão</th>
                    <th className="text-left px-4 py-2.5 font-medium">Status</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.purchaseOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 font-medium text-slate-800">{prodMap[o.produtoId]?.nome ?? o.produtoId}</td>
                      <td className="px-4 py-2.5 text-slate-600">{suppMap[o.fornecedorId]?.nome ?? o.fornecedorId}</td>
                      <td className="px-4 py-2.5 text-right font-mono">{o.qtdSolicitada}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{o.dataPedido}</td>
                      <td className="px-4 py-2.5 text-slate-500 text-xs">{o.previsaoEntrega}</td>
                      <td className="px-4 py-2.5">{statusBadge(o.status, ORDER_STATUS_LABEL, ORDER_STATUS_LABEL)}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1 justify-end">
                          <select value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value as PurchaseOrder["status"])}
                            className="text-xs px-1.5 py-1 border border-slate-200 rounded bg-slate-50">
                            {(["pendente", "em_andamento", "entregue", "atrasado"] as const).map(s => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
                          </select>
                          <Btn size="sm" variant="danger" onClick={() => removeOrder(o.id)}><Trash2 size={12} /></Btn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-4 mt-4">
            <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Necessidade de Compra</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-2 font-medium">Produto</th>
                    <th className="text-right px-4 py-2 font-medium">Atual</th>
                    <th className="text-right px-4 py-2 font-medium">Seg.</th>
                    <th className="text-right px-4 py-2 font-medium">Demanda Prev.</th>
                    <th className="text-right px-4 py-2 font-medium">Necessidade</th>
                    <th className="text-left px-4 py-2 font-medium">Alerta</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.products.map(p => {
                    const demanda = Math.round(p.estoqueMax * 0.4);
                    const necessidade = demanda + p.estoqueSeguranca - p.qtdAtual;
                    return (
                      <tr key={p.id} className="hover:bg-slate-50">
                        <td className="px-4 py-2">{p.nome}</td>
                        <td className="px-4 py-2 text-right font-mono">{p.qtdAtual}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">{p.estoqueSeguranca}</td>
                        <td className="px-4 py-2 text-right font-mono text-slate-500">{demanda}</td>
                        <td className={`px-4 py-2 text-right font-mono font-medium ${necessidade > 0 ? "text-red-600" : "text-emerald-600"}`}>{necessidade > 0 ? `+${necessidade}` : necessidade}</td>
                        <td className="px-4 py-2">{necessidade > 0 && <Badge label="Comprar" color="bg-red-50 text-red-600" />}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <Modal open={suppModal} title={editSupp ? "Editar Fornecedor" : "Novo Fornecedor"} onClose={() => setSuppModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nome" value={suppForm.nome ?? ""} onChange={e => setSuppForm({ ...suppForm, nome: e.target.value })} />
          <Input label="CNPJ" value={suppForm.cnpj ?? ""} onChange={e => setSuppForm({ ...suppForm, cnpj: e.target.value })} placeholder="00.000.000/0001-00" />
          <Input label="Contato" value={suppForm.contato ?? ""} onChange={e => setSuppForm({ ...suppForm, contato: e.target.value })} />
          <Input label="Tipo de Material" value={suppForm.tipoMaterial ?? ""} onChange={e => setSuppForm({ ...suppForm, tipoMaterial: e.target.value })} />
          <Input label="Prazo Médio (dias)" type="number" value={suppForm.prazoEntrega ?? ""} onChange={e => setSuppForm({ ...suppForm, prazoEntrega: +e.target.value })} />
          <Select label="Avaliação" value={suppForm.avaliacao ?? ""} onChange={e => setSuppForm({ ...suppForm, avaliacao: +e.target.value })}>
            <option value="">Selecione…</option>
            {[1, 2, 3, 4, 5].map(n => <option key={n} value={n}>{n} estrela{n > 1 ? "s" : ""}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setSuppModal(false)}>Cancelar</Btn>
          <Btn onClick={saveSupp}>Salvar</Btn>
        </div>
      </Modal>

      <Modal open={orderModal} title="Novo Pedido de Compra" onClose={() => setOrderModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Produto" value={orderForm.produtoId ?? ""} onChange={e => setOrderForm({ ...orderForm, produtoId: e.target.value })}>
            <option value="">Selecione…</option>
            {data.products.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
          </Select>
          <Select label="Fornecedor" value={orderForm.fornecedorId ?? ""} onChange={e => setOrderForm({ ...orderForm, fornecedorId: e.target.value })}>
            <option value="">Selecione…</option>
            {data.suppliers.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
          </Select>
          <Input label="Qtd. Solicitada" type="number" value={orderForm.qtdSolicitada ?? ""} onChange={e => setOrderForm({ ...orderForm, qtdSolicitada: +e.target.value })} />
          <Input label="Data do Pedido" type="date" value={orderForm.dataPedido ?? ""} onChange={e => setOrderForm({ ...orderForm, dataPedido: e.target.value })} />
          <Input label="Previsão de Entrega" type="date" value={orderForm.previsaoEntrega ?? ""} onChange={e => setOrderForm({ ...orderForm, previsaoEntrega: e.target.value })} />
          <Select label="Status" value={orderForm.status ?? "pendente"} onChange={e => setOrderForm({ ...orderForm, status: e.target.value as PurchaseOrder["status"] })}>
            {(["pendente", "em_andamento", "entregue", "atrasado"] as const).map(s => <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setOrderModal(false)}>Cancelar</Btn>
          <Btn onClick={saveOrder}>Salvar Pedido</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Armazenagem ──────────────────────────────────────────────────────────────

function ArmazenagemModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<WarehouseSector>>({});
  const [editing, setEditing] = useState<WarehouseSector | null>(null);

  const totalCap = data.warehouseSectors.reduce((a, s) => a + s.capacidade, 0);
  const totalOc = data.warehouseSectors.reduce((a, s) => a + s.ocupado, 0);
  const totalPct = Math.round((totalOc / totalCap) * 100);

  function save() {
    const s = { ...form, id: editing?.id ?? uid() } as WarehouseSector;
    const warehouseSectors = editing
      ? data.warehouseSectors.map(x => x.id === s.id ? s : x)
      : [...data.warehouseSectors, s];
    setData({ ...data, warehouseSectors });
    setModal(false);
  }
  function remove(id: string) {
    setData({ ...data, warehouseSectors: data.warehouseSectors.filter(s => s.id !== id) });
  }

  const expiringProducts = data.products.filter(p => {
    if (!p.validade) return false;
    const diff = (new Date(p.validade).getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return diff <= 90;
  });

  return (
    <div>
      <SectionHeader title="Armazenagem" subtitle="Controle de capacidade e localização"
        action={<Btn onClick={() => { setEditing(null); setForm({}); setModal(true); }}><Plus size={14} /> Novo Setor</Btn>}
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Capacidade Total" value={totalCap} color="blue" icon={<Warehouse size={18} />} sub="unidades" />
        <StatCard label="Total Ocupado" value={totalOc} color={totalPct > 85 ? "red" : "amber"} icon={<Package size={18} />} sub="unidades" />
        <StatCard label="Ocupação Geral" value={`${totalPct}%`} color={totalPct > 85 ? "red" : totalPct > 70 ? "amber" : "green"} icon={<BarChart2 size={18} />} />
      </div>

      <Card className="mb-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Setor</th>
                <th className="text-left px-4 py-2.5 font-medium">Tipo</th>
                <th className="text-right px-4 py-2.5 font-medium">Capacidade</th>
                <th className="text-right px-4 py-2.5 font-medium">Ocupado</th>
                <th className="text-left px-4 py-2.5 font-medium">Ocupação</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.warehouseSectors.map(s => {
                const pct = occupancyPct(s);
                const st = pct > 90 ? "critico" : pct > 75 ? "atencao" : "adequado";
                return (
                  <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-medium text-slate-800">{s.setor}</td>
                    <td className="px-4 py-2.5 text-slate-600">{s.tipo}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{s.capacidade}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{s.ocupado}</td>
                    <td className="px-4 py-2.5 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all ${st === "critico" ? "bg-red-500" : st === "atencao" ? "bg-amber-400" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-8">{pct}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <Badge label={st === "critico" ? "Crítico" : st === "atencao" ? "Atenção" : "Adequado"} color={STOCK_BADGE[st]} />
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 justify-end">
                        <Btn size="sm" variant="ghost" onClick={() => { setEditing(s); setForm(s); setModal(true); }}><Edit2 size={12} /></Btn>
                        <Btn size="sm" variant="danger" onClick={() => remove(s.id)}><Trash2 size={12} /></Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {expiringProducts.length > 0 && (
        <Card className="p-4 border-amber-200 bg-amber-50">
          <h3 className="text-sm font-semibold text-amber-700 mb-2 flex items-center gap-2"><AlertTriangle size={14} /> Produtos Próximos ao Vencimento</h3>
          {expiringProducts.map(p => (
            <div key={p.id} className="text-sm text-amber-800">{p.nome} — Vence em: {p.validade} — Local: {p.localizacao}</div>
          ))}
        </Card>
      )}

      <Modal open={modal} title={editing ? "Editar Setor" : "Novo Setor"} onClose={() => setModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2"><Input label="Nome do Setor" value={form.setor ?? ""} onChange={e => setForm({ ...form, setor: e.target.value })} /></div>
          <Input label="Capacidade Total" type="number" value={form.capacidade ?? ""} onChange={e => setForm({ ...form, capacidade: +e.target.value })} />
          <Input label="Espaço Ocupado" type="number" value={form.ocupado ?? ""} onChange={e => setForm({ ...form, ocupado: +e.target.value })} />
          <div className="col-span-2"><Input label="Tipo de Material" value={form.tipo ?? ""} onChange={e => setForm({ ...form, tipo: e.target.value })} /></div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Salvar</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Produção ─────────────────────────────────────────────────────────────────

function ProducaoModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<ProductionOrder | null>(null);
  const [form, setForm] = useState<Partial<ProductionOrder>>({});

  const totalEfficiency = (() => {
    const concluded = data.productionOrders.filter(o => o.status === "concluida");
    if (!concluded.length) return 0;
    const pct = concluded.map(o => Math.round((o.qtdProduzida / o.qtdPlanejada) * 100));
    return Math.round(pct.reduce((a, b) => a + b, 0) / pct.length);
  })();

  function save() {
    const o = { ...form, id: editing?.id ?? uid() } as ProductionOrder;
    const productionOrders = editing
      ? data.productionOrders.map(x => x.id === o.id ? o : x)
      : [...data.productionOrders, o];
    setData({ ...data, productionOrders });
    setModal(false);
  }
  function remove(id: string) {
    setData({ ...data, productionOrders: data.productionOrders.filter(o => o.id !== id) });
  }
  function updateStatus(id: string, status: ProductionOrder["status"]) {
    setData({ ...data, productionOrders: data.productionOrders.map(o => o.id === id ? { ...o, status } : o) });
  }

  const chartData = data.productionOrders.map(o => ({
    name: o.numero.replace("OP-2025-", "OP-"),
    planejado: o.qtdPlanejada, produzido: o.qtdProduzida,
    efic: o.qtdPlanejada > 0 ? Math.round((o.qtdProduzida / o.qtdPlanejada) * 100) : 0,
  }));

  return (
    <div>
      <SectionHeader title="Produção" subtitle="Ordens de produção e eficiência"
        action={<Btn onClick={() => { setEditing(null); setForm({ status: "planejada", numero: `OP-${Date.now().toString().slice(-4)}` }); setModal(true); }}><Plus size={14} /> Nova O.P.</Btn>}
      />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <StatCard label="Eficiência Média" value={`${totalEfficiency}%`} color={totalEfficiency >= 85 ? "green" : totalEfficiency >= 60 ? "amber" : "red"} icon={<TrendingUp size={18} />} />
        <StatCard label="Em Produção" value={data.productionOrders.filter(o => o.status === "em_producao").length} color="blue" icon={<Factory size={18} />} />
        <StatCard label="Atrasadas" value={data.productionOrders.filter(o => o.status === "atrasada").length} color="red" icon={<AlertTriangle size={18} />} />
      </div>

      <Card className="p-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Planejado × Produzido</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="planejado" fill="#94a3b8" name="Planejado" radius={[3, 3, 0, 0]} />
            <Bar dataKey="produzido" fill="#1d6fdb" name="Produzido" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Nº O.P.</th>
                <th className="text-left px-4 py-2.5 font-medium">Produto</th>
                <th className="text-right px-4 py-2.5 font-medium">Plan.</th>
                <th className="text-right px-4 py-2.5 font-medium">Prod.</th>
                <th className="text-left px-4 py-2.5 font-medium">Eficiência</th>
                <th className="text-left px-4 py-2.5 font-medium">Período</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.productionOrders.map(o => {
                const efic = o.qtdPlanejada > 0 ? Math.round((o.qtdProduzida / o.qtdPlanejada) * 100) : 0;
                return (
                  <tr key={o.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{o.numero}</td>
                    <td className="px-4 py-2.5 font-medium text-slate-800">{o.produto}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{o.qtdPlanejada}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{o.qtdProduzida}</td>
                    <td className="px-4 py-2.5 w-32">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${efic >= 85 ? "bg-emerald-500" : efic >= 60 ? "bg-amber-400" : "bg-red-500"}`} style={{ width: `${efic}%` }} />
                        </div>
                        <span className="text-xs font-mono text-slate-500 w-8">{efic}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-slate-500">{o.dataInicio} → {o.dataConclusao}</td>
                    <td className="px-4 py-2.5">{statusBadge(o.status, PROD_STATUS_LABEL, PROD_STATUS_LABEL)}</td>
                    <td className="px-4 py-2.5">
                      <div className="flex gap-1 justify-end">
                        <select value={o.status} onChange={e => updateStatus(o.id, e.target.value as ProductionOrder["status"])}
                          className="text-xs px-1.5 py-1 border border-slate-200 rounded bg-slate-50">
                          {(["planejada", "em_producao", "concluida", "atrasada"] as const).map(s => <option key={s} value={s}>{PROD_STATUS_LABEL[s]}</option>)}
                        </select>
                        <Btn size="sm" variant="ghost" onClick={() => { setEditing(o); setForm(o); setModal(true); }}><Edit2 size={12} /></Btn>
                        <Btn size="sm" variant="danger" onClick={() => remove(o.id)}><Trash2 size={12} /></Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal} title={editing ? "Editar O.P." : "Nova Ordem de Produção"} onClose={() => setModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nº da Ordem" value={form.numero ?? ""} onChange={e => setForm({ ...form, numero: e.target.value })} />
          <Input label="Produto" value={form.produto ?? ""} onChange={e => setForm({ ...form, produto: e.target.value })} />
          <Input label="Qtd. Planejada" type="number" value={form.qtdPlanejada ?? ""} onChange={e => setForm({ ...form, qtdPlanejada: +e.target.value })} />
          <Input label="Qtd. Produzida" type="number" value={form.qtdProduzida ?? ""} onChange={e => setForm({ ...form, qtdProduzida: +e.target.value })} />
          <Input label="Data de Início" type="date" value={form.dataInicio ?? ""} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
          <Input label="Data de Conclusão" type="date" value={form.dataConclusao ?? ""} onChange={e => setForm({ ...form, dataConclusao: e.target.value })} />
          <div className="col-span-2"><Input label="Materiais Necessários" value={form.materiais ?? ""} onChange={e => setForm({ ...form, materiais: e.target.value })} /></div>
          <div className="col-span-2">
            <Select label="Status" value={form.status ?? "planejada"} onChange={e => setForm({ ...form, status: e.target.value as ProductionOrder["status"] })}>
              {(["planejada", "em_producao", "concluida", "atrasada"] as const).map(s => <option key={s} value={s}>{PROD_STATUS_LABEL[s]}</option>)}
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Salvar</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Distribuição ─────────────────────────────────────────────────────────────

function DistribuicaoModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState<Partial<Delivery>>({});
  const [editing, setEditing] = useState<Delivery | null>(null);

  const entregues = data.deliveries.filter(d => d.status === "entregue");
  const atrasados = data.deliveries.filter(d => d.status === "atrasado");
  const otif = data.deliveries.length > 0 ? Math.round((entregues.length / data.deliveries.length) * 100) : 0;
  const avgFrete = data.deliveries.length > 0
    ? Math.round(data.deliveries.reduce((a, d) => a + d.custoFrete, 0) / data.deliveries.length)
    : 0;

  function save() {
    const d = { ...form, id: editing?.id ?? uid() } as Delivery;
    const deliveries = editing
      ? data.deliveries.map(x => x.id === d.id ? d : x)
      : [...data.deliveries, d];
    setData({ ...data, deliveries });
    setModal(false);
  }
  function remove(id: string) {
    setData({ ...data, deliveries: data.deliveries.filter(d => d.id !== id) });
  }
  function updateStatus(id: string, status: Delivery["status"]) {
    setData({ ...data, deliveries: data.deliveries.map(d => d.id === id ? { ...d, status } : d) });
  }

  return (
    <div>
      <SectionHeader title="Distribuição e Transporte" subtitle="Controle de entregas e fretes"
        action={<Btn onClick={() => { setEditing(null); setForm({ status: "aguardando", numero: `ENT-${Date.now().toString().slice(-4)}` }); setModal(true); }}><Plus size={14} /> Nova Entrega</Btn>}
      />

      <div className="grid grid-cols-4 gap-3 mb-5">
        <StatCard label="OTIF" value={`${otif}%`} color={otif >= 90 ? "green" : otif >= 75 ? "amber" : "red"} icon={<CheckCircle size={18} />} sub="No prazo e completo" />
        <StatCard label="Entregas Realizadas" value={entregues.length} color="green" icon={<Truck size={18} />} />
        <StatCard label="Atrasadas" value={atrasados.length} color={atrasados.length > 0 ? "red" : "green"} icon={<AlertTriangle size={18} />} />
        <StatCard label="Frete Médio" value={`R$ ${avgFrete}`} color="blue" icon={<TrendingUp size={18} />} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Nº Entrega</th>
                <th className="text-left px-4 py-2.5 font-medium">Cliente</th>
                <th className="text-left px-4 py-2.5 font-medium">Produto</th>
                <th className="text-right px-4 py-2.5 font-medium">Qtd</th>
                <th className="text-left px-4 py-2.5 font-medium">Transportadora</th>
                <th className="text-left px-4 py-2.5 font-medium">Prevista</th>
                <th className="text-right px-4 py-2.5 font-medium">Frete</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.deliveries.map(d => (
                <tr key={d.id} className={`hover:bg-slate-50 transition-colors ${d.status === "atrasado" ? "bg-red-50/40" : ""}`}>
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{d.numero}</td>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{d.cliente}</td>
                  <td className="px-4 py-2.5 text-slate-600">{d.produto}</td>
                  <td className="px-4 py-2.5 text-right font-mono">{d.quantidade}</td>
                  <td className="px-4 py-2.5 text-slate-600">{d.transportadora}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{d.dataPrevista}</td>
                  <td className="px-4 py-2.5 text-right font-mono text-slate-700">R$ {d.custoFrete.toLocaleString("pt-BR")}</td>
                  <td className="px-4 py-2.5">{statusBadge(d.status, DELIVERY_STATUS_LABEL, DELIVERY_STATUS_LABEL)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 justify-end">
                      <select value={d.status} onChange={e => updateStatus(d.id, e.target.value as Delivery["status"])}
                        className="text-xs px-1.5 py-1 border border-slate-200 rounded bg-slate-50">
                        {(["aguardando", "em_transporte", "entregue", "atrasado", "devolvido"] as const).map(s => <option key={s} value={s}>{DELIVERY_STATUS_LABEL[s]}</option>)}
                      </select>
                      <Btn size="sm" variant="ghost" onClick={() => { setEditing(d); setForm(d); setModal(true); }}><Edit2 size={12} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => remove(d.id)}><Trash2 size={12} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal} title={editing ? "Editar Entrega" : "Nova Entrega"} onClose={() => setModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Nº da Entrega" value={form.numero ?? ""} onChange={e => setForm({ ...form, numero: e.target.value })} />
          <Input label="Cliente" value={form.cliente ?? ""} onChange={e => setForm({ ...form, cliente: e.target.value })} />
          <Input label="Produto" value={form.produto ?? ""} onChange={e => setForm({ ...form, produto: e.target.value })} />
          <Input label="Quantidade" type="number" value={form.quantidade ?? ""} onChange={e => setForm({ ...form, quantidade: +e.target.value })} />
          <Input label="Endereço / Região" value={form.endereco ?? ""} onChange={e => setForm({ ...form, endereco: e.target.value })} />
          <Input label="Transportadora" value={form.transportadora ?? ""} onChange={e => setForm({ ...form, transportadora: e.target.value })} />
          <Input label="Data Prevista" type="date" value={form.dataPrevista ?? ""} onChange={e => setForm({ ...form, dataPrevista: e.target.value })} />
          <Input label="Data Real" type="date" value={form.dataReal ?? ""} onChange={e => setForm({ ...form, dataReal: e.target.value })} />
          <Input label="Custo do Frete (R$)" type="number" value={form.custoFrete ?? ""} onChange={e => setForm({ ...form, custoFrete: +e.target.value })} />
          <Select label="Status" value={form.status ?? "aguardando"} onChange={e => setForm({ ...form, status: e.target.value as Delivery["status"] })}>
            {(["aguardando", "em_transporte", "entregue", "atrasado", "devolvido"] as const).map(s => <option key={s} value={s}>{DELIVERY_STATUS_LABEL[s]}</option>)}
          </Select>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Salvar</Btn>
        </div>
      </Modal>
    </div>
  );
}

// ─── Indicadores ─────────────────────────────────────────────────────────────

function IndicadoresModule({ data }: { data: AppData }) {
  const { products, deliveries, warehouseSectors, productionOrders, purchaseOrders, nonConformities } = data;

  const entregues = deliveries.filter(d => d.status === "entregue").length;
  const atrasados = deliveries.filter(d => d.status === "atrasado").length;
  const otif = deliveries.length > 0 ? Math.round((entregues / deliveries.length) * 100) : 0;
  const noPrazo = deliveries.length > 0 ? Math.round((entregues / deliveries.length) * 100) : 0;
  const totalCap = warehouseSectors.reduce((a, s) => a + s.capacidade, 0);
  const totalOc = warehouseSectors.reduce((a, s) => a + s.ocupado, 0);
  const occupancy = totalCap > 0 ? Math.round((totalOc / totalCap) * 100) : 0;
  const ruptura = products.filter(p => p.qtdAtual === 0).length;
  const avgFrete = deliveries.length > 0 ? Math.round(deliveries.reduce((a, d) => a + d.custoFrete, 0) / deliveries.length) : 0;
  const openNCs = nonConformities.filter(nc => nc.status !== "concluida").length;
  const leadTime = data.suppliers.length > 0 ? Math.round(data.suppliers.reduce((a, s) => a + s.prazoEntrega, 0) / data.suppliers.length) : 0;
  const concluded = productionOrders.filter(o => o.status === "concluida");
  const eficProd = concluded.length > 0
    ? Math.round(concluded.map(o => (o.qtdProduzida / o.qtdPlanejada) * 100).reduce((a, b) => a + b, 0) / concluded.length)
    : 0;
  const estoqueMin = Math.min(...products.map(p => p.estoqueMin));
  const estoqueMax = Math.max(...products.map(p => p.estoqueMax));

  function KPICard({ label, value, unit = "", target, good, warn }: {
    label: string; value: number; unit?: string; target?: string;
    good: (v: number) => boolean; warn: (v: number) => boolean;
  }) {
    const color = good(value) ? "green" : warn(value) ? "amber" : "red";
    const colorMap: Record<string, string> = {
      green: "border-emerald-200 bg-emerald-50",
      amber: "border-amber-200 bg-amber-50",
      red: "border-red-200 bg-red-50",
    };
    const textMap: Record<string, string> = { green: "text-emerald-700", amber: "text-amber-700", red: "text-red-700" };
    return (
      <div className={`rounded-lg border p-4 ${colorMap[color]}`}>
        <div className={`text-2xl font-bold mb-1 ${textMap[color]}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          {value}{unit}
        </div>
        <div className="text-sm font-medium text-slate-700">{label}</div>
        {target && <div className="text-xs text-slate-500 mt-1">Meta: {target}</div>}
      </div>
    );
  }

  const trendData = [
    { mes: "Jan", otif: 88, ocupacao: 72, efic: 91 },
    { mes: "Fev", otif: 84, ocupacao: 76, efic: 87 },
    { mes: "Mar", otif: 91, ocupacao: 78, efic: 93 },
    { mes: "Abr", otif: 87, ocupacao: 81, efic: 89 },
    { mes: "Mai", otif: 79, ocupacao: 85, efic: 82 },
    { mes: "Jun", otif: otif, ocupacao: occupancy, efic: eficProd },
  ];

  return (
    <div>
      <SectionHeader title="Indicadores Logísticos" subtitle="KPIs de desempenho operacional" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KPICard label="OTIF" value={otif} unit="%" target="≥ 95%" good={v => v >= 95} warn={v => v >= 80} />
        <KPICard label="Entregas no Prazo" value={noPrazo} unit="%" target="≥ 95%" good={v => v >= 95} warn={v => v >= 80} />
        <KPICard label="Ocupação Armazém" value={occupancy} unit="%" target="≤ 85%" good={v => v <= 85} warn={v => v <= 92} />
        <KPICard label="Eficiência Produtiva" value={eficProd} unit="%" target="≥ 85%" good={v => v >= 85} warn={v => v >= 70} />
        <KPICard label="Lead Time Médio" value={leadTime} unit="d" target="≤ 10d" good={v => v <= 10} warn={v => v <= 14} />
        <KPICard label="Ruptura de Estoque" value={ruptura} unit="" target="0" good={v => v === 0} warn={v => v <= 2} />
        <KPICard label="Frete Médio" value={avgFrete} unit="" target="— " good={() => true} warn={() => false} />
        <KPICard label="NCs Abertas" value={openNCs} unit="" target="0" good={v => v === 0} warn={v => v <= 2} />
      </div>

      <Card className="p-4 mb-4">
        <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Evolução dos Indicadores — 2025</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
            <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="otif" stroke="#1d6fdb" name="OTIF %" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ocupacao" stroke="#d97706" name="Ocupação %" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="efic" stroke="#16a34a" name="Eficiência %" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Parâmetros de Estoque</h3>
          <div className="space-y-2">
            {[
              { label: "Menor Estoque Mínimo", value: estoqueMin },
              { label: "Maior Estoque Máximo", value: estoqueMax },
              { label: "Produtos com Ruptura", value: ruptura },
              { label: "Pedidos Atrasados", value: purchaseOrders.filter(o => o.status === "atrasado").length },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className="font-mono font-medium text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-slate-600 mb-3 uppercase tracking-wide">Resumo Operacional</h3>
          <div className="space-y-2">
            {[
              { label: "Entregas Atrasadas", value: atrasados },
              { label: "Ordens em Produção", value: productionOrders.filter(o => o.status === "em_producao").length },
              { label: "Fornecedores Ativos", value: data.suppliers.length },
              { label: "Total de Produtos", value: products.length },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-600">{row.label}</span>
                <span className="font-mono font-medium text-slate-800">{row.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── Não Conformidades ────────────────────────────────────────────────────────

function NaoConformidadesModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [modal, setModal] = useState(false);
  const [planoModal, setPlanoModal] = useState<NonConformity | null>(null);
  const [editing, setEditing] = useState<NonConformity | null>(null);
  const [form, setForm] = useState<Partial<NonConformity>>({});
  const [planoForm, setPlanoForm] = useState<Partial<NonConformity["plano5w2h"]>>({});

  function save() {
    const nc = { ...form, id: editing?.id ?? uid() } as NonConformity;
    const nonConformities = editing
      ? data.nonConformities.map(x => x.id === nc.id ? nc : x)
      : [...data.nonConformities, nc];
    setData({ ...data, nonConformities });
    setModal(false);
  }
  function remove(id: string) {
    setData({ ...data, nonConformities: data.nonConformities.filter(n => n.id !== id) });
  }
  function savePlano() {
    if (!planoModal) return;
    const nonConformities = data.nonConformities.map(n =>
      n.id === planoModal.id ? { ...n, plano5w2h: planoForm as NonConformity["plano5w2h"] } : n
    );
    setData({ ...data, nonConformities });
    setPlanoModal(null);
  }
  function updateStatus(id: string, status: NonConformity["status"]) {
    setData({ ...data, nonConformities: data.nonConformities.map(n => n.id === id ? { ...n, status } : n) });
  }

  const SECTORS = ["suprimentos", "armazenagem", "producao", "distribuicao", "transporte"];

  return (
    <div>
      <SectionHeader title="Não Conformidades e Ações Corretivas" subtitle="Registro e acompanhamento de ocorrências"
        action={<Btn onClick={() => { setEditing(null); setForm({ status: "aberta", dataOcorrencia: new Date().toISOString().slice(0, 10), codigo: `NC-${Date.now().toString().slice(-4)}` }); setModal(true); }}><Plus size={14} /> Nova NC</Btn>}
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wide">
                <th className="text-left px-4 py-2.5 font-medium">Código</th>
                <th className="text-left px-4 py-2.5 font-medium">Setor</th>
                <th className="text-left px-4 py-2.5 font-medium">Descrição</th>
                <th className="text-left px-4 py-2.5 font-medium">Data</th>
                <th className="text-left px-4 py-2.5 font-medium">Responsável</th>
                <th className="text-left px-4 py-2.5 font-medium">Gravidade</th>
                <th className="text-left px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.nonConformities.map(nc => (
                <tr key={nc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-500">{nc.codigo}</td>
                  <td className="px-4 py-2.5 capitalize text-slate-600">{nc.setor}</td>
                  <td className="px-4 py-2.5 text-slate-700 max-w-xs truncate">{nc.descricao}</td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">{nc.dataOcorrencia}</td>
                  <td className="px-4 py-2.5 text-slate-600">{nc.responsavel}</td>
                  <td className="px-4 py-2.5">{statusBadge(nc.gravidade, NC_SEVERITY_LABEL, NC_SEVERITY_LABEL)}</td>
                  <td className="px-4 py-2.5">{statusBadge(nc.status, NC_STATUS_LABEL, NC_STATUS_LABEL)}</td>
                  <td className="px-4 py-2.5">
                    <div className="flex gap-1 justify-end">
                      <Btn size="sm" variant="secondary" onClick={() => { setPlanoModal(nc); setPlanoForm(nc.plano5w2h ?? {}); }}>5W2H</Btn>
                      <select value={nc.status} onChange={e => updateStatus(nc.id, e.target.value as NonConformity["status"])}
                        className="text-xs px-1.5 py-1 border border-slate-200 rounded bg-slate-50">
                        {(["aberta", "em_analise", "em_correcao", "concluida"] as const).map(s => <option key={s} value={s}>{NC_STATUS_LABEL[s]}</option>)}
                      </select>
                      <Btn size="sm" variant="ghost" onClick={() => { setEditing(nc); setForm(nc); setModal(true); }}><Edit2 size={12} /></Btn>
                      <Btn size="sm" variant="danger" onClick={() => remove(nc.id)}><Trash2 size={12} /></Btn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={modal} title={editing ? "Editar NC" : "Nova Não Conformidade"} onClose={() => setModal(false)}>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Código" value={form.codigo ?? ""} onChange={e => setForm({ ...form, codigo: e.target.value })} />
          <Input label="Data da Ocorrência" type="date" value={form.dataOcorrencia ?? ""} onChange={e => setForm({ ...form, dataOcorrencia: e.target.value })} />
          <Select label="Setor" value={form.setor ?? ""} onChange={e => setForm({ ...form, setor: e.target.value })}>
            <option value="">Selecione…</option>
            {SECTORS.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </Select>
          <Input label="Responsável" value={form.responsavel ?? ""} onChange={e => setForm({ ...form, responsavel: e.target.value })} />
          <Select label="Gravidade" value={form.gravidade ?? ""} onChange={e => setForm({ ...form, gravidade: e.target.value as NonConformity["gravidade"] })}>
            <option value="">Selecione…</option>
            {(["baixa", "media", "alta"] as const).map(g => <option key={g} value={g}>{NC_SEVERITY_LABEL[g]}</option>)}
          </Select>
          <Select label="Status" value={form.status ?? "aberta"} onChange={e => setForm({ ...form, status: e.target.value as NonConformity["status"] })}>
            {(["aberta", "em_analise", "em_correcao", "concluida"] as const).map(s => <option key={s} value={s}>{NC_STATUS_LABEL[s]}</option>)}
          </Select>
          <div className="col-span-2">
            <Textarea label="Descrição do Problema" value={form.descricao ?? ""} onChange={e => setForm({ ...form, descricao: e.target.value })} rows={3} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Btn variant="secondary" onClick={() => setModal(false)}>Cancelar</Btn>
          <Btn onClick={save}>Salvar</Btn>
        </div>
      </Modal>

      <Modal open={!!planoModal} title={`Plano 5W2H — ${planoModal?.codigo}`} onClose={() => setPlanoModal(null)}>
        {planoModal && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Textarea label="What — O que será feito?" value={planoForm?.what ?? ""} onChange={e => setPlanoForm({ ...planoForm, what: e.target.value })} rows={2} />
              <Textarea label="Why — Por que será feito?" value={planoForm?.why ?? ""} onChange={e => setPlanoForm({ ...planoForm, why: e.target.value })} rows={2} />
              <Textarea label="Where — Onde?" value={planoForm?.where ?? ""} onChange={e => setPlanoForm({ ...planoForm, where: e.target.value })} rows={2} />
              <Input label="When — Quando?" type="date" value={planoForm?.when ?? ""} onChange={e => setPlanoForm({ ...planoForm, when: e.target.value })} />
              <Input label="Who — Quem?" value={planoForm?.who ?? ""} onChange={e => setPlanoForm({ ...planoForm, who: e.target.value })} />
              <Input label="How Much — Custo estimado" value={planoForm?.howMuch ?? ""} onChange={e => setPlanoForm({ ...planoForm, howMuch: e.target.value })} placeholder="R$ 0,00" />
              <div className="col-span-2">
                <Textarea label="How — Como será feito?" value={planoForm?.how ?? ""} onChange={e => setPlanoForm({ ...planoForm, how: e.target.value })} rows={2} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Btn variant="secondary" onClick={() => setPlanoModal(null)}>Cancelar</Btn>
              <Btn onClick={savePlano}>Salvar Plano</Btn>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── Relatórios ───────────────────────────────────────────────────────────────

function RelatoriosModule({ data, setData }: { data: AppData; setData: (d: AppData) => void }) {
  const [tipo, setTipo] = useState("estoque");

  const tipos = [
    { id: "estoque", label: "Estoque Geral" },
    { id: "abaixo_min", label: "Abaixo do Mínimo" },
    { id: "pedidos", label: "Pedidos de Compra" },
    { id: "entregas_atrasadas", label: "Entregas Atrasadas" },
    { id: "producao", label: "Produção" },
    { id: "nao_conformidades", label: "Não Conformidades" },
  ];

  function exportJSON() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "logicontrol_export.json"; a.click();
  }
  function importJSON() {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try { setData(JSON.parse(ev.target?.result as string)); } catch {}
      };
      reader.readAsText(file);
    };
    input.click();
  }
  function restore() {
    if (window.confirm("Restaurar dados iniciais de demonstração? Dados atuais serão perdidos.")) {
      setData(SEED);
    }
  }
  function clearAll() {
    if (window.confirm("Limpar todos os dados? Esta ação não pode ser desfeita.")) {
      setData({ products: [], suppliers: [], purchaseOrders: [], warehouseSectors: [], productionOrders: [], deliveries: [], nonConformities: [] });
    }
  }

  const prodMap = Object.fromEntries(data.products.map(p => [p.id, p]));
  const suppMap = Object.fromEntries(data.suppliers.map(s => [s.id, s]));

  return (
    <div>
      <SectionHeader title="Relatórios" subtitle="Exportação e visualização de dados" />

      <div className="flex flex-wrap gap-2 mb-5">
        <Btn variant="secondary" onClick={exportJSON}><Download size={14} /> Exportar JSON</Btn>
        <Btn variant="secondary" onClick={importJSON}><Upload size={14} /> Importar JSON</Btn>
        <Btn variant="secondary" onClick={() => window.print()}><Printer size={14} /> Imprimir</Btn>
        <Btn variant="secondary" onClick={restore}><RefreshCw size={14} /> Restaurar Dados</Btn>
        <Btn variant="danger" onClick={clearAll}><Trash2 size={14} /> Limpar Tudo</Btn>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {tipos.map(t => (
          <button key={t.id} onClick={() => setTipo(t.id)}
            className={`px-3 py-1.5 text-sm font-medium rounded transition-all ${tipo === t.id ? "bg-blue-600 text-white" : "bg-white text-slate-600 hover:bg-slate-100"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        {tipo === "estoque" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Relatório de Estoque Geral</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Código</th>
                <th className="text-left px-4 py-2 font-medium">Produto</th>
                <th className="text-left px-4 py-2 font-medium">Categoria</th>
                <th className="text-right px-4 py-2 font-medium">Atual</th>
                <th className="text-right px-4 py-2 font-medium">Mín</th>
                <th className="text-right px-4 py-2 font-medium">Máx</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.products.map(p => {
                  const st = stockStatus(p);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2 font-mono text-xs text-slate-500">{p.codigo}</td>
                      <td className="px-4 py-2 font-medium">{p.nome}</td>
                      <td className="px-4 py-2 text-slate-600">{p.categoria}</td>
                      <td className="px-4 py-2 text-right font-mono">{p.qtdAtual} {p.unidade}</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">{p.estoqueMin}</td>
                      <td className="px-4 py-2 text-right font-mono text-slate-500">{p.estoqueMax}</td>
                      <td className="px-4 py-2"><Badge label={st === "critico" ? "Crítico" : st === "atencao" ? "Atenção" : "Adequado"} color={STOCK_BADGE[st]} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {tipo === "abaixo_min" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Produtos Abaixo do Estoque Mínimo</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Produto</th>
                <th className="text-right px-4 py-2 font-medium">Atual</th>
                <th className="text-right px-4 py-2 font-medium">Mínimo</th>
                <th className="text-right px-4 py-2 font-medium">Diferença</th>
                <th className="text-left px-4 py-2 font-medium">Localização</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.products.filter(p => p.qtdAtual <= p.estoqueMin).map(p => (
                  <tr key={p.id} className="bg-red-50/50">
                    <td className="px-4 py-2 font-medium">{p.nome}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-600 font-bold">{p.qtdAtual}</td>
                    <td className="px-4 py-2 text-right font-mono text-slate-500">{p.estoqueMin}</td>
                    <td className="px-4 py-2 text-right font-mono text-red-600">{p.qtdAtual - p.estoqueMin}</td>
                    <td className="px-4 py-2 text-slate-500 text-xs">{p.localizacao}</td>
                  </tr>
                ))}
                {data.products.filter(p => p.qtdAtual <= p.estoqueMin).length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Nenhum produto abaixo do mínimo.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {tipo === "pedidos" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Relatório de Pedidos de Compra</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Produto</th>
                <th className="text-left px-4 py-2 font-medium">Fornecedor</th>
                <th className="text-right px-4 py-2 font-medium">Qtd</th>
                <th className="text-left px-4 py-2 font-medium">Data</th>
                <th className="text-left px-4 py-2 font-medium">Previsão</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.purchaseOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-medium">{prodMap[o.produtoId]?.nome}</td>
                    <td className="px-4 py-2 text-slate-600">{suppMap[o.fornecedorId]?.nome}</td>
                    <td className="px-4 py-2 text-right font-mono">{o.qtdSolicitada}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">{o.dataPedido}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">{o.previsaoEntrega}</td>
                    <td className="px-4 py-2">{statusBadge(o.status, ORDER_STATUS_LABEL, ORDER_STATUS_LABEL)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tipo === "entregas_atrasadas" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Relatório de Entregas Atrasadas</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Nº Entrega</th>
                <th className="text-left px-4 py-2 font-medium">Cliente</th>
                <th className="text-left px-4 py-2 font-medium">Produto</th>
                <th className="text-left px-4 py-2 font-medium">Prevista</th>
                <th className="text-left px-4 py-2 font-medium">Transportadora</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.deliveries.filter(d => d.status === "atrasado").map(d => (
                  <tr key={d.id} className="bg-red-50/50">
                    <td className="px-4 py-2 font-mono text-xs">{d.numero}</td>
                    <td className="px-4 py-2 font-medium">{d.cliente}</td>
                    <td className="px-4 py-2 text-slate-600">{d.produto}</td>
                    <td className="px-4 py-2 text-xs text-red-600 font-medium">{d.dataPrevista}</td>
                    <td className="px-4 py-2 text-slate-600">{d.transportadora}</td>
                  </tr>
                ))}
                {data.deliveries.filter(d => d.status === "atrasado").length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-6 text-center text-slate-400">Nenhuma entrega atrasada.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {tipo === "producao" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Relatório de Produção</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Ordem</th>
                <th className="text-left px-4 py-2 font-medium">Produto</th>
                <th className="text-right px-4 py-2 font-medium">Plan.</th>
                <th className="text-right px-4 py-2 font-medium">Prod.</th>
                <th className="text-right px-4 py-2 font-medium">Efic.</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.productionOrders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{o.numero}</td>
                    <td className="px-4 py-2 font-medium">{o.produto}</td>
                    <td className="px-4 py-2 text-right font-mono">{o.qtdPlanejada}</td>
                    <td className="px-4 py-2 text-right font-mono">{o.qtdProduzida}</td>
                    <td className="px-4 py-2 text-right font-mono">{o.qtdPlanejada > 0 ? Math.round((o.qtdProduzida / o.qtdPlanejada) * 100) : 0}%</td>
                    <td className="px-4 py-2">{statusBadge(o.status, PROD_STATUS_LABEL, PROD_STATUS_LABEL)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {tipo === "nao_conformidades" && (
          <div className="overflow-x-auto">
            <h3 className="px-4 pt-4 pb-2 font-semibold text-slate-700">Relatório de Não Conformidades</h3>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-xs text-slate-500 uppercase">
                <th className="text-left px-4 py-2 font-medium">Código</th>
                <th className="text-left px-4 py-2 font-medium">Setor</th>
                <th className="text-left px-4 py-2 font-medium">Responsável</th>
                <th className="text-left px-4 py-2 font-medium">Data</th>
                <th className="text-left px-4 py-2 font-medium">Gravidade</th>
                <th className="text-left px-4 py-2 font-medium">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {data.nonConformities.map(nc => (
                  <tr key={nc.id} className="hover:bg-slate-50">
                    <td className="px-4 py-2 font-mono text-xs text-slate-500">{nc.codigo}</td>
                    <td className="px-4 py-2 capitalize text-slate-600">{nc.setor}</td>
                    <td className="px-4 py-2">{nc.responsavel}</td>
                    <td className="px-4 py-2 text-xs text-slate-500">{nc.dataOcorrencia}</td>
                    <td className="px-4 py-2">{statusBadge(nc.gravidade, NC_SEVERITY_LABEL, NC_SEVERITY_LABEL)}</td>
                    <td className="px-4 py-2">{statusBadge(nc.status, NC_STATUS_LABEL, NC_STATUS_LABEL)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

const NAV: { id: Module; label: string; icon: React.ReactNode; badge?: (d: AppData) => number }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
  { id: "estoque", label: "Estoque", icon: <Package size={16} />, badge: d => d.products.filter(p => p.qtdAtual <= p.estoqueMin).length },
  { id: "suprimentos", label: "Suprimentos", icon: <ShoppingCart size={16} />, badge: d => d.purchaseOrders.filter(o => o.status === "pendente").length },
  { id: "armazenagem", label: "Armazenagem", icon: <Warehouse size={16} /> },
  { id: "producao", label: "Produção", icon: <Factory size={16} /> },
  { id: "distribuicao", label: "Distribuição", icon: <Truck size={16} />, badge: d => d.deliveries.filter(x => x.status === "atrasado").length },
  { id: "indicadores", label: "Indicadores", icon: <BarChart2 size={16} /> },
  { id: "naoConformidades", label: "Não Conformidades", icon: <AlertTriangle size={16} />, badge: d => d.nonConformities.filter(n => n.status !== "concluida").length },
  { id: "relatorios", label: "Relatórios", icon: <FileText size={16} /> },
];

// ─── App root ─────────────────────────────────────────────────────────────────

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [data, setDataRaw] = useState<AppData>(loadData);
  const [active, setActive] = useState<Module>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const setData = useCallback((d: AppData) => {
    setDataRaw(d);
    saveData(d);
  }, []);

  if (!currentUser) {
    return <LoginPage onLogin={setCurrentUser} />;
  }

  const alerts = [
    ...data.products.filter(p => p.qtdAtual <= p.estoqueMin).map(p => ({ type: "critico", msg: `${p.nome} abaixo do estoque mínimo` })),
    ...data.deliveries.filter(d => d.status === "atrasado").map(d => ({ type: "atencao", msg: `Entrega ${d.numero} atrasada` })),
    ...data.nonConformities.filter(nc => nc.status === "aberta" && nc.gravidade === "alta").map(nc => ({ type: "critico", msg: `NC Alta: ${nc.codigo}` })),
  ].slice(0, 4);

  return (
    <div className="flex h-screen bg-[#eef1f7] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static z-40 h-full w-60 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        style={{ background: "#0f1c36" }}>
        {/* Brand */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
              <Truck size={16} className="text-white" />
            </div>
            <div>
              <div className="text-white font-bold leading-tight" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.1rem", letterSpacing: "0.02em" }}>LogiControl</div>
              <div className="text-slate-400 text-xs leading-tight">Gestão Logística</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-2">Módulos</span>
          </div>
          {NAV.map(item => {
            const badgeCount = item.badge?.(data) ?? 0;
            return (
              <button key={item.id} onClick={() => { setActive(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-sm font-medium transition-all relative ${active === item.id
                  ? "text-white bg-blue-600/90"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                {badgeCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full w-4.5 h-4.5 flex items-center justify-center px-1 min-w-[1.1rem]" style={{ fontSize: "0.65rem" }}>
                    {badgeCount}
                  </span>
                )}
                {active === item.id && <div className="absolute right-0 top-0 h-full w-0.5 bg-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
          <div className="text-xs text-slate-500">v1.0 · Técnico em Logística</div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-slate-200/80 px-5 py-3 flex items-center gap-3 flex-shrink-0 shadow-sm">
          <button className="md:hidden text-slate-500 hover:text-slate-800 transition" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="flex-1">
            <h1 className="font-semibold text-slate-800 leading-tight text-base" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "1.05rem" }}>
              {NAV.find(n => n.id === active)?.label ?? "Dashboard"}
            </h1>
          </div>

          {/* Alerts pill */}
          {alerts.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-red-50 border border-red-200 rounded-full px-3 py-1 text-xs font-medium text-red-600">
                <Bell size={12} />
                {alerts.length} alerta{alerts.length > 1 ? "s" : ""}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:block text-right">
              <div className="text-xs font-semibold text-slate-700 leading-tight">{currentUser.name.split(" ")[0]} {currentUser.name.split(" ").slice(-1)[0]}</div>
              <div className="text-xs text-slate-400 leading-tight">{currentUser.role}</div>
            </div>
            <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
              {currentUser.avatar}
            </div>
            <button onClick={() => setCurrentUser(null)} title="Sair"
              className="text-slate-400 hover:text-slate-700 transition p-1 rounded hover:bg-slate-100">
              <LogOut size={15} />
            </button>
          </div>
        </header>

        {/* Alert bar */}
        {alerts.length > 0 && (
          <div className="bg-amber-50 border-b border-amber-200 px-5 py-2 flex items-center gap-3 overflow-x-auto flex-shrink-0">
            {alerts.map((a, i) => (
              <div key={i} className={`flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${a.type === "critico" ? "text-red-600" : "text-amber-700"}`}>
                <AlertTriangle size={11} />
                {a.msg}
                {i < alerts.length - 1 && <span className="text-slate-300 ml-2">·</span>}
              </div>
            ))}
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5">
          {active === "dashboard" && <Dashboard data={data} />}
          {active === "estoque" && <EstoqueModule data={data} setData={setData} />}
          {active === "suprimentos" && <SuprimentosModule data={data} setData={setData} />}
          {active === "armazenagem" && <ArmazenagemModule data={data} setData={setData} />}
          {active === "producao" && <ProducaoModule data={data} setData={setData} />}
          {active === "distribuicao" && <DistribuicaoModule data={data} setData={setData} />}
          {active === "indicadores" && <IndicadoresModule data={data} />}
          {active === "naoConformidades" && <NaoConformidadesModule data={data} setData={setData} />}
          {active === "relatorios" && <RelatoriosModule data={data} setData={setData} />}
        </main>
      </div>
    </div>
  );
}
