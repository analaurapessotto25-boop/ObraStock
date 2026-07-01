import { useState, useEffect, useRef } from "react";
import {
  Package, Calculator, Trash2, Search, TrendingUp,
  HardHat, X, Plus, RotateCcw, ChevronRight, AlertTriangle,
  ShieldCheck, BarChart3, ShoppingCart,
} from "lucide-react";

interface ProductData {
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  dailyConsumption: number;
  replenishmentTime: number;
  safetyDays: number;
  purchaseLot: number;
  unitCost: number;
}

interface Product extends ProductData {
  id: string;
  minStock: number;
  safetyStock: number;
  maxStock: number;
  purchaseSuggestion: number;
  estimatedCost: number;
  status: "critical" | "warning" | "adequate" | "excess";
}

const SAMPLE_DATA: ProductData[] = [
  { name: "Disco de Corte 4½pol", category: "Ferramentas", unit: "un", currentStock: 15, dailyConsumption: 5, replenishmentTime: 3, safetyDays: 2, purchaseLot: 50, unitCost: 4.5 },
  { name: "Cimento CP-II", category: "Materiais Básicos", unit: "sc", currentStock: 80, dailyConsumption: 20, replenishmentTime: 2, safetyDays: 3, purchaseLot: 100, unitCost: 32.0 },
  { name: "Argamassa AC-II", category: "Materiais Básicos", unit: "sc", currentStock: 200, dailyConsumption: 15, replenishmentTime: 3, safetyDays: 2, purchaseLot: 80, unitCost: 18.5 },
  { name: "Luva de Proteção", category: "EPIs", unit: "par", currentStock: 8, dailyConsumption: 3, replenishmentTime: 5, safetyDays: 3, purchaseLot: 30, unitCost: 7.2 },
  { name: "Broca 8mm", category: "Ferramentas", unit: "un", currentStock: 12, dailyConsumption: 2, replenishmentTime: 4, safetyDays: 2, purchaseLot: 20, unitCost: 9.8 },
  { name: "Parafuso Sextavado M8", category: "Fixação", unit: "cx", currentStock: 5, dailyConsumption: 3, replenishmentTime: 2, safetyDays: 2, purchaseLot: 15, unitCost: 22.0 },
  { name: "Rejunte Branco 5kg", category: "Acabamento", unit: "cx", currentStock: 45, dailyConsumption: 4, replenishmentTime: 3, safetyDays: 2, purchaseLot: 24, unitCost: 14.9 },
  { name: "Tinta Acrílica Premium", category: "Acabamento", unit: "gl", currentStock: 3, dailyConsumption: 1, replenishmentTime: 5, safetyDays: 3, purchaseLot: 10, unitCost: 89.0 },
  { name: "Capacete de Segurança", category: "EPIs", unit: "un", currentStock: 22, dailyConsumption: 0.5, replenishmentTime: 7, safetyDays: 5, purchaseLot: 10, unitCost: 28.0 },
];

function calcProduct(data: ProductData): Omit<Product, "id" | keyof ProductData> {
  const minStock = data.dailyConsumption * data.replenishmentTime;
  const safetyStock = data.dailyConsumption * data.safetyDays;
  const maxStock = minStock + safetyStock + data.purchaseLot;
  const purchaseSuggestion = Math.max(0, maxStock - data.currentStock);
  const estimatedCost = purchaseSuggestion * data.unitCost;

  let status: Product["status"];
  if (data.currentStock < minStock) status = "critical";
  else if (data.currentStock < minStock + safetyStock) status = "warning";
  else if (data.currentStock <= maxStock) status = "adequate";
  else status = "excess";

  return { minStock, safetyStock, maxStock, purchaseSuggestion, estimatedCost, status };
}

const STATUS = {
  critical: {
    label: "Crítico",
    long: "Crítico — Comprar com urgência",
    pill: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
    bar: "bg-red-500",
  },
  warning: {
    label: "Atenção",
    long: "Atenção — Estoque próximo do limite",
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    bar: "bg-amber-400",
  },
  adequate: {
    label: "Adequado",
    long: "Adequado — Estoque controlado",
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
  },
  excess: {
    label: "Excesso",
    long: "Excesso — Produto acima do ideal",
    pill: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    bar: "bg-blue-500",
  },
};

