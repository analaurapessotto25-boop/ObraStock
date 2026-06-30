import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";
import {
  Package, Users, Building2, ArrowDownToLine, ArrowUpFromLine, RotateCcw,
  Wrench, Layers, AlertTriangle, FileText, History, LayoutDashboard,
  LogOut, Search, Plus, Edit2, Trash2, Bell, X, Check, Eye,
  Menu, ChevronDown, Download, Printer, RefreshCw, QrCode, ShieldAlert,
  TrendingUp, PackageCheck, PackageX, Clock, DollarSign, HardHat, BarChart2
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

type Product = {
  id: string; name: string; sku: string; category: string; unit: string;
  unitPrice: number; supplier: string; stock: number; minStock: number;
  safetyStock: number; location: string; type: "consumivel" | "devolutivo";
  phase: string;
};

type Employee = {
  id: string; name: string; role: string; company: string;
  badgeNumber: string; status: "ativo" | "inativo";
};

type Construction = {
  id: string; name: string; address: string; tower: string;
  floor: string; apartment: string; phase: string;
};

type Warehouse = {
  id: string; name: string; type: "central" | "obra" | "frente"; constructionId: string;
};

type Entry = {
  id: string; date: string; productId: string; quantity: number;
  supplier: string; invoice: string; totalValue: number;
  warehouseId: string; responsibleId: string;
};

type Withdrawal = {
  id: string; date: string; employeeId: string; productId: string;
  quantity: number; constructionId: string; tower: string; floor: string;
  apartment: string; type: "consumivel" | "devolutivo"; justification: string;
  returnStatus: "pendente" | "devolvido" | "danificado" | "perdido" | "na";
};

type Return = {
  id: string; withdrawalId: string; returnDate: string;
  state: "bom" | "danificado" | "perdido" | "nao-devolvido"; observation: string;
};

type Kit = {
  id: string; name: string; role: string;
  items: { productId: string; quantity: number }[];
  status: "completo" | "incompleto" | "danificado" | "pendente";
};

type Movement = {
  id: string; date: string;
  type: "entrada" | "saida" | "devolucao" | "perda" | "transferencia";
  productId: string; quantity: number;
  employeeId?: string; constructionId?: string; status: string;
};

type View =
  | "dashboard" | "products" | "employees" | "constructions"
  | "entries" | "withdrawals" | "returns" | "kits" | "phases"
  | "alerts" | "reports" | "history";

// ─── Initial Data ────────────────────────────────────────────────────────────

const INITIAL_PRODUCTS: Product[] = [
  { id: "p1", name: "Disco de Corte para Piso", sku: "SKU-001", category: "Ferramentas", unit: "un", unitPrice: 12.5, supplier: "FerraTech", stock: 8, minStock: 20, safetyStock: 30, location: "Prateleira A1", type: "consumivel", phase: "Acabamento" },
  { id: "p2", name: "Capacete de Segurança", sku: "SKU-002", category: "EPI", unit: "un", unitPrice: 45.0, supplier: "ProteSafe", stock: 35, minStock: 20, safetyStock: 25, location: "Prateleira B2", type: "devolutivo", phase: "Todas" },
  { id: "p3", name: "Luva de Segurança", sku: "SKU-003", category: "EPI", unit: "par", unitPrice: 18.0, supplier: "ProteSafe", stock: 12, minStock: 30, safetyStock: 40, location: "Prateleira B3", type: "consumivel", phase: "Todas" },
  { id: "p4", name: "Cimento CP-II (saco 50kg)", sku: "SKU-004", category: "Civil", unit: "sc", unitPrice: 38.0, supplier: "VotoranCim", stock: 150, minStock: 50, safetyStock: 80, location: "Área Externa", type: "consumivel", phase: "Alvenaria" },
  { id: "p5", name: "Areia Média (m³)", sku: "SKU-005", category: "Civil", unit: "m³", unitPrice: 120.0, supplier: "Pedreira Norte", stock: 40, minStock: 15, safetyStock: 20, location: "Área Externa", type: "consumivel", phase: "Estrutura" },
  { id: "p6", name: "Furadeira de Impacto", sku: "SKU-006", category: "Ferramentas", unit: "un", unitPrice: 380.0, supplier: "FerraTech", stock: 6, minStock: 5, safetyStock: 8, location: "Prateleira C1", type: "devolutivo", phase: "Instalações Elétricas" },
  { id: "p7", name: "Cabo Elétrico 2,5mm (rolo)", sku: "SKU-007", category: "Elétrico", unit: "rolo", unitPrice: 210.0, supplier: "ElétricaPlus", stock: 3, minStock: 10, safetyStock: 15, location: "Prateleira D1", type: "consumivel", phase: "Instalações Elétricas" },
  { id: "p8", name: "Tubo PVC 100mm (6m)", sku: "SKU-008", category: "Hidráulico", unit: "un", unitPrice: 65.0, supplier: "HidroTub", stock: 22, minStock: 10, safetyStock: 15, location: "Área Lateral", type: "consumivel", phase: "Instalações Hidráulicas" },
  { id: "p9", name: "Bota de Segurança", sku: "SKU-009", category: "EPI", unit: "par", unitPrice: 95.0, supplier: "ProteSafe", stock: 28, minStock: 20, safetyStock: 25, location: "Prateleira B4", type: "devolutivo", phase: "Todas" },
  { id: "p10", name: "Tinta Acrílica Branca (18L)", sku: "SKU-010", category: "Acabamento", unit: "balde", unitPrice: 145.0, supplier: "TintasMax", stock: 7, minStock: 8, safetyStock: 12, location: "Prateleira E1", type: "consumivel", phase: "Acabamento" },
];

const INITIAL_EMPLOYEES: Employee[] = [
  { id: "e1", name: "Carlos Eduardo Silva", role: "Pedreiro", company: "EFA Oliva", badgeNumber: "001", status: "ativo" },
  { id: "e2", name: "José Antônio Ferreira", role: "Azulejista", company: "EFA Oliva", badgeNumber: "002", status: "ativo" },
  { id: "e3", name: "Marcos Paulo Oliveira", role: "Eletricista", company: "Santa Angela", badgeNumber: "003", status: "ativo" },
  { id: "e4", name: "Roberto Luís Santos", role: "Pintor", company: "Santa Angela", badgeNumber: "004", status: "ativo" },
  { id: "e5", name: "Anderson Ferreira Lima", role: "Encanador", company: "EFA Oliva", badgeNumber: "005", status: "ativo" },
  { id: "e6", name: "Fábio Alves Moreira", role: "Mestre de Obras", company: "EFA Oliva", badgeNumber: "006", status: "ativo" },
  { id: "e7", name: "Thiago Costa Barbosa", role: "Servente", company: "Santa Angela", badgeNumber: "007", status: "inativo" },
];

const INITIAL_CONSTRUCTIONS: Construction[] = [
  { id: "c1", name: "Residencial Jardins do Sul", address: "Av. das Palmeiras, 1200", tower: "Torre A", floor: "1-25", apartment: "Ap. 101-2504", phase: "Acabamento" },
  { id: "c2", name: "Edifício Horizonte Azul", address: "Rua dos Ipês, 450", tower: "Torre Única", floor: "1-18", apartment: "Ap. 101-1802", phase: "Alvenaria" },
  { id: "c3", name: "Condomínio Vila Serrana", address: "Rod. SP-340, Km 15", tower: "Torres A, B, C", floor: "1-12", apartment: "Ap. 101-1204", phase: "Estrutura" },
];

const INITIAL_WAREHOUSES: Warehouse[] = [
  { id: "w1", name: "Almoxarifado Central", type: "central", constructionId: "c1" },
  { id: "w2", name: "Almoxarifado Obra Jardins", type: "obra", constructionId: "c1" },
  { id: "w3", name: "Frente Acabamento T-A", type: "frente", constructionId: "c1" },
  { id: "w4", name: "Almoxarifado Horizonte", type: "obra", constructionId: "c2" },
];

const INITIAL_ENTRIES: Entry[] = [
  { id: "en1", date: "2026-06-20", productId: "p4", quantity: 200, supplier: "VotoranCim", invoice: "NF-45821", totalValue: 7600, warehouseId: "w1", responsibleId: "e6" },
  { id: "en2", date: "2026-06-22", productId: "p7", quantity: 15, supplier: "ElétricaPlus", invoice: "NF-32104", totalValue: 3150, warehouseId: "w1", responsibleId: "e6" },
  { id: "en3", date: "2026-06-24", productId: "p1", quantity: 50, supplier: "FerraTech", invoice: "NF-99012", totalValue: 625, warehouseId: "w2", responsibleId: "e6" },
];

const INITIAL_WITHDRAWALS: Withdrawal[] = [
  { id: "wd1", date: "2026-06-25T08:30:00", employeeId: "e1", productId: "p1", quantity: 2, constructionId: "c1", tower: "Torre A", floor: "23", apartment: "Ap 2301", type: "consumivel", justification: "Corte de piso do apartamento", returnStatus: "na" },
  { id: "wd2", date: "2026-06-25T09:15:00", employeeId: "e2", productId: "p3", quantity: 1, constructionId: "c1", tower: "Torre A", floor: "15", apartment: "Ap 1502", type: "consumivel", justification: "Assentamento de piso", returnStatus: "na" },
  { id: "wd3", date: "2026-06-25T10:00:00", employeeId: "e3", productId: "p6", quantity: 1, constructionId: "c2", tower: "Torre Única", floor: "8", apartment: "Ap 801", type: "devolutivo", justification: "Instalação elétrica", returnStatus: "pendente" },
  { id: "wd4", date: "2026-06-24T14:00:00", employeeId: "e4", productId: "p10", quantity: 2, constructionId: "c1", tower: "Torre A", floor: "20", apartment: "Ap 2003", type: "consumivel", justification: "Pintura de sala", returnStatus: "na" },
  { id: "wd5", date: "2026-06-23T11:30:00", employeeId: "e1", productId: "p4", quantity: 10, constructionId: "c1", tower: "Torre A", floor: "5", apartment: "Ap 501", type: "consumivel", justification: "Revestimento", returnStatus: "na" },
  { id: "wd6", date: "2026-06-22T09:00:00", employeeId: "e5", productId: "p8", quantity: 4, constructionId: "c2", tower: "Torre Única", floor: "3", apartment: "Ap 302", type: "consumivel", justification: "Instalação hidráulica", returnStatus: "na" },
  { id: "wd7", date: "2026-06-20T13:00:00", employeeId: "e2", productId: "p2", quantity: 1, constructionId: "c1", tower: "Torre A", floor: "10", apartment: "Ap 1001", type: "devolutivo", justification: "Proteção", returnStatus: "pendente" },
];

const INITIAL_RETURNS: Return[] = [
  { id: "r1", withdrawalId: "wd3", returnDate: "2026-06-25", state: "bom", observation: "Devolvida sem danos" },
];

const INITIAL_KITS: Kit[] = [
  { id: "k1", name: "Kit Pedreiro", role: "Pedreiro", items: [{ productId: "p4", quantity: 5 }, { productId: "p3", quantity: 1 }], status: "completo" },
  { id: "k2", name: "Kit Eletricista", role: "Eletricista", items: [{ productId: "p6", quantity: 1 }, { productId: "p7", quantity: 2 }], status: "pendente" },
  { id: "k3", name: "Kit Pintor", role: "Pintor", items: [{ productId: "p10", quantity: 2 }, { productId: "p3", quantity: 1 }], status: "incompleto" },
];

const INITIAL_MOVEMENTS: Movement[] = [
  { id: "mv1", date: "2026-06-25T08:30:00", type: "saida", productId: "p1", quantity: 2, employeeId: "e1", constructionId: "c1", status: "Concluído" },
  { id: "mv2", date: "2026-06-25T09:15:00", type: "saida", productId: "p3", quantity: 1, employeeId: "e2", constructionId: "c1", status: "Concluído" },
  { id: "mv3", date: "2026-06-24T14:00:00", type: "saida", productId: "p10", quantity: 2, employeeId: "e4", constructionId: "c1", status: "Concluído" },
  { id: "mv4", date: "2026-06-24T08:00:00", type: "entrada", productId: "p7", quantity: 15, status: "Concluído" },
  { id: "mv5", date: "2026-06-23T11:30:00", type: "saida", productId: "p4", quantity: 10, employeeId: "e1", constructionId: "c1", status: "Concluído" },
  { id: "mv6", date: "2026-06-22T09:00:00", type: "saida", productId: "p8", quantity: 4, employeeId: "e5", constructionId: "c2", status: "Concluído" },
  { id: "mv7", date: "2026-06-20T13:00:00", type: "entrada", productId: "p4", quantity: 200, status: "Concluído" },
  { id: "mv8", date: "2026-06-19T10:00:00", type: "perda", productId: "p1", quantity: 3, employeeId: "e1", status: "Registrado" },
];

const PHASES = ["Fundação", "Estrutura", "Alvenaria", "Instalações Elétricas", "Instalações Hidráulicas", "Acabamento", "Entrega da Obra"];

const PHASE_MATERIALS: Record<string, { materials: string[]; notes: string }> = {
  "Fundação": { materials: ["Concreto", "Aço (vergalhão)", "Brita", "Areia", "Cimento", "Forma (madeira)", "Escavadeira"], notes: "Fase crítica: garantir estoque mínimo de cimento e aço." },
  "Estrutura": { materials: ["Cimento", "Areia", "Brita", "Vergalhão", "Laje fôrma", "Escoramento", "Fio de aço"], notes: "Alto consumo de cimento e vergalhão. Manter estoque de segurança." },
  "Alvenaria": { materials: ["Tijolo cerâmico", "Cimento CP-II", "Areia", "Cal hidratada", "Vergas de concreto"], notes: "Consumo constante de tijolo e argamassa." },
  "Instalações Elétricas": { materials: ["Cabo elétrico 2,5mm", "Cabo elétrico 4mm", "Eletroduto", "Caixas de luz", "Furadeira", "Alicate"], notes: "Controlar devolutivos (furadeiras, alicates) com atenção." },
  "Instalações Hidráulicas": { materials: ["Tubo PVC 100mm", "Tubo PVC 50mm", "Conexões PVC", "Registro", "Veda rosca", "Chave de grifo"], notes: "Verificar kit hidráulico completo antes do início da fase." },
  "Acabamento": { materials: ["Disco de corte", "Rejunte", "Tinta acrílica", "Massa corrida", "Lixa", "Espátula", "Rolo de pintura"], notes: "Alta taxa de perdas de discos de corte e consumíveis. Monitorar." },
  "Entrega da Obra": { materials: ["Lâmpada LED", "Tomadas", "Interruptores", "Maçaneta", "Ferragem acabamento", "Espelho plástico"], notes: "Fase final: priorizar rastreabilidade de todos os itens instalados." },
};

// ─── LocalStorage Hook ───────────────────────────────────────────────────────

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof value === "function" ? (value as (p: T) => T)(prev) : value;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);

  return [state, setValue];
}

// ─── UI Primitives ───────────────────────────────────────────────────────────

function Badge({ children, color = "gray" }: { children: React.ReactNode; color?: "green" | "yellow" | "red" | "blue" | "orange" | "gray" }) {
  const cls = {
    green: "bg-green-100 text-green-800",
    yellow: "bg-yellow-100 text-yellow-800",
    red: "bg-red-100 text-red-800",
    blue: "bg-blue-100 text-blue-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-700",
  }[color];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${cls}`}>{children}</span>;
}

function Btn({ children, onClick, variant = "primary", size = "md", type = "button", className = "", disabled = false }: {
  children: React.ReactNode; onClick?: () => void; variant?: "primary" | "secondary" | "danger" | "ghost" | "orange";
  size?: "sm" | "md"; type?: "button" | "submit"; className?: string; disabled?: boolean;
}) {
  const base = "inline-flex items-center gap-1.5 rounded font-semibold transition-all focus:outline-none disabled:opacity-50";
  const sz = size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm";
  const v = {
    primary: "bg-[#1a3a5c] text-white hover:bg-[#122a45]",
    secondary: "bg-white border border-[#1a3a5c]/20 text-[#1a3a5c] hover:bg-[#eef2f7]",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-[#1a3a5c] hover:bg-[#eef2f7]",
    orange: "bg-[#f97316] text-white hover:bg-[#ea6c0e]",
  }[variant];
  return <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${sz} ${v} ${className}`}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "", required = false, options, className = "" }: {
  label?: string; value: string | number; onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean; options?: { value: string; label: string }[]; className?: string;
}) {
  const cls = "w-full px-3 py-2 rounded border border-[#1a3a5c]/15 bg-[#f0f4f9] text-[#0d1b2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30";
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide">{label}{required && " *"}</label>}
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} className={cls}>
          <option value="">Selecione...</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className={cls} />
      )}
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a3a5c]/10">
          <h3 className="font-semibold text-[#1a3a5c]">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color = "blue", sub }: {
  label: string; value: string | number; icon: React.ElementType;
  color?: "blue" | "orange" | "red" | "green" | "purple"; sub?: string;
}) {
  const colors = {
    blue: "bg-[#1a3a5c] text-white",
    orange: "bg-[#f97316] text-white",
    red: "bg-red-600 text-white",
    green: "bg-green-600 text-white",
    purple: "bg-purple-700 text-white",
  };
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08 flex items-start gap-4">
      <div className={`rounded-lg p-2.5 flex-shrink-0 ${colors[color]}`}>
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold text-[#0d1b2a] font-['Barlow_Condensed']">{value}</div>
        <div className="text-xs text-[#5a7090] font-medium mt-0.5">{label}</div>
        {sub && <div className="text-xs text-[#f97316] font-semibold mt-1">{sub}</div>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#1a3a5c] font-['Barlow_Condensed'] tracking-wide">{title}</h2>
        {subtitle && <p className="text-sm text-[#5a7090] mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

function Table({ headers, children, empty = "Nenhum registro encontrado." }: {
  headers: string[]; children: React.ReactNode; empty?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#1a3a5c]/10 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a3a5c] text-white">
            {headers.map(h => <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {children || <tr><td colSpan={headers.length} className="px-4 py-8 text-center text-[#5a7090]">{empty}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function Tr({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <tr className={`border-t border-[#1a3a5c]/06 hover:bg-[#eef2f7] transition-colors ${className}`}>{children}</tr>;
}

function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-[#0d1b2a] ${className}`}>{children}</td>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function genId() { return Math.random().toString(36).slice(2, 10); }
function fmtDate(d: string) { return new Date(d).toLocaleDateString("pt-BR"); }
function fmtDateTime(d: string) { return new Date(d).toLocaleString("pt-BR"); }
function fmtCurrency(v: number) { return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

function stockStatus(p: Product): "green" | "yellow" | "red" {
  if (p.stock <= p.minStock) return "red";
  if (p.stock <= p.safetyStock) return "yellow";
  return "green";
}

function stockLabel(p: Product) {
  const s = stockStatus(p);
  if (s === "red") return { color: "red" as const, label: "Crítico" };
  if (s === "yellow") return { color: "yellow" as const, label: "Atenção" };
  return { color: "green" as const, label: "Adequado" };
}

// ─── Login Screen ─────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [user, setUser] = useState("admin");
  const [pass, setPass] = useState("123456");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (user === "admin" && pass === "123456") { onLogin(); }
    else setError("Usuário ou senha incorretos. Use: admin / 123456");
  }

  return (
    <div className="min-h-screen flex items-stretch bg-[#eef2f7]">
      <div className="hidden lg:flex w-1/2 bg-[#1a3a5c] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #ffffff 0, #ffffff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#f97316] rounded-lg p-2"><HardHat size={28} className="text-white" /></div>
            <div>
              <div className="text-white text-2xl font-bold font-['Barlow_Condensed'] tracking-wide">ObraStock</div>
              <div className="text-[#94b4d4] text-xs">Controle Inteligente de Almoxarifado</div>
            </div>
          </div>
          <h2 className="text-white text-4xl font-bold font-['Barlow_Condensed'] leading-tight mt-16">
            Rastreabilidade total<br />dos seus materiais
          </h2>
          <p className="text-[#94b4d4] mt-4 text-sm leading-relaxed max-w-sm">
            Controle entradas, saídas, devoluções e responsabilidades com precisão. Elimine o desperdício e aumente a eficiência das suas obras.
          </p>
        </div>
        <div className="relative z-10 grid grid-cols-2 gap-4">
          {[
            { icon: Package, label: "Controle de Estoque" },
            { icon: QrCode, label: "Crachá & SKU" },
            { icon: AlertTriangle, label: "Alertas Automáticos" },
            { icon: FileText, label: "Relatórios Completos" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <Icon size={16} className="text-[#f97316]" />
              <span className="text-white text-xs font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-[#f97316] rounded-lg p-2"><HardHat size={24} className="text-white" /></div>
            <div>
              <div className="text-[#1a3a5c] text-xl font-bold font-['Barlow_Condensed']">ObraStock</div>
              <div className="text-[#5a7090] text-xs">Controle Inteligente de Almoxarifado</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-[#1a3a5c] mb-1">Acesse o sistema</h1>
          <p className="text-[#5a7090] text-sm mb-8">Entre com suas credenciais para continuar</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input label="Usuário" value={user} onChange={setUser} placeholder="Digite seu usuário" />
            <Input label="Senha" value={pass} onChange={setPass} type="password" placeholder="Digite sua senha" />
            {error && <div className="text-red-600 text-sm bg-red-50 border border-red-200 rounded px-3 py-2">{error}</div>}
            <Btn type="submit" className="w-full justify-center mt-2">Entrar no Sistema</Btn>
          </form>
          <p className="text-xs text-[#5a7090] mt-6 text-center">Demo: admin / 123456</p>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const NAV_ITEMS: { id: View; label: string; icon: React.ElementType; group: string }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Principal" },
  { id: "products", label: "Produtos / SKU", icon: Package, group: "Cadastros" },
  { id: "employees", label: "Funcionários", icon: Users, group: "Cadastros" },
  { id: "constructions", label: "Obras & Almox.", icon: Building2, group: "Cadastros" },
  { id: "entries", label: "Entrada de Materiais", icon: ArrowDownToLine, group: "Movimentações" },
  { id: "withdrawals", label: "Retirada por Crachá", icon: ArrowUpFromLine, group: "Movimentações" },
  { id: "returns", label: "Devolução", icon: RotateCcw, group: "Movimentações" },
  { id: "kits", label: "Kits de Ferramentas", icon: Wrench, group: "Gestão" },
  { id: "phases", label: "Fases da Obra", icon: Layers, group: "Gestão" },
  { id: "alerts", label: "Estoque & Alertas", icon: ShieldAlert, group: "Gestão" },
  { id: "reports", label: "Relatórios", icon: FileText, group: "Análise" },
  { id: "history", label: "Histórico", icon: History, group: "Análise" },
];

function Sidebar({ current, onNav, collapsed, onCollapse, onLogout }: {
  current: View; onNav: (v: View) => void; collapsed: boolean;
  onCollapse: () => void; onLogout: () => void;
}) {
  const groups = [...new Set(NAV_ITEMS.map(i => i.group))];
  return (
    <aside className={`flex flex-col bg-[#1a3a5c] text-white transition-all duration-200 ${collapsed ? "w-16" : "w-56"} min-h-screen flex-shrink-0`}>
      <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2 min-w-0">
            <div className="bg-[#f97316] rounded p-1 flex-shrink-0"><HardHat size={18} /></div>
            <div className="min-w-0">
              <div className="font-bold text-sm font-['Barlow_Condensed'] tracking-wide truncate">ObraStock</div>
              <div className="text-[10px] text-[#94b4d4] truncate">Almoxarifado</div>
            </div>
          </div>
        )}
        {collapsed && <div className="mx-auto bg-[#f97316] rounded p-1"><HardHat size={18} /></div>}
        {!collapsed && (
          <button onClick={onCollapse} className="text-white/50 hover:text-white ml-2">
            <Menu size={16} />
          </button>
        )}
        {collapsed && (
          <button onClick={onCollapse} className="sr-only"><Menu size={16} /></button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-2">
        {groups.map(group => (
          <div key={group} className="mb-1">
            {!collapsed && <div className="px-4 pt-3 pb-1 text-[10px] font-bold text-[#94b4d4] uppercase tracking-widest">{group}</div>}
            {NAV_ITEMS.filter(i => i.group === group).map(item => {
              const active = current === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNav(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${active ? "bg-[#f97316] text-white font-semibold" : "text-[#b8cfe8] hover:bg-white/10 hover:text-white"}`}
                >
                  <item.icon size={16} className="flex-shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 p-3">
        <button onClick={onLogout} className="w-full flex items-center gap-2 px-2 py-2 text-sm text-[#94b4d4] hover:text-white hover:bg-white/10 rounded transition-colors">
          <LogOut size={16} />
          {!collapsed && <span>Sair</span>}
        </button>
      </div>
    </aside>
  );
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

function Dashboard({ products, employees, constructions, withdrawals, entries, movements }: {
  products: Product[]; employees: Employee[]; constructions: Construction[];
  withdrawals: Withdrawal[]; entries: Entry[]; movements: Movement[];
}) {
  const today = new Date().toDateString();
  const todayWithdrawals = withdrawals.filter(w => new Date(w.date).toDateString() === today);
  const pending = withdrawals.filter(w => w.returnStatus === "pendente");
  const lowStock = products.filter(p => stockStatus(p) !== "green");
  const losses = withdrawals.filter(w => w.returnStatus === "perdido");
  const lossValue = losses.reduce((sum, w) => {
    const p = products.find(x => x.id === w.productId);
    return sum + (p ? p.unitPrice * w.quantity : 0);
  }, 0);

  // Top withdrawn
  const productWithdrawCounts = products.map(p => ({
    name: p.name.length > 18 ? p.name.slice(0, 18) + "…" : p.name,
    qty: withdrawals.filter(w => w.productId === p.id).reduce((s, w) => s + w.quantity, 0),
  })).sort((a, b) => b.qty - a.qty).slice(0, 6);

  // Losses by category
  const catLosses: Record<string, number> = {};
  losses.forEach(w => {
    const p = products.find(x => x.id === w.productId);
    if (p) catLosses[p.category] = (catLosses[p.category] || 0) + 1;
  });
  const pieData = Object.entries(catLosses).map(([name, value]) => ({ name, value }));
  if (pieData.length === 0) pieData.push({ name: "Sem perdas", value: 1 });

  // Monthly consumption (simulate)
  const monthData = [
    { mes: "Jan", consumo: 420 }, { mes: "Fev", consumo: 380 }, { mes: "Mar", consumo: 510 },
    { mes: "Abr", consumo: 490 }, { mes: "Mai", consumo: 620 }, { mes: "Jun", consumo: 580 },
  ];

  const PIE_COLORS = ["#f97316", "#1a3a5c", "#16a34a", "#dc2626", "#7c3aed"];

  const topEmployee = employees.map(e => ({
    ...e, count: withdrawals.filter(w => w.employeeId === e.id).reduce((s, w) => s + w.quantity, 0)
  })).sort((a, b) => b.count - a.count)[0];

  const topConstruction = constructions.map(c => ({
    ...c, count: withdrawals.filter(w => w.constructionId === c.id).reduce((s, w) => s + w.quantity, 0)
  })).sort((a, b) => b.count - a.count)[0];

  return (
    <div>
      <SectionHeader title="Dashboard" subtitle="Visão geral do almoxarifado em tempo real" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Produtos Cadastrados" value={products.length} icon={Package} color="blue" />
        <StatCard label="Total em Estoque" value={products.reduce((s, p) => s + p.stock, 0)} icon={PackageCheck} color="green" />
        <StatCard label="Estoque Crítico / Atenção" value={lowStock.length} icon={AlertTriangle} color="red" sub={lowStock.length > 0 ? "Requer atenção!" : undefined} />
        <StatCard label="Retiradas Hoje" value={todayWithdrawals.length} icon={ArrowUpFromLine} color="orange" />
        <StatCard label="Devoluções Pendentes" value={pending.length} icon={Clock} color="red" />
        <StatCard label="Valor Estimado de Perdas" value={fmtCurrency(lossValue)} icon={DollarSign} color="purple" />
        <StatCard label="Funcionário Top" value={topEmployee ? topEmployee.name.split(" ")[0] : "-"} icon={Users} color="blue" sub={topEmployee ? `${topEmployee.count} itens retirados` : undefined} />
        <StatCard label="Obra com Maior Consumo" value={topConstruction ? topConstruction.name.split(" ").slice(0, 2).join(" ") : "-"} icon={Building2} color="orange" sub={topConstruction ? `${topConstruction.count} itens` : undefined} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08">
          <h3 className="font-semibold text-[#1a3a5c] mb-4 text-sm uppercase tracking-wide">Materiais Mais Retirados</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productWithdrawCounts} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="qty" fill="#1a3a5c" radius={[4, 4, 0, 0]} name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08">
          <h3 className="font-semibold text-[#1a3a5c] mb-4 text-sm uppercase tracking-wide">Perdas por Categoria</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name">
                {pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08">
          <h3 className="font-semibold text-[#1a3a5c] mb-4 text-sm uppercase tracking-wide">Consumo Mensal</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={monthData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" />
              <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="consumo" stroke="#f97316" strokeWidth={2} dot={{ fill: "#f97316", r: 4 }} name="Consumo" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08">
          <h3 className="font-semibold text-[#1a3a5c] mb-3 text-sm uppercase tracking-wide flex items-center gap-2"><Bell size={14} className="text-[#f97316]" /> Alertas</h3>
          <div className="space-y-2">
            {lowStock.map(p => (
              <div key={p.id} className="flex items-start gap-2 bg-red-50 border border-red-200 rounded px-3 py-2">
                <AlertTriangle size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-semibold text-red-700">{p.name}</div>
                  <div className="text-red-500">Estoque: {p.stock} {p.unit} (mín: {p.minStock})</div>
                </div>
              </div>
            ))}
            {pending.map(w => {
              const p = products.find(x => x.id === w.productId);
              const e = employees.find(x => x.id === w.employeeId);
              return (
                <div key={w.id} className="flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">
                  <Clock size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <div className="font-semibold text-yellow-800">{p?.name}</div>
                    <div className="text-yellow-700">{e?.name} — pendente</div>
                  </div>
                </div>
              );
            })}
            {lowStock.length === 0 && pending.length === 0 && (
              <div className="text-xs text-[#5a7090] text-center py-4">Nenhum alerta no momento</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Products View ────────────────────────────────────────────────────────────

function ProductsView({ products, setProducts }: { products: Product[]; setProducts: (fn: (p: Product[]) => Product[]) => void }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const blank: Omit<Product, "id"> = { name: "", sku: "", category: "", unit: "un", unitPrice: 0, supplier: "", stock: 0, minStock: 0, safetyStock: 0, location: "", type: "consumivel", phase: "" };
  const [form, setForm] = useState<Omit<Product, "id">>(blank);

  const cats = [...new Set(products.map(p => p.category))];

  const filtered = products.filter(p =>
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())) &&
    (!filter || p.category === filter)
  );

  function openNew() { setForm(blank); setEditing(null); setShowModal(true); }
  function openEdit(p: Product) { setForm({ ...p }); setEditing(p); setShowModal(true); }
  function save() {
    if (!form.name || !form.sku) return;
    setProducts(prev => editing ? prev.map(p => p.id === editing.id ? { ...form, id: editing.id } : p) : [...prev, { ...form, id: genId() }]);
    setShowModal(false);
  }
  function del(id: string) { if (confirm("Excluir produto?")) setProducts(prev => prev.filter(p => p.id !== id)); }

  return (
    <div>
      <SectionHeader title="Produtos / SKU" subtitle="Cadastro e controle de materiais do almoxarifado"
        actions={<Btn onClick={openNew}><Plus size={14} /> Novo Produto</Btn>} />

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7090]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou SKU..." className="w-full pl-9 pr-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none">
          <option value="">Todas categorias</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <Table headers={["SKU", "Nome", "Categoria", "Estoque", "Mín.", "Tipo", "Status", "Ações"]}>
        {filtered.map(p => {
          const { color, label } = stockLabel(p);
          return (
            <Tr key={p.id}>
              <Td><span className="font-mono text-xs bg-[#eef2f7] px-2 py-0.5 rounded">{p.sku}</span></Td>
              <Td className="font-medium">{p.name}</Td>
              <Td>{p.category}</Td>
              <Td><span className="font-bold">{p.stock}</span> {p.unit}</Td>
              <Td className="text-[#5a7090]">{p.minStock} {p.unit}</Td>
              <Td><Badge color={p.type === "consumivel" ? "blue" : "orange"}>{p.type === "consumivel" ? "Consumível" : "Devolutivo"}</Badge></Td>
              <Td><Badge color={color}>{label}</Badge></Td>
              <Td>
                <div className="flex gap-1">
                  <Btn variant="ghost" size="sm" onClick={() => openEdit(p)}><Edit2 size={13} /></Btn>
                  <Btn variant="ghost" size="sm" onClick={() => del(p.id)}><Trash2 size={13} className="text-red-500" /></Btn>
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>

      {showModal && (
        <Modal title={editing ? "Editar Produto" : "Novo Produto"} onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome do Produto" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required className="col-span-2" />
            <Input label="SKU" value={form.sku} onChange={v => setForm(f => ({ ...f, sku: v }))} required />
            <Input label="Categoria" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
            <Input label="Unidade" value={form.unit} onChange={v => setForm(f => ({ ...f, unit: v }))} />
            <Input label="Valor Unitário (R$)" value={form.unitPrice} onChange={v => setForm(f => ({ ...f, unitPrice: parseFloat(v) || 0 }))} type="number" />
            <Input label="Fornecedor" value={form.supplier} onChange={v => setForm(f => ({ ...f, supplier: v }))} />
            <Input label="Estoque Atual" value={form.stock} onChange={v => setForm(f => ({ ...f, stock: parseInt(v) || 0 }))} type="number" />
            <Input label="Estoque Mínimo" value={form.minStock} onChange={v => setForm(f => ({ ...f, minStock: parseInt(v) || 0 }))} type="number" />
            <Input label="Estoque de Segurança" value={form.safetyStock} onChange={v => setForm(f => ({ ...f, safetyStock: parseInt(v) || 0 }))} type="number" />
            <Input label="Localização" value={form.location} onChange={v => setForm(f => ({ ...f, location: v }))} />
            <Input label="Tipo" value={form.type} onChange={v => setForm(f => ({ ...f, type: v as "consumivel" | "devolutivo" }))}
              options={[{ value: "consumivel", label: "Consumível" }, { value: "devolutivo", label: "Devolutivo" }]} />
            <Input label="Fase da Obra" value={form.phase} onChange={v => setForm(f => ({ ...f, phase: v }))}
              options={[{ value: "Todas", label: "Todas" }, ...PHASES.map(p => ({ value: p, label: p }))]} />
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14} /> Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Employees View ───────────────────────────────────────────────────────────

function EmployeesView({ employees, setEmployees, withdrawals, products }: {
  employees: Employee[]; setEmployees: (fn: (e: Employee[]) => Employee[]) => void;
  withdrawals: Withdrawal[]; products: Product[];
}) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [viewHistory, setViewHistory] = useState<Employee | null>(null);
  const blank = { name: "", role: "", company: "", badgeNumber: "", status: "ativo" as const };
  const [form, setForm] = useState(blank);

  const filtered = employees.filter(e => e.name.toLowerCase().includes(search.toLowerCase()) || e.badgeNumber.includes(search));

  function openNew() { setForm(blank); setEditing(null); setShowModal(true); }
  function openEdit(e: Employee) { setForm({ ...e }); setEditing(e); setShowModal(true); }
  function save() {
    if (!form.name) return;
    setEmployees(prev => editing ? prev.map(e => e.id === editing.id ? { ...form, id: editing.id } : e) : [...prev, { ...form, id: genId() }]);
    setShowModal(false);
  }
  function del(id: string) { if (confirm("Excluir funcionário?")) setEmployees(prev => prev.filter(e => e.id !== id)); }

  return (
    <div>
      <SectionHeader title="Funcionários" subtitle="Cadastro e histórico de funcionários e responsáveis"
        actions={<Btn onClick={openNew}><Plus size={14} /> Novo Funcionário</Btn>} />

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7090]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou crachá..." className="w-full pl-9 pr-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none" />
        </div>
      </div>

      <Table headers={["Crachá", "Nome", "Cargo", "Empresa", "Status", "Retiradas", "Pendências", "Ações"]}>
        {filtered.map(e => {
          const total = withdrawals.filter(w => w.employeeId === e.id).length;
          const pend = withdrawals.filter(w => w.employeeId === e.id && w.returnStatus === "pendente").length;
          return (
            <Tr key={e.id}>
              <Td><span className="font-mono text-xs bg-[#eef2f7] px-2 py-0.5 rounded">#{e.badgeNumber}</span></Td>
              <Td className="font-medium">{e.name}</Td>
              <Td>{e.role}</Td>
              <Td>{e.company}</Td>
              <Td><Badge color={e.status === "ativo" ? "green" : "gray"}>{e.status === "ativo" ? "Ativo" : "Inativo"}</Badge></Td>
              <Td className="font-bold text-[#1a3a5c]">{total}</Td>
              <Td>{pend > 0 ? <Badge color="red">{pend} pendente(s)</Badge> : <Badge color="green">Em dia</Badge>}</Td>
              <Td>
                <div className="flex gap-1">
                  <Btn variant="ghost" size="sm" onClick={() => setViewHistory(e)}><Eye size={13} /></Btn>
                  <Btn variant="ghost" size="sm" onClick={() => openEdit(e)}><Edit2 size={13} /></Btn>
                  <Btn variant="ghost" size="sm" onClick={() => del(e.id)}><Trash2 size={13} className="text-red-500" /></Btn>
                </div>
              </Td>
            </Tr>
          );
        })}
      </Table>

      {showModal && (
        <Modal title={editing ? "Editar Funcionário" : "Novo Funcionário"} onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome Completo" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required className="col-span-2" />
            <Input label="Cargo / Função" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />
            <Input label="Empresa / Terceirizada" value={form.company} onChange={v => setForm(f => ({ ...f, company: v }))} />
            <Input label="Número do Crachá" value={form.badgeNumber} onChange={v => setForm(f => ({ ...f, badgeNumber: v }))} />
            <Input label="Status" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as "ativo" | "inativo" }))}
              options={[{ value: "ativo", label: "Ativo" }, { value: "inativo", label: "Inativo" }]} />
          </div>
          <div className="mt-4 p-3 bg-[#eef2f7] rounded flex items-center gap-3">
            <QrCode size={40} className="text-[#1a3a5c]" />
            <div className="text-xs text-[#5a7090]">
              <div className="font-semibold text-[#1a3a5c]">QR Code / Código de Barras</div>
              <div>Crachá #{form.badgeNumber || "000"} — {form.name || "Nome do funcionário"}</div>
            </div>
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14} /> Salvar</Btn>
          </div>
        </Modal>
      )}

      {viewHistory && (
        <Modal title={`Histórico — ${viewHistory.name}`} onClose={() => setViewHistory(null)}>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {withdrawals.filter(w => w.employeeId === viewHistory.id).length === 0 ? (
              <p className="text-sm text-[#5a7090] text-center py-4">Nenhuma retirada registrada.</p>
            ) : withdrawals.filter(w => w.employeeId === viewHistory.id).map(w => {
              const p = products.find(x => x.id === w.productId);
              const statusColor = { pendente: "yellow", devolvido: "green", danificado: "orange", perdido: "red", na: "gray" }[w.returnStatus] as "yellow" | "green" | "orange" | "red" | "gray";
              return (
                <div key={w.id} className="flex items-center justify-between bg-[#eef2f7] rounded px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{p?.name}</div>
                    <div className="text-xs text-[#5a7090]">{fmtDate(w.date)} — {w.quantity} {p?.unit}</div>
                  </div>
                  <Badge color={statusColor}>{w.returnStatus === "na" ? "Consumível" : w.returnStatus}</Badge>
                </div>
              );
            })}
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Constructions View ───────────────────────────────────────────────────────

function ConstructionsView({ constructions, setConstructions, warehouses, setWarehouses }: {
  constructions: Construction[]; setConstructions: (fn: (c: Construction[]) => Construction[]) => void;
  warehouses: Warehouse[]; setWarehouses: (fn: (w: Warehouse[]) => Warehouse[]) => void;
}) {
  const [tab, setTab] = useState<"obras" | "almox">("obras");
  const [showModal, setShowModal] = useState(false);
  const [showWModal, setShowWModal] = useState(false);
  const [editing, setEditing] = useState<Construction | null>(null);
  const blank: Omit<Construction, "id"> = { name: "", address: "", tower: "", floor: "", apartment: "", phase: "Fundação" };
  const [form, setForm] = useState(blank);
  const [wform, setWform] = useState({ name: "", type: "central" as Warehouse["type"], constructionId: "" });

  function saveConstruction() {
    if (!form.name) return;
    setConstructions(prev => editing ? prev.map(c => c.id === editing.id ? { ...form, id: editing.id } : c) : [...prev, { ...form, id: genId() }]);
    setShowModal(false);
  }
  function saveWarehouse() {
    if (!wform.name) return;
    setWarehouses(prev => [...prev, { ...wform, id: genId() }]);
    setShowWModal(false);
    setWform({ name: "", type: "central", constructionId: "" });
  }

  const typeLabels = { central: "Central", obra: "da Obra", frente: "por Frente de Serviço" };

  return (
    <div>
      <SectionHeader title="Obras & Almoxarifados" subtitle="Gestão de obras, torres, andares e locais de estoque" />
      <div className="flex gap-2 mb-6">
        {(["obras", "almox"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${tab === t ? "bg-[#1a3a5c] text-white" : "bg-white text-[#1a3a5c] border border-[#1a3a5c]/20"}`}>
            {t === "obras" ? "Obras" : "Almoxarifados"}
          </button>
        ))}
      </div>

      {tab === "obras" && (
        <>
          <div className="mb-4 flex justify-end">
            <Btn onClick={() => { setForm(blank); setEditing(null); setShowModal(true); }}><Plus size={14} /> Nova Obra</Btn>
          </div>
          <Table headers={["Nome da Obra", "Endereço", "Torre", "Fase Atual", "Ações"]}>
            {constructions.map(c => (
              <Tr key={c.id}>
                <Td className="font-medium">{c.name}</Td>
                <Td className="text-[#5a7090] text-xs">{c.address}</Td>
                <Td>{c.tower}</Td>
                <Td><Badge color="blue">{c.phase}</Badge></Td>
                <Td>
                  <div className="flex gap-1">
                    <Btn variant="ghost" size="sm" onClick={() => { setForm({ ...c }); setEditing(c); setShowModal(true); }}><Edit2 size={13} /></Btn>
                    <Btn variant="ghost" size="sm" onClick={() => { if (confirm("Excluir?")) setConstructions(prev => prev.filter(x => x.id !== c.id)); }}><Trash2 size={13} className="text-red-500" /></Btn>
                  </div>
                </Td>
              </Tr>
            ))}
          </Table>
        </>
      )}

      {tab === "almox" && (
        <>
          <div className="mb-4 flex justify-end">
            <Btn onClick={() => setShowWModal(true)}><Plus size={14} /> Novo Almoxarifado</Btn>
          </div>
          <Table headers={["Nome", "Tipo", "Obra Vinculada", "Ações"]}>
            {warehouses.map(w => {
              const c = constructions.find(x => x.id === w.constructionId);
              return (
                <Tr key={w.id}>
                  <Td className="font-medium">{w.name}</Td>
                  <Td><Badge color={w.type === "central" ? "blue" : w.type === "obra" ? "green" : "orange"}>Almox. {typeLabels[w.type]}</Badge></Td>
                  <Td>{c?.name || "—"}</Td>
                  <Td>
                    <Btn variant="ghost" size="sm" onClick={() => { if (confirm("Excluir?")) setWarehouses(prev => prev.filter(x => x.id !== w.id)); }}><Trash2 size={13} className="text-red-500" /></Btn>
                  </Td>
                </Tr>
              );
            })}
          </Table>
        </>
      )}

      {showModal && (
        <Modal title={editing ? "Editar Obra" : "Nova Obra"} onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Nome da Obra" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required className="col-span-2" />
            <Input label="Endereço" value={form.address} onChange={v => setForm(f => ({ ...f, address: v }))} className="col-span-2" />
            <Input label="Torre / Prédio" value={form.tower} onChange={v => setForm(f => ({ ...f, tower: v }))} />
            <Input label="Andar(es)" value={form.floor} onChange={v => setForm(f => ({ ...f, floor: v }))} />
            <Input label="Apartamento / Local" value={form.apartment} onChange={v => setForm(f => ({ ...f, apartment: v }))} />
            <Input label="Fase Atual" value={form.phase} onChange={v => setForm(f => ({ ...f, phase: v }))}
              options={PHASES.map(p => ({ value: p, label: p }))} />
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={saveConstruction}><Check size={14} /> Salvar</Btn>
          </div>
        </Modal>
      )}

      {showWModal && (
        <Modal title="Novo Almoxarifado" onClose={() => setShowWModal(false)}>
          <div className="grid grid-cols-1 gap-3">
            <Input label="Nome do Almoxarifado" value={wform.name} onChange={v => setWform(f => ({ ...f, name: v }))} required />
            <Input label="Tipo" value={wform.type} onChange={v => setWform(f => ({ ...f, type: v as Warehouse["type"] }))}
              options={[{ value: "central", label: "Central" }, { value: "obra", label: "da Obra" }, { value: "frente", label: "por Frente de Serviço" }]} />
            <Input label="Obra Vinculada" value={wform.constructionId} onChange={v => setWform(f => ({ ...f, constructionId: v }))}
              options={constructions.map(c => ({ value: c.id, label: c.name }))} />
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowWModal(false)}>Cancelar</Btn>
            <Btn onClick={saveWarehouse}><Check size={14} /> Salvar</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Entries View ─────────────────────────────────────────────────────────────

function EntriesView({ entries, setEntries, products, setProducts, warehouses, employees, addMovement }: {
  entries: Entry[]; setEntries: (fn: (e: Entry[]) => Entry[]) => void;
  products: Product[]; setProducts: (fn: (p: Product[]) => Product[]) => void;
  warehouses: Warehouse[]; employees: Employee[]; addMovement: (m: Omit<Movement, "id">) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const blank = { date: new Date().toISOString().slice(0, 10), productId: "", quantity: 1, supplier: "", invoice: "", totalValue: 0, warehouseId: "", responsibleId: "" };
  const [form, setForm] = useState(blank);

  function save() {
    if (!form.productId || !form.quantity) return;
    const entry: Entry = { ...form, id: genId(), quantity: Number(form.quantity), totalValue: Number(form.totalValue) };
    setEntries(prev => [entry, ...prev]);
    setProducts(prev => prev.map(p => p.id === form.productId ? { ...p, stock: p.stock + Number(form.quantity) } : p));
    addMovement({ date: new Date().toISOString(), type: "entrada", productId: form.productId, quantity: Number(form.quantity), status: "Concluído" });
    setShowModal(false);
    setForm(blank);
  }

  return (
    <div>
      <SectionHeader title="Entrada de Materiais" subtitle="Registro de recebimento de materiais no estoque"
        actions={<Btn onClick={() => setShowModal(true)}><Plus size={14} /> Registrar Entrada</Btn>} />

      <Table headers={["Data", "Produto", "Qtd", "Fornecedor", "Nota Fiscal", "Valor Total", "Responsável"]}>
        {entries.map(en => {
          const p = products.find(x => x.id === en.productId);
          const resp = employees.find(x => x.id === en.responsibleId);
          return (
            <Tr key={en.id}>
              <Td>{fmtDate(en.date)}</Td>
              <Td className="font-medium">{p?.name || "—"}</Td>
              <Td className="font-bold text-green-700">+{en.quantity} {p?.unit}</Td>
              <Td>{en.supplier}</Td>
              <Td><span className="font-mono text-xs">{en.invoice}</span></Td>
              <Td>{fmtCurrency(en.totalValue)}</Td>
              <Td>{resp?.name || "—"}</Td>
            </Tr>
          );
        })}
      </Table>

      {showModal && (
        <Modal title="Registrar Entrada de Material" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Data de Entrada" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} type="date" />
            <Input label="Produto / SKU" value={form.productId} onChange={v => setForm(f => ({ ...f, productId: v }))}
              options={products.map(p => ({ value: p.id, label: `${p.sku} — ${p.name}` }))} required />
            <Input label="Quantidade" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: parseInt(v) || 1 }))} type="number" />
            <Input label="Fornecedor" value={form.supplier} onChange={v => setForm(f => ({ ...f, supplier: v }))} />
            <Input label="Nota Fiscal" value={form.invoice} onChange={v => setForm(f => ({ ...f, invoice: v }))} />
            <Input label="Valor Total (R$)" value={form.totalValue} onChange={v => setForm(f => ({ ...f, totalValue: parseFloat(v) || 0 }))} type="number" />
            <Input label="Almoxarifado de Destino" value={form.warehouseId} onChange={v => setForm(f => ({ ...f, warehouseId: v }))}
              options={warehouses.map(w => ({ value: w.id, label: w.name }))} />
            <Input label="Responsável pelo Recebimento" value={form.responsibleId} onChange={v => setForm(f => ({ ...f, responsibleId: v }))}
              options={employees.map(e => ({ value: e.id, label: e.name }))} />
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14} /> Confirmar Entrada</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Withdrawals View ─────────────────────────────────────────────────────────

function WithdrawalsView({ withdrawals, setWithdrawals, products, setProducts, employees, constructions, addMovement }: {
  withdrawals: Withdrawal[]; setWithdrawals: (fn: (w: Withdrawal[]) => Withdrawal[]) => void;
  products: Product[]; setProducts: (fn: (p: Product[]) => Product[]) => void;
  employees: Employee[]; constructions: Construction[]; addMovement: (m: Omit<Movement, "id">) => void;
}) {
  const [badgeInput, setBadgeInput] = useState("");
  const [foundEmployee, setFoundEmployee] = useState<Employee | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [dupAlert, setDupAlert] = useState(false);
  const blank = { productId: "", quantity: 1, constructionId: "", tower: "", floor: "", apartment: "", type: "consumivel" as const, justification: "" };
  const [form, setForm] = useState(blank);
  const [search, setSearch] = useState("");

  function searchBadge() {
    const emp = employees.find(e => e.badgeNumber === badgeInput.trim());
    if (emp) { setFoundEmployee(emp); setShowModal(true); }
    else alert("Funcionário não encontrado. Verifique o número do crachá.");
  }

  function confirmWithdrawal() {
    if (!foundEmployee || !form.productId) return;
    const product = products.find(p => p.id === form.productId);
    if (!product) return;
    if (product.stock < form.quantity) { alert("Estoque insuficiente!"); return; }

    const today = new Date().toDateString();
    const isDup = withdrawals.some(w => w.employeeId === foundEmployee.id && w.productId === form.productId && new Date(w.date).toDateString() === today);
    if (isDup && !dupAlert) { setDupAlert(true); return; }

    const wd: Withdrawal = {
      id: genId(), date: new Date().toISOString(), employeeId: foundEmployee.id,
      productId: form.productId, quantity: Number(form.quantity),
      constructionId: form.constructionId, tower: form.tower, floor: form.floor, apartment: form.apartment,
      type: product.type, justification: form.justification,
      returnStatus: product.type === "devolutivo" ? "pendente" : "na"
    };
    setWithdrawals(prev => [wd, ...prev]);
    setProducts(prev => prev.map(p => p.id === form.productId ? { ...p, stock: p.stock - Number(form.quantity) } : p));
    addMovement({ date: new Date().toISOString(), type: "saida", productId: form.productId, quantity: Number(form.quantity), employeeId: foundEmployee.id, constructionId: form.constructionId, status: "Concluído" });
    setShowModal(false); setShowConfirm(false); setDupAlert(false);
    setForm(blank); setBadgeInput(""); setFoundEmployee(null);
  }

  const filtered = withdrawals.filter(w => {
    const e = employees.find(x => x.id === w.employeeId);
    const p = products.find(x => x.id === w.productId);
    return !search || e?.name.toLowerCase().includes(search.toLowerCase()) || p?.name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedProduct = products.find(p => p.id === form.productId);

  return (
    <div>
      <SectionHeader title="Retirada por Crachá" subtitle="Registre retiradas de materiais identificando o funcionário pelo crachá" />

      <div className="bg-white rounded-xl p-6 shadow-sm border border-[#1a3a5c]/08 mb-6">
        <h3 className="font-semibold text-[#1a3a5c] mb-4 flex items-center gap-2"><QrCode size={16} /> Leitura de Crachá</h3>
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input value={badgeInput} onChange={e => setBadgeInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && searchBadge()}
              placeholder="Digite ou escaneie o número do crachá..." className="w-full px-4 py-3 rounded-lg border-2 border-[#1a3a5c]/20 bg-[#eef2f7] text-lg font-mono focus:outline-none focus:border-[#1a3a5c]" />
          </div>
          <Btn onClick={searchBadge} className="px-6"><QrCode size={16} /> Identificar</Btn>
        </div>
      </div>

      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7090]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar retiradas..." className="w-full pl-9 pr-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none" />
        </div>
      </div>

      <Table headers={["Data/Hora", "Funcionário", "Produto", "Qtd", "Obra / Local", "Tipo", "Status"]}>
        {filtered.map(w => {
          const e = employees.find(x => x.id === w.employeeId);
          const p = products.find(x => x.id === w.productId);
          const statusColor = { pendente: "yellow", devolvido: "green", danificado: "orange", perdido: "red", na: "gray" }[w.returnStatus] as "yellow" | "green" | "orange" | "red" | "gray";
          const statusLabel = { pendente: "Pendente", devolvido: "Devolvido", danificado: "Danificado", perdido: "Perdido", na: "Consumível" }[w.returnStatus];
          return (
            <Tr key={w.id}>
              <Td className="text-xs">{fmtDateTime(w.date)}</Td>
              <Td className="font-medium">{e?.name || "—"}</Td>
              <Td>{p?.name || "—"}</Td>
              <Td className="font-bold text-red-600">-{w.quantity} {p?.unit}</Td>
              <Td className="text-xs text-[#5a7090]">{constructions.find(c => c.id === w.constructionId)?.name} • {w.floor}º {w.apartment}</Td>
              <Td><Badge color={w.type === "consumivel" ? "blue" : "orange"}>{w.type === "consumivel" ? "Consumível" : "Devolutivo"}</Badge></Td>
              <Td><Badge color={statusColor}>{statusLabel}</Badge></Td>
            </Tr>
          );
        })}
      </Table>

      {showModal && foundEmployee && (
        <Modal title={`Retirada — ${foundEmployee.name}`} onClose={() => { setShowModal(false); setDupAlert(false); }}>
          <div className="flex items-center gap-3 bg-[#eef2f7] rounded-lg px-4 py-3 mb-4">
            <div className="bg-[#1a3a5c] rounded-full w-10 h-10 flex items-center justify-center text-white font-bold">
              {foundEmployee.name[0]}
            </div>
            <div>
              <div className="font-semibold text-[#1a3a5c]">{foundEmployee.name}</div>
              <div className="text-xs text-[#5a7090]">{foundEmployee.role} • {foundEmployee.company} • Crachá #{foundEmployee.badgeNumber}</div>
            </div>
          </div>
          {dupAlert && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-4 text-sm text-yellow-800">
              <strong>Atenção:</strong> Este funcionário já retirou este material hoje. Deseja continuar mesmo assim?
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <Input label="Produto / SKU" value={form.productId} onChange={v => setForm(f => ({ ...f, productId: v }))}
              options={products.filter(p => p.stock > 0).map(p => ({ value: p.id, label: `${p.sku} — ${p.name} (${p.stock} ${p.unit})` }))} required className="col-span-2" />
            <Input label="Quantidade" value={form.quantity} onChange={v => setForm(f => ({ ...f, quantity: parseInt(v) || 1 }))} type="number" />
            <Input label="Obra" value={form.constructionId} onChange={v => setForm(f => ({ ...f, constructionId: v }))}
              options={constructions.map(c => ({ value: c.id, label: c.name }))} />
            <Input label="Torre" value={form.tower} onChange={v => setForm(f => ({ ...f, tower: v }))} />
            <Input label="Andar" value={form.floor} onChange={v => setForm(f => ({ ...f, floor: v }))} />
            <Input label="Apartamento / Local" value={form.apartment} onChange={v => setForm(f => ({ ...f, apartment: v }))} className="col-span-2" />
            <div className="col-span-2">
              <label className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide">Justificativa</label>
              <textarea value={form.justification} onChange={e => setForm(f => ({ ...f, justification: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded border border-[#1a3a5c]/15 bg-[#f0f4f9] text-sm focus:outline-none resize-none" rows={2} />
            </div>
          </div>
          {selectedProduct && (
            <div className="mt-3 p-3 bg-[#eef2f7] rounded text-xs">
              <div className="font-semibold text-[#1a3a5c]">{selectedProduct.name}</div>
              <div className="text-[#5a7090]">Tipo: {selectedProduct.type === "consumivel" ? "Consumível" : "Devolutivo (devolução obrigatória)"} • Estoque: {selectedProduct.stock} {selectedProduct.unit}</div>
            </div>
          )}
          {!showConfirm ? (
            <div className="flex gap-2 mt-5 justify-end">
              <Btn variant="secondary" onClick={() => { setShowModal(false); setDupAlert(false); }}>Cancelar</Btn>
              <Btn onClick={() => setShowConfirm(true)} disabled={!form.productId}>Prosseguir</Btn>
            </div>
          ) : (
            <div className="mt-5">
              <div className="bg-[#1a3a5c]/05 border border-[#1a3a5c]/20 rounded p-3 text-xs text-[#1a3a5c] mb-4">
                <strong>Termo de Responsabilidade:</strong> "Declaro que recebi os materiais acima e sou responsável pela utilização correta e devolução dos itens devolutivos."
              </div>
              <div className="flex gap-2 justify-end">
                <Btn variant="secondary" onClick={() => setShowConfirm(false)}>Voltar</Btn>
                <Btn variant="orange" onClick={confirmWithdrawal}><Check size={14} /> Confirmar e Assinar</Btn>
              </div>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ─── Returns View ─────────────────────────────────────────────────────────────

function ReturnsView({ returns, setReturns, withdrawals, setWithdrawals, products, setProducts, employees, addMovement }: {
  returns: Return[]; setReturns: (fn: (r: Return[]) => Return[]) => void;
  withdrawals: Withdrawal[]; setWithdrawals: (fn: (w: Withdrawal[]) => Withdrawal[]) => void;
  products: Product[]; setProducts: (fn: (p: Product[]) => Product[]) => void;
  employees: Employee[]; addMovement: (m: Omit<Movement, "id">) => void;
}) {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ withdrawalId: "", state: "bom" as Return["state"], observation: "" });

  const pending = withdrawals.filter(w => w.returnStatus === "pendente");

  function save() {
    if (!form.withdrawalId) return;
    const wd = withdrawals.find(w => w.id === form.withdrawalId);
    if (!wd) return;
    const ret: Return = { id: genId(), withdrawalId: form.withdrawalId, returnDate: new Date().toISOString().slice(0, 10), state: form.state, observation: form.observation };
    setReturns(prev => [ret, ...prev]);
    const newStatus: Withdrawal["returnStatus"] = { bom: "devolvido", danificado: "danificado", perdido: "perdido", "nao-devolvido": "pendente" }[form.state] as Withdrawal["returnStatus"];
    setWithdrawals(prev => prev.map(w => w.id === form.withdrawalId ? { ...w, returnStatus: newStatus } : w));
    if (form.state === "bom") {
      setProducts(prev => prev.map(p => p.id === wd.productId ? { ...p, stock: p.stock + wd.quantity } : p));
    }
    const mvType: Movement["type"] = form.state === "perdido" ? "perda" : "devolucao";
    addMovement({ date: new Date().toISOString(), type: mvType, productId: wd.productId, quantity: wd.quantity, employeeId: wd.employeeId, status: form.state });
    setShowModal(false);
    setForm({ withdrawalId: "", state: "bom", observation: "" });
  }

  return (
    <div>
      <SectionHeader title="Devolução de Materiais" subtitle="Registre devoluções de ferramentas e itens devolutivos"
        actions={<Btn onClick={() => setShowModal(true)}><Plus size={14} /> Registrar Devolução</Btn>} />

      <div className="mb-6">
        <h3 className="font-semibold text-[#1a3a5c] mb-3 text-sm uppercase tracking-wide flex items-center gap-2"><Clock size={14} className="text-[#f97316]" /> Pendentes de Devolução ({pending.length})</h3>
        <Table headers={["Funcionário", "Produto", "Qtd", "Data Retirada", "Dias em Aberto", "Ação"]}>
          {pending.map(w => {
            const e = employees.find(x => x.id === w.employeeId);
            const p = products.find(x => x.id === w.productId);
            const days = Math.floor((Date.now() - new Date(w.date).getTime()) / 86400000);
            return (
              <Tr key={w.id}>
                <Td className="font-medium">{e?.name}</Td>
                <Td>{p?.name}</Td>
                <Td>{w.quantity} {p?.unit}</Td>
                <Td>{fmtDate(w.date)}</Td>
                <Td><Badge color={days > 3 ? "red" : "yellow"}>{days} dia(s)</Badge></Td>
                <Td>
                  <Btn size="sm" onClick={() => { setForm(f => ({ ...f, withdrawalId: w.id })); setShowModal(true); }}>Registrar</Btn>
                </Td>
              </Tr>
            );
          })}
          {pending.length === 0 && <tr><td colSpan={6} className="text-center text-[#5a7090] py-8 px-4">Nenhuma devolução pendente!</td></tr>}
        </Table>
      </div>

      <h3 className="font-semibold text-[#1a3a5c] mb-3 text-sm uppercase tracking-wide">Histórico de Devoluções</h3>
      <Table headers={["Data Devolução", "Produto", "Funcionário", "Estado", "Observação"]}>
        {returns.map(r => {
          const wd = withdrawals.find(w => w.id === r.withdrawalId);
          const p = wd ? products.find(x => x.id === wd.productId) : null;
          const e = wd ? employees.find(x => x.id === wd.employeeId) : null;
          const stateColors = { bom: "green", danificado: "orange", perdido: "red", "nao-devolvido": "yellow" } as const;
          const stateLabels = { bom: "Bom Estado", danificado: "Danificado", perdido: "Perdido", "nao-devolvido": "Não Devolvido" };
          return (
            <Tr key={r.id}>
              <Td>{fmtDate(r.returnDate)}</Td>
              <Td>{p?.name || "—"}</Td>
              <Td>{e?.name || "—"}</Td>
              <Td><Badge color={stateColors[r.state]}>{stateLabels[r.state]}</Badge></Td>
              <Td className="text-xs text-[#5a7090]">{r.observation || "—"}</Td>
            </Tr>
          );
        })}
      </Table>

      {showModal && (
        <Modal title="Registrar Devolução" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-1 gap-3">
            <Input label="Retirada Pendente" value={form.withdrawalId} onChange={v => setForm(f => ({ ...f, withdrawalId: v }))}
              options={pending.map(w => {
                const e = employees.find(x => x.id === w.employeeId);
                const p = products.find(x => x.id === w.productId);
                return { value: w.id, label: `${e?.name} — ${p?.name} (${fmtDate(w.date)})` };
              })} required />
            <Input label="Estado do Item" value={form.state} onChange={v => setForm(f => ({ ...f, state: v as Return["state"] }))}
              options={[
                { value: "bom", label: "Devolvido em Bom Estado" },
                { value: "danificado", label: "Devolvido Danificado" },
                { value: "perdido", label: "Perdido" },
                { value: "nao-devolvido", label: "Não Devolvido" },
              ]} />
            <div>
              <label className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide">Observação</label>
              <textarea value={form.observation} onChange={e => setForm(f => ({ ...f, observation: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded border border-[#1a3a5c]/15 bg-[#f0f4f9] text-sm focus:outline-none resize-none" rows={2} />
            </div>
            {form.state === "danificado" && (
              <div className="bg-orange-50 border border-orange-200 rounded p-3 text-xs text-orange-800">
                📷 Item danificado. Em um sistema completo, seria possível anexar foto aqui. Registro salvo com estado "Danificado".
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-5 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14} /> Confirmar Devolução</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Kits View ────────────────────────────────────────────────────────────────

function KitsView({ kits, setKits, products }: { kits: Kit[]; setKits: (fn: (k: Kit[]) => Kit[]) => void; products: Product[] }) {
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Kit | null>(null);
  const [form, setForm] = useState({ name: "", role: "", items: [] as { productId: string; quantity: number }[], status: "completo" as Kit["status"] });
  const [newItem, setNewItem] = useState({ productId: "", quantity: 1 });

  function addItem() {
    if (!newItem.productId) return;
    setForm(f => ({ ...f, items: [...f.items, { ...newItem }] }));
    setNewItem({ productId: "", quantity: 1 });
  }

  function save() {
    if (!form.name) return;
    setKits(prev => [...prev, { ...form, id: genId() }]);
    setShowModal(false);
    setForm({ name: "", role: "", items: [], status: "completo" });
  }

  const statusColors = { completo: "green", incompleto: "yellow", danificado: "orange", pendente: "red" } as const;
  const statusLabels = { completo: "Completo", incompleto: "Incompleto", danificado: "Com Item Danificado", pendente: "Pendente de Devolução" };

  return (
    <div>
      <SectionHeader title="Kits de Ferramentas" subtitle="Gerencie kits por função com checklist de entrega e devolução"
        actions={<Btn onClick={() => setShowModal(true)}><Plus size={14} /> Novo Kit</Btn>} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kits.map(kit => (
          <div key={kit.id} className="bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="font-bold text-[#1a3a5c] font-['Barlow_Condensed'] text-lg">{kit.name}</div>
                <div className="text-xs text-[#5a7090]">{kit.role}</div>
              </div>
              <Badge color={statusColors[kit.status]}>{statusLabels[kit.status]}</Badge>
            </div>
            <div className="space-y-1 mb-3">
              {kit.items.map((item, i) => {
                const p = products.find(x => x.id === item.productId);
                return (
                  <div key={i} className="flex items-center justify-between text-xs bg-[#eef2f7] rounded px-3 py-1.5">
                    <span>{p?.name || "Produto"}</span>
                    <span className="font-semibold">{item.quantity} {p?.unit}</span>
                  </div>
                );
              })}
            </div>
            <Btn variant="secondary" size="sm" onClick={() => setSelected(kit)} className="w-full justify-center">Ver Checklist</Btn>
          </div>
        ))}
      </div>

      {selected && (
        <Modal title={`Checklist — ${selected.name}`} onClose={() => setSelected(null)}>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#1a3a5c] text-white text-xs">
                {["Item", "Qtd", "Entregue", "Devolvido", "Estado"].map(h => <th key={h} className="px-3 py-2 text-left">{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {selected.items.map((item, i) => {
                const p = products.find(x => x.id === item.productId);
                return (
                  <tr key={i} className="border-t border-[#eef2f7]">
                    <td className="px-3 py-2">{p?.name}</td>
                    <td className="px-3 py-2">{item.quantity}</td>
                    <td className="px-3 py-2"><Check size={14} className="text-green-600" /></td>
                    <td className="px-3 py-2"><Check size={14} className="text-green-600" /></td>
                    <td className="px-3 py-2"><Badge color="green">Bom</Badge></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end">
            <Btn variant="secondary" onClick={() => setSelected(null)}>Fechar</Btn>
          </div>
        </Modal>
      )}

      {showModal && (
        <Modal title="Novo Kit" onClose={() => setShowModal(false)}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Input label="Nome do Kit" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} required />
            <Input label="Função / Cargo" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />
            <Input label="Status Inicial" value={form.status} onChange={v => setForm(f => ({ ...f, status: v as Kit["status"] }))}
              options={[{ value: "completo", label: "Completo" }, { value: "incompleto", label: "Incompleto" }, { value: "danificado", label: "Com Item Danificado" }, { value: "pendente", label: "Pendente" }]} className="col-span-2" />
          </div>
          <div className="mb-3">
            <div className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-2">Itens do Kit</div>
            <div className="flex gap-2 mb-2">
              <select value={newItem.productId} onChange={e => setNewItem(i => ({ ...i, productId: e.target.value }))} className="flex-1 px-3 py-2 rounded border border-[#1a3a5c]/15 bg-[#f0f4f9] text-sm">
                <option value="">Selecione produto...</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <input type="number" value={newItem.quantity} onChange={e => setNewItem(i => ({ ...i, quantity: parseInt(e.target.value) || 1 }))} className="w-16 px-2 py-2 rounded border border-[#1a3a5c]/15 bg-[#f0f4f9] text-sm" />
              <Btn size="sm" onClick={addItem}><Plus size={13} /></Btn>
            </div>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {form.items.map((item, i) => {
                const p = products.find(x => x.id === item.productId);
                return (
                  <div key={i} className="flex items-center justify-between bg-[#eef2f7] rounded px-3 py-1.5 text-xs">
                    <span>{p?.name}</span>
                    <div className="flex items-center gap-2">
                      <span>{item.quantity} {p?.unit}</span>
                      <button onClick={() => setForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} className="text-red-500"><X size={12} /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Btn variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Btn>
            <Btn onClick={save}><Check size={14} /> Criar Kit</Btn>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ─── Phases View ──────────────────────────────────────────────────────────────

function PhasesView({ products }: { products: Product[] }) {
  const [selected, setSelected] = useState(PHASES[0]);
  const info = PHASE_MATERIALS[selected];

  return (
    <div>
      <SectionHeader title="Fases da Obra" subtitle="Materiais recomendados e controle por fase da construção" />
      <div className="flex flex-wrap gap-2 mb-6">
        {PHASES.map(p => (
          <button key={p} onClick={() => setSelected(p)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${selected === p ? "bg-[#f97316] text-white" : "bg-white text-[#1a3a5c] border border-[#1a3a5c]/20 hover:bg-[#eef2f7]"}`}>
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#1a3a5c]/08">
          <h3 className="font-bold text-[#1a3a5c] font-['Barlow_Condensed'] text-lg mb-1">{selected}</h3>
          <p className="text-xs text-[#5a7090] mb-4 bg-yellow-50 border border-yellow-200 rounded px-3 py-2">{info.notes}</p>
          <div className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-2">Materiais Sugeridos</div>
          <div className="space-y-1.5">
            {info.materials.map(m => (
              <div key={m} className="flex items-center gap-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[#f97316] flex-shrink-0" />
                {m}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-[#1a3a5c]/08">
          <div className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-3">Produtos Cadastrados para esta Fase</div>
          <div className="space-y-2">
            {products.filter(p => p.phase === selected || p.phase === "Todas").map(p => {
              const { color, label } = stockLabel(p);
              return (
                <div key={p.id} className="flex items-center justify-between bg-[#eef2f7] rounded px-3 py-2 text-sm">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-xs text-[#5a7090]">{p.sku} • {p.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#1a3a5c]">{p.stock} {p.unit}</div>
                    <Badge color={color}>{label}</Badge>
                  </div>
                </div>
              );
            })}
            {products.filter(p => p.phase === selected || p.phase === "Todas").length === 0 && (
              <p className="text-sm text-[#5a7090] text-center py-4">Nenhum produto cadastrado para esta fase.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Alerts View ──────────────────────────────────────────────────────────────

function AlertsView({ products, withdrawals, employees }: { products: Product[]; withdrawals: Withdrawal[]; employees: Employee[] }) {
  const critical = products.filter(p => stockStatus(p) === "red");
  const attention = products.filter(p => stockStatus(p) === "yellow");
  const overdue = withdrawals.filter(w => {
    const days = Math.floor((Date.now() - new Date(w.date).getTime()) / 86400000);
    return w.returnStatus === "pendente" && days > 3;
  });
  const today = new Date().toDateString();
  const repeated = withdrawals.filter(w => {
    const todayW = withdrawals.filter(x => x.employeeId === w.employeeId && x.productId === w.productId && new Date(x.date).toDateString() === today);
    return todayW.length > 1;
  });

  function AlertSection({ title, color, items, renderItem }: { title: string; color: string; items: unknown[]; renderItem: (item: unknown, i: number) => React.ReactNode }) {
    return (
      <div className="bg-white rounded-xl p-5 shadow-sm border border-[#1a3a5c]/08 mb-4">
        <h3 className={`font-semibold text-sm uppercase tracking-wide mb-3 flex items-center gap-2 ${color}`}>
          <AlertTriangle size={14} /> {title} ({items.length})
        </h3>
        {items.length === 0 ? (
          <div className="text-sm text-[#5a7090] py-2 flex items-center gap-2"><Check size={14} className="text-green-600" /> Nenhum alerta nesta categoria.</div>
        ) : (
          <div className="space-y-2">{items.map((item, i) => renderItem(item, i))}</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <SectionHeader title="Estoque de Segurança & Alertas" subtitle="Monitoramento automático de estoque e pendências críticas" />
      <AlertSection title="Estoque Crítico" color="text-red-600" items={critical}
        renderItem={(item) => {
          const p = item as Product;
          return (
            <div key={p.id} className="flex items-center justify-between bg-red-50 border border-red-200 rounded px-4 py-3">
              <div>
                <div className="font-semibold text-red-800">{p.name} <span className="font-mono text-xs">({p.sku})</span></div>
                <div className="text-xs text-red-600">Estoque: {p.stock} {p.unit} | Mínimo: {p.minStock} | Local: {p.location}</div>
                <div className="text-xs text-red-500 mt-1 font-semibold">⚠ Produto abaixo do estoque mínimo. Recomenda-se nova compra.</div>
              </div>
              <Badge color="red">Crítico</Badge>
            </div>
          );
        }} />
      <AlertSection title="Estoque em Atenção" color="text-yellow-600" items={attention}
        renderItem={(item) => {
          const p = item as Product;
          return (
            <div key={p.id} className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded px-4 py-3">
              <div>
                <div className="font-semibold text-yellow-800">{p.name}</div>
                <div className="text-xs text-yellow-700">Estoque: {p.stock} {p.unit} | Segurança: {p.safetyStock}</div>
              </div>
              <Badge color="yellow">Atenção</Badge>
            </div>
          );
        }} />
      <AlertSection title="Devoluções Atrasadas (+3 dias)" color="text-orange-600" items={overdue}
        renderItem={(item) => {
          const w = item as Withdrawal;
          const e = employees.find(x => x.id === w.employeeId);
          const p = products.find(x => x.id === w.productId);
          const days = Math.floor((Date.now() - new Date(w.date).getTime()) / 86400000);
          return (
            <div key={w.id} className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded px-4 py-3">
              <div>
                <div className="font-semibold text-orange-800">{e?.name} — {p?.name}</div>
                <div className="text-xs text-orange-700">Retirado em {fmtDate(w.date)} • {days} dia(s) em aberto</div>
              </div>
              <Badge color="orange">{days}d</Badge>
            </div>
          );
        }} />
    </div>
  );
}

// ─── Reports View ─────────────────────────────────────────────────────────────

function ReportsView({ withdrawals, products, employees, constructions }: { withdrawals: Withdrawal[]; products: Product[]; employees: Employee[]; constructions: Construction[] }) {
  const [tab, setTab] = useState<"employee" | "product" | "construction" | "losses">("employee");

  const byEmployee = employees.map(e => ({
    name: e.name, count: withdrawals.filter(w => w.employeeId === e.id).length,
    qty: withdrawals.filter(w => w.employeeId === e.id).reduce((s, w) => s + w.quantity, 0),
    losses: withdrawals.filter(w => w.employeeId === e.id && w.returnStatus === "perdido").length,
  })).sort((a, b) => b.qty - a.qty);

  const byProduct = products.map(p => ({
    name: p.name, sku: p.sku,
    qty: withdrawals.filter(w => w.productId === p.id).reduce((s, w) => s + w.quantity, 0),
    losses: withdrawals.filter(w => w.productId === p.id && w.returnStatus === "perdido").reduce((s, w) => s + w.quantity, 0),
    lossValue: withdrawals.filter(w => w.productId === p.id && w.returnStatus === "perdido").reduce((s, w) => s + w.quantity * p.unitPrice, 0),
  })).sort((a, b) => b.qty - a.qty);

  const byConstruction = constructions.map(c => ({
    name: c.name,
    qty: withdrawals.filter(w => w.constructionId === c.id).reduce((s, w) => s + w.quantity, 0),
    count: withdrawals.filter(w => w.constructionId === c.id).length,
  })).sort((a, b) => b.qty - a.qty);

  const totalLossValue = withdrawals.filter(w => w.returnStatus === "perdido").reduce((sum, w) => {
    const p = products.find(x => x.id === w.productId);
    return sum + (p ? p.unitPrice * w.quantity : 0);
  }, 0);

  return (
    <div>
      <SectionHeader title="Relatórios" subtitle="Análises consolidadas de movimentações, perdas e consumo"
        actions={<Btn variant="secondary" onClick={() => window.print()}><Printer size={14} /> Imprimir</Btn>} />

      <div className="flex gap-2 mb-6 flex-wrap">
        {([["employee", "Por Funcionário"], ["product", "Por Produto"], ["construction", "Por Obra"], ["losses", "Perdas Financeiras"]] as const).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)}
            className={`px-4 py-2 rounded text-sm font-semibold transition-colors ${tab === id ? "bg-[#1a3a5c] text-white" : "bg-white text-[#1a3a5c] border border-[#1a3a5c]/20"}`}>
            {label}
          </button>
        ))}
      </div>

      {tab === "employee" && (
        <Table headers={["Funcionário", "Retiradas", "Itens Totais", "Perdas", "Índice de Perda"]}>
          {byEmployee.map(e => (
            <Tr key={e.name}>
              <Td className="font-medium">{e.name}</Td>
              <Td>{e.count}</Td>
              <Td className="font-bold">{e.qty}</Td>
              <Td>{e.losses > 0 ? <Badge color="red">{e.losses}</Badge> : <Badge color="green">0</Badge>}</Td>
              <Td>{e.qty > 0 ? `${((e.losses / e.qty) * 100).toFixed(1)}%` : "—"}</Td>
            </Tr>
          ))}
        </Table>
      )}

      {tab === "product" && (
        <Table headers={["SKU", "Produto", "Qtd Retirada", "Perdas (qtd)", "Valor de Perdas"]}>
          {byProduct.map(p => (
            <Tr key={p.sku}>
              <Td><span className="font-mono text-xs bg-[#eef2f7] px-2 py-0.5 rounded">{p.sku}</span></Td>
              <Td className="font-medium">{p.name}</Td>
              <Td className="font-bold">{p.qty}</Td>
              <Td>{p.losses > 0 ? <Badge color="red">{p.losses}</Badge> : "—"}</Td>
              <Td className={p.lossValue > 0 ? "text-red-600 font-semibold" : ""}>{p.lossValue > 0 ? fmtCurrency(p.lossValue) : "—"}</Td>
            </Tr>
          ))}
        </Table>
      )}

      {tab === "construction" && (
        <Table headers={["Obra", "Nº de Retiradas", "Itens Consumidos"]}>
          {byConstruction.map(c => (
            <Tr key={c.name}>
              <Td className="font-medium">{c.name}</Td>
              <Td>{c.count}</Td>
              <Td className="font-bold">{c.qty}</Td>
            </Tr>
          ))}
        </Table>
      )}

      {tab === "losses" && (
        <div>
          <div className="bg-red-50 border border-red-200 rounded-xl px-6 py-4 mb-4 flex items-center justify-between">
            <div>
              <div className="font-bold text-red-800 text-xl font-['Barlow_Condensed']">Total de Perdas Estimadas</div>
              <div className="text-red-600 text-sm">Baseado em itens marcados como "Perdido"</div>
            </div>
            <div className="text-3xl font-bold text-red-700 font-['Barlow_Condensed']">{fmtCurrency(totalLossValue)}</div>
          </div>
          <Table headers={["Produto", "Qtd Perdida", "Valor Unitário", "Prejuízo"]}>
            {byProduct.filter(p => p.losses > 0).map(p => {
              const prod = products.find(x => x.sku === p.sku);
              return (
                <Tr key={p.sku}>
                  <Td className="font-medium">{p.name}</Td>
                  <Td><Badge color="red">{p.losses}</Badge></Td>
                  <Td>{prod ? fmtCurrency(prod.unitPrice) : "—"}</Td>
                  <Td className="font-semibold text-red-600">{fmtCurrency(p.lossValue)}</Td>
                </Tr>
              );
            })}
            {byProduct.filter(p => p.losses > 0).length === 0 && (
              <Tr><Td className="text-center text-[#5a7090] py-8">Nenhuma perda registrada.</Td></Tr>
            )}
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── History View ─────────────────────────────────────────────────────────────

function HistoryView({ movements, products, employees, constructions }: { movements: Movement[]; products: Product[]; employees: Employee[]; constructions: Construction[] }) {
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");

  const filtered = movements
    .filter(m => !filter || m.type === filter)
    .filter(m => {
      if (!search) return true;
      const p = products.find(x => x.id === m.productId);
      const e = employees.find(x => x.id === m.employeeId);
      return p?.name.toLowerCase().includes(search.toLowerCase()) || e?.name.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const typeConfig = {
    entrada: { color: "green" as const, label: "Entrada", icon: ArrowDownToLine },
    saida: { color: "red" as const, label: "Saída", icon: ArrowUpFromLine },
    devolucao: { color: "blue" as const, label: "Devolução", icon: RotateCcw },
    perda: { color: "red" as const, label: "Perda", icon: PackageX },
    transferencia: { color: "orange" as const, label: "Transferência", icon: TrendingUp },
  };

  return (
    <div>
      <SectionHeader title="Histórico de Movimentações" subtitle="Registro completo de todas as entradas, saídas, devoluções e transferências" />

      <div className="flex gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#5a7090]" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar produto ou funcionário..." className="w-full pl-9 pr-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-3 py-2 rounded border border-[#1a3a5c]/15 bg-white text-sm focus:outline-none">
          <option value="">Todos os tipos</option>
          <option value="entrada">Entrada</option>
          <option value="saida">Saída</option>
          <option value="devolucao">Devolução</option>
          <option value="perda">Perda</option>
          <option value="transferencia">Transferência</option>
        </select>
      </div>

      <Table headers={["Data / Hora", "Tipo", "Produto", "Qtd", "Funcionário", "Obra / Local", "Status"]}>
        {filtered.map(m => {
          const p = products.find(x => x.id === m.productId);
          const e = employees.find(x => x.id === m.employeeId);
          const c = constructions.find(x => x.id === m.constructionId);
          const { color, label } = typeConfig[m.type];
          return (
            <Tr key={m.id}>
              <Td className="text-xs">{fmtDateTime(m.date)}</Td>
              <Td><Badge color={color}>{label}</Badge></Td>
              <Td className="font-medium">{p?.name || "—"}</Td>
              <Td className={`font-bold ${m.type === "entrada" || m.type === "devolucao" ? "text-green-600" : "text-red-600"}`}>
                {m.type === "entrada" || m.type === "devolucao" ? "+" : "-"}{m.quantity}
              </Td>
              <Td>{e?.name || "—"}</Td>
              <Td className="text-xs text-[#5a7090]">{c?.name || "—"}</Td>
              <Td><Badge color="gray">{m.status}</Badge></Td>
            </Tr>
          );
        })}
      </Table>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [view, setView] = useState<View>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [products, setProducts] = useLocalStorage<Product[]>("obrastock_products", INITIAL_PRODUCTS);
  const [employees, setEmployees] = useLocalStorage<Employee[]>("obrastock_employees", INITIAL_EMPLOYEES);
  const [constructions, setConstructions] = useLocalStorage<Construction[]>("obrastock_constructions", INITIAL_CONSTRUCTIONS);
  const [warehouses, setWarehouses] = useLocalStorage<Warehouse[]>("obrastock_warehouses", INITIAL_WAREHOUSES);
  const [entries, setEntries] = useLocalStorage<Entry[]>("obrastock_entries", INITIAL_ENTRIES);
  const [withdrawals, setWithdrawals] = useLocalStorage<Withdrawal[]>("obrastock_withdrawals", INITIAL_WITHDRAWALS);
  const [returns, setReturns] = useLocalStorage<Return[]>("obrastock_returns", INITIAL_RETURNS);
  const [kits, setKits] = useLocalStorage<Kit[]>("obrastock_kits", INITIAL_KITS);
  const [movements, setMovements] = useLocalStorage<Movement[]>("obrastock_movements", INITIAL_MOVEMENTS);

  function addMovement(m: Omit<Movement, "id">) {
    setMovements(prev => [{ ...m, id: genId() }, ...prev]);
  }

  function resetData() {
    if (!confirm("Restaurar todos os dados iniciais? Isso apagará registros inseridos.")) return;
    setProducts(() => INITIAL_PRODUCTS);
    setEmployees(() => INITIAL_EMPLOYEES);
    setConstructions(() => INITIAL_CONSTRUCTIONS);
    setWarehouses(() => INITIAL_WAREHOUSES);
    setEntries(() => INITIAL_ENTRIES);
    setWithdrawals(() => INITIAL_WITHDRAWALS);
    setReturns(() => INITIAL_RETURNS);
    setKits(() => INITIAL_KITS);
    setMovements(() => INITIAL_MOVEMENTS);
  }

  function exportData() {
    const data = { products, employees, constructions, warehouses, entries, withdrawals, returns, kits, movements };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "obrastock_backup.json"; a.click();
    URL.revokeObjectURL(url);
  }

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const navToView = (v: View) => { setView(v); setMobileOpen(false); };

  return (
    <div className="flex min-h-screen bg-[#eef2f7] font-['Inter',sans-serif]">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar — mobile */}
      <div className={`fixed inset-y-0 left-0 z-40 lg:hidden transition-transform ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar current={view} onNav={navToView} collapsed={false} onCollapse={() => setMobileOpen(false)} onLogout={() => setLoggedIn(false)} />
      </div>

      {/* Sidebar — desktop */}
      <div className="hidden lg:block flex-shrink-0">
        <Sidebar current={view} onNav={setView} collapsed={sidebarCollapsed} onCollapse={() => setSidebarCollapsed(c => !c)} onLogout={() => setLoggedIn(false)} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="bg-white border-b border-[#1a3a5c]/10 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-[#1a3a5c]" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <div>
              <div className="font-bold text-[#1a3a5c] text-sm">{NAV_ITEMS.find(i => i.id === view)?.label}</div>
              <div className="text-xs text-[#5a7090]">{new Date().toLocaleDateString("pt-BR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Btn variant="ghost" size="sm" onClick={resetData}><RefreshCw size={13} /> Restaurar</Btn>
            <Btn variant="secondary" size="sm" onClick={exportData}><Download size={13} /> Exportar</Btn>
            <div className="w-8 h-8 rounded-full bg-[#1a3a5c] flex items-center justify-center text-white text-xs font-bold ml-2">A</div>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "dashboard" && <Dashboard products={products} employees={employees} constructions={constructions} withdrawals={withdrawals} entries={entries} movements={movements} />}
          {view === "products" && <ProductsView products={products} setProducts={setProducts} />}
          {view === "employees" && <EmployeesView employees={employees} setEmployees={setEmployees} withdrawals={withdrawals} products={products} />}
          {view === "constructions" && <ConstructionsView constructions={constructions} setConstructions={setConstructions} warehouses={warehouses} setWarehouses={setWarehouses} />}
          {view === "entries" && <EntriesView entries={entries} setEntries={setEntries} products={products} setProducts={setProducts} warehouses={warehouses} employees={employees} addMovement={addMovement} />}
          {view === "withdrawals" && <WithdrawalsView withdrawals={withdrawals} setWithdrawals={setWithdrawals} products={products} setProducts={setProducts} employees={employees} constructions={constructions} addMovement={addMovement} />}
          {view === "returns" && <ReturnsView returns={returns} setReturns={setReturns} withdrawals={withdrawals} setWithdrawals={setWithdrawals} products={products} setProducts={setProducts} employees={employees} addMovement={addMovement} />}
          {view === "kits" && <KitsView kits={kits} setKits={setKits} products={products} />}
          {view === "phases" && <PhasesView products={products} />}
          {view === "alerts" && <AlertsView products={products} withdrawals={withdrawals} employees={employees} />}
          {view === "reports" && <ReportsView withdrawals={withdrawals} products={products} employees={employees} constructions={constructions} />}
          {view === "history" && <HistoryView movements={movements} products={products} employees={employees} constructions={constructions} />}
        </main>
      </div>
    </div>
  );
}