const CATEGORIES = ["Ferramentas", "Materiais Básicos", "EPIs", "Fixação", "Acabamento", "Elétrico", "Hidráulico", "Outros"];
const UNITS = ["un", "sc", "kg", "gl", "cx", "m", "m²", "m³", "par", "rolo", "pc", "lt"];
const STORAGE_KEY = "calc-estoque-v1";

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const samples: Product[] = SAMPLE_DATA.map((d) => ({
    id: crypto.randomUUID(),
    ...d,
    ...calcProduct(d),
  }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  return samples;
}

const EMPTY_FORM = {
  name: "",
  category: "Ferramentas",
  unit: "un",
  currentStock: "",
  dailyConsumption: "",
  replenishmentTime: "",
  safetyDays: "",
  purchaseLot: "",
  unitCost: "",
};

type FormState = typeof EMPTY_FORM;

const fmt = (n: number) =>
  n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtR$ = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function StockBar({ current, min, safety, max }: { current: number; min: number; safety: number; max: number }) {
  const ceiling = Math.max(max * 1.2, current * 1.1, 1);
  const pct = (v: number) => Math.min(100, (v / ceiling) * 100);
  return (
    <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 bg-red-200 rounded-full" style={{ width: `${pct(min)}%` }} />
      <div className="absolute inset-y-0 bg-amber-200" style={{ left: `${pct(min)}%`, width: `${pct(min + safety) - pct(min)}%` }} />
      <div className="absolute inset-y-0 bg-emerald-200" style={{ left: `${pct(min + safety)}%`, width: `${pct(max) - pct(min + safety)}%` }} />
      <div
        className="absolute inset-y-0 w-1 bg-blue-700 rounded-full -translate-x-0.5 shadow"
        style={{ left: `${pct(current)}%` }}
      />
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [result, setResult] = useState<Product | null>(null);
  const [search, setSearch] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const data: ProductData = {
      name: form.name,
      category: form.category,
      unit: form.unit,
      currentStock: Number(form.currentStock),
      dailyConsumption: Number(form.dailyConsumption),
      replenishmentTime: Number(form.replenishmentTime),
      safetyDays: Number(form.safetyDays),
      purchaseLot: Number(form.purchaseLot),
      unitCost: Number(form.unitCost),
    };
    const product: Product = { id: crypto.randomUUID(), ...data, ...calcProduct(data) };
    setResult(product);
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const handleSave = () => {
    if (!result) return;
    setProducts((prev) => [result, ...prev]);
    setResult(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClear = () => {
    if (window.confirm("Limpar todos os produtos da tabela? Esta ação não pode ser desfeita.")) {
      setProducts([]);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const summaryStats = {
    critical: products.filter((p) => p.status === "critical").length,
    warning: products.filter((p) => p.status === "warning").length,
    totalValue: products.reduce((s, p) => s + p.estimatedCost, 0),
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all placeholder:text-muted-foreground/50";
  const selectClass =
    "w-full px-3 py-2.5 rounded-lg border border-border bg-input-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 transition-all";

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ── */}
      <header className="bg-gradient-to-r from-blue-950 via-blue-900 to-blue-800 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-11 h-11 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg">
              <HardHat className="w-6 h-6 text-blue-950" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
                Calculadora de Estoque Inteligente
              </h1>
              <p className="text-blue-300 text-xs mt-0.5">
                Calcule o estoque mínimo, máximo e de segurança dos seus produtos
              </p>
            </div>
            <div className="ml-auto hidden sm:flex items-center gap-5">
              {summaryStats.critical > 0 && (
                <div className="flex items-center gap-2 bg-red-500/20 border border-red-400/30 rounded-lg px-3 py-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-300" />
                  <span className="text-xs text-red-200 font-medium">{summaryStats.critical} crítico{summaryStats.critical > 1 ? "s" : ""}</span>
                </div>
              )}
              {summaryStats.warning > 0 && (
                <div className="flex items-center gap-2 bg-amber-500/20 border border-amber-400/30 rounded-lg px-3 py-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-300" />
                  <span className="text-xs text-amber-200 font-medium">{summaryStats.warning} em atenção</span>
                </div>
              )}
              <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5">
                <Package className="w-3.5 h-3.5 text-blue-300" />
                <span className="text-xs text-blue-100">{products.length} produto{products.length !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-7">

        {/* ── Summary strip ── */}
        {products.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Itens Críticos", value: products.filter(p => p.status === "critical").length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
              { label: "Em Atenção", value: products.filter(p => p.status === "warning").length, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
              { label: "Adequados", value: products.filter(p => p.status === "adequate").length, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
              { label: "Compras Estimadas", value: fmtR$(summaryStats.totalValue), icon: ShoppingCart, color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} border rounded-xl px-4 py-3 flex items-center gap-3`}>
                <s.icon className={`w-5 h-5 ${s.color} flex-shrink-0`} />
                <div>
                  <p className="text-xs text-muted-foreground leading-none mb-0.5">{s.label}</p>
                  <p className={`font-bold text-base ${s.color} leading-tight`}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Form ── */}
        <section className="bg-card rounded-2xl shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground text-base">Dados do Produto</h2>
              <p className="text-xs text-muted-foreground">Preencha os campos para calcular os níveis de estoque</p>
            </div>
          </div>

          <form onSubmit={handleCalculate} className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">

              <div className="lg:col-span-2">
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Nome do Produto *</label>
                <input name="name" value={form.name} onChange={handleInput} required
                  placeholder="Ex: Disco de corte 4½pol" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Categoria *</label>
                <select name="category" value={form.category} onChange={handleInput} className={selectClass}>
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Unidade de Medida *</label>
                <select name="unit" value={form.unit} onChange={handleInput} className={selectClass}>
                  {UNITS.map((u) => <option key={u}>{u}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Estoque Atual *</label>
                <input name="currentStock" type="number" min="0" step="any" value={form.currentStock}
                  onChange={handleInput} required placeholder="0" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Consumo Médio Diário *</label>
                <input name="dailyConsumption" type="number" min="0" step="any" value={form.dailyConsumption}
                  onChange={handleInput} required placeholder="0" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Tempo de Reposição (dias) *</label>
                <input name="replenishmentTime" type="number" min="1" step="1" value={form.replenishmentTime}
                  onChange={handleInput} required placeholder="0" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Dias Extras de Segurança *</label>
                <input name="safetyDays" type="number" min="0" step="1" value={form.safetyDays}
                  onChange={handleInput} required placeholder="0" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Lote de Compra *</label>
                <input name="purchaseLot" type="number" min="1" step="any" value={form.purchaseLot}
                  onChange={handleInput} required placeholder="0" className={inputClass} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Custo Unitário (R$) *</label>
                <input name="unitCost" type="number" min="0" step="any" value={form.unitCost}
                  onChange={handleInput} required placeholder="0,00" className={inputClass} />
              </div>
            </div>

            {/* Formula legend */}
            <div className="mt-5 p-4 bg-blue-950/5 border border-blue-900/10 rounded-xl">
              <p className="text-xs font-bold text-blue-800 uppercase tracking-widest mb-2.5">Fórmulas</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { color: "bg-red-500", label: "Est. Mínimo", formula: "Consumo × Tempo de Reposição" },
                  { color: "bg-amber-400", label: "Est. Segurança", formula: "Consumo × Dias Extras" },
                  { color: "bg-emerald-500", label: "Est. Máximo", formula: "Mínimo + Segurança + Lote" },
                ].map((f) => (
                  <div key={f.label} className="flex items-start gap-2">
                    <span className={`${f.color} rounded-sm w-2 h-2 mt-1 flex-shrink-0`} />
                    <span className="text-xs text-muted-foreground">
                      <strong className="text-foreground">{f.label}:</strong> {f.formula}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <button type="button" onClick={() => setForm(EMPTY_FORM)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Limpar campos
              </button>
              <button type="submit"
                className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-blue-900/20">
                <Calculator className="w-4 h-4" />
                Calcular Estoque
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </section>

        {/* ── Results ── */}
        {result && (
          <section ref={resultsRef} className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-amber-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-amber-900" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">{result.name}</h2>
                  <p className="text-xs text-muted-foreground">{result.category} · {result.unit}</p>
                </div>
              </div>
              <button onClick={() => setResult(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Status */}
              <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${STATUS[result.status].pill}`}>
                <span className={`w-2 h-2 rounded-full ${STATUS[result.status].dot}`} />
                {STATUS[result.status].long}
              </span>

              {/* Result cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { label: "Estoque Atual", value: fmt(result.currentStock), unit: result.unit, bg: "bg-slate-50 border-slate-200", val: "text-slate-700" },
                  { label: "Estoque Mínimo", value: fmt(result.minStock), unit: result.unit, bg: "bg-red-50 border-red-200", val: "text-red-700" },
                  { label: "Est. Segurança", value: fmt(result.safetyStock), unit: result.unit, bg: "bg-amber-50 border-amber-200", val: "text-amber-700" },
                  { label: "Estoque Máximo", value: fmt(result.maxStock), unit: result.unit, bg: "bg-emerald-50 border-emerald-200", val: "text-emerald-700" },
                  { label: "Sugestão Compra", value: fmt(result.purchaseSuggestion), unit: result.unit, bg: "bg-blue-50 border-blue-200", val: "text-blue-700" },
                  { label: "Valor Estimado", value: fmtR$(result.estimatedCost), unit: "", bg: "bg-purple-50 border-purple-200", val: "text-purple-700" },
                ].map((c) => (
                  <div key={c.label} className={`${c.bg} border rounded-xl p-3.5 text-center`}>
                    <p className="text-xs text-muted-foreground leading-tight mb-1.5">{c.label}</p>
                    <p className={`text-lg font-bold leading-tight ${c.val}`} style={{ fontFamily: "var(--font-mono)" }}>{c.value}</p>
                    {c.unit && <p className="text-xs text-muted-foreground mt-1">{c.unit}</p>}
                  </div>
                ))}
              </div>

              {/* Stock bar */}
              <div>
                <div className="flex items-center justify-between mb-1.5 text-xs text-muted-foreground">
                  <span>Visualização do Estoque</span>
                  <span className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-300 inline-block" />Mínimo</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-300 inline-block" />Segurança</span>
                    <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-300 inline-block" />Máximo</span>
                    <span className="flex items-center gap-1"><span className="w-1 h-3 rounded-sm bg-blue-700 inline-block" />Atual</span>
                  </span>
                </div>
                <StockBar current={result.currentStock} min={result.minStock} safety={result.safetyStock} max={result.maxStock} />
              </div>

              <div className="flex justify-end">
                <button onClick={handleSave}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-md shadow-emerald-900/20">
                  <Plus className="w-4 h-4" />
                  Adicionar à Tabela
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ── Products Table ── */}
        <section className="bg-card rounded-2xl shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-4 h-4 text-slate-600" />
              </div>
              <h2 className="font-semibold text-foreground">Produtos Calculados</h2>
              <span className="text-xs bg-blue-100 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar produto..."
                  className="pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 w-44 transition-all placeholder:text-muted-foreground/50" />
              </div>
              {products.length > 0 && (
                <button onClick={handleClear}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Limpar tudo
                </button>
              )}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-medium">
                {products.length === 0 ? "Nenhum produto cadastrado ainda." : "Nenhum produto encontrado."}
              </p>
              <p className="text-xs mt-1 opacity-60">
                {products.length === 0 ? "Preencha o formulário acima e clique em Calcular Estoque." : "Tente buscar por outro termo."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/30 text-muted-foreground text-xs uppercase tracking-wide border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold">Produto</th>
                    <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Categoria</th>
                    <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Un.</th>
                    <th className="px-4 py-3 text-right font-semibold">Atual</th>
                    <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell text-red-600">Mínimo</th>
                    <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell text-amber-600">Segurança</th>
                    <th className="px-4 py-3 text-right font-semibold hidden lg:table-cell text-emerald-600">Máximo</th>
                    <th className="px-4 py-3 text-right font-semibold hidden xl:table-cell text-blue-600">Sugestão</th>
                    <th className="px-4 py-3 text-right font-semibold hidden xl:table-cell">Valor Est.</th>
                    <th className="px-4 py-3 text-center font-semibold">Status</th>
                    <th className="px-4 py-3 w-10" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/20 transition-colors group">
                      <td className="px-4 py-3 font-medium text-foreground max-w-[180px]">
                        <span className="truncate block">{p.name}</span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground hidden md:table-cell text-xs">{p.category}</td>
                      <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell text-xs">{p.unit}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmt(p.currentStock)}</td>
                      <td className="px-4 py-3 text-right text-red-600 hidden lg:table-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmt(p.minStock)}</td>
                      <td className="px-4 py-3 text-right text-amber-600 hidden lg:table-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmt(p.safetyStock)}</td>
                      <td className="px-4 py-3 text-right text-emerald-600 hidden lg:table-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmt(p.maxStock)}</td>
                      <td className="px-4 py-3 text-right text-blue-600 hidden xl:table-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmt(p.purchaseSuggestion)}</td>
                      <td className="px-4 py-3 text-right hidden xl:table-cell" style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{fmtR$(p.estimatedCost)}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${STATUS[p.status].pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS[p.status].dot}`} />
                          {STATUS[p.status].label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(p.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-center text-xs text-muted-foreground/60 pb-2">
          Calculadora de Estoque Inteligente · Dados salvos automaticamente no navegador
        </footer>
      </main>
    </div>
  );
}
