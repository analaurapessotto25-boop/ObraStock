import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  AlertTriangle,
  BarChart3,
  Calculator,
  ChevronRight,
  Package,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  ShoppingCart,
  Trash2,
  TrendingUp,
  X,
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

interface CalculatedProduct extends ProductData {
  id: string;
  minStock: number;
  safetyStock: number;
  maxStock: number;
  purchaseSuggestion: number;
  estimatedCost: number;
  status: "critical" | "warning" | "adequate" | "excess";
}

const SAMPLE_DATA: ProductData[] = [
  { name: "Disco de Corte 4 1/2 pol", category: "Ferramentas", unit: "un", currentStock: 15, dailyConsumption: 5, replenishmentTime: 3, safetyDays: 2, purchaseLot: 50, unitCost: 4.5 },
  { name: "Cimento CP-II", category: "Materiais Básicos", unit: "sc", currentStock: 80, dailyConsumption: 20, replenishmentTime: 2, safetyDays: 3, purchaseLot: 100, unitCost: 32 },
  { name: "Argamassa AC-II", category: "Materiais Básicos", unit: "sc", currentStock: 200, dailyConsumption: 15, replenishmentTime: 3, safetyDays: 2, purchaseLot: 80, unitCost: 18.5 },
  { name: "Luva de Proteção", category: "EPIs", unit: "par", currentStock: 8, dailyConsumption: 3, replenishmentTime: 5, safetyDays: 3, purchaseLot: 30, unitCost: 7.2 },
  { name: "Broca 8mm", category: "Ferramentas", unit: "un", currentStock: 12, dailyConsumption: 2, replenishmentTime: 4, safetyDays: 2, purchaseLot: 20, unitCost: 9.8 },
  { name: "Parafuso Sextavado M8", category: "Fixação", unit: "cx", currentStock: 5, dailyConsumption: 3, replenishmentTime: 2, safetyDays: 2, purchaseLot: 15, unitCost: 22 },
];

const STATUS = {
  critical: {
    label: "Crítico",
    long: "Crítico - Comprar com urgência",
    pill: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  warning: {
    label: "Atenção",
    long: "Atenção - Estoque próximo do limite",
    pill: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
  },
  adequate: {
    label: "Adequado",
    long: "Adequado - Estoque controlado",
    pill: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
  },
  excess: {
    label: "Excesso",
    long: "Excesso - Produto acima do ideal",
    pill: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
  },
};

const CATEGORIES = ["Ferramentas", "Materiais Básicos", "EPIs", "Fixação", "Acabamento", "Elétrico", "Hidráulico", "Outros"];
const UNITS = ["un", "sc", "kg", "gl", "cx", "m", "m²", "m³", "par", "rolo", "pc", "lt"];
const STORAGE_KEY = "obrastock_stock_calculator";

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

function createId() {
  if ("randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2, 10);
}

function calcProduct(data: ProductData): Omit<CalculatedProduct, "id" | keyof ProductData> {
  const minStock = data.dailyConsumption * data.replenishmentTime;
  const safetyStock = data.dailyConsumption * data.safetyDays;
  const maxStock = minStock + safetyStock + data.purchaseLot;
  const purchaseSuggestion = Math.max(0, maxStock - data.currentStock);
  const estimatedCost = purchaseSuggestion * data.unitCost;

  let status: CalculatedProduct["status"];
  if (data.currentStock < minStock) status = "critical";
  else if (data.currentStock < minStock + safetyStock) status = "warning";
  else if (data.currentStock <= maxStock) status = "adequate";
  else status = "excess";

  return { minStock, safetyStock, maxStock, purchaseSuggestion, estimatedCost, status };
}

function loadProducts(): CalculatedProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const samples = SAMPLE_DATA.map((data) => ({ id: createId(), ...data, ...calcProduct(data) }));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
  return samples;
}

const fmt = (n: number) => n.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
const fmtCurrency = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

function StockBar({ current, min, safety, max }: { current: number; min: number; safety: number; max: number }) {
  const ceiling = Math.max(max * 1.2, current * 1.1, 1);
  const pct = (value: number) => Math.min(100, (value / ceiling) * 100);

  return (
    <div className="relative h-2.5 bg-[#eef2f7] rounded-full overflow-hidden">
      <div className="absolute inset-y-0 left-0 bg-red-200 rounded-full" style={{ width: `${pct(min)}%` }} />
      <div className="absolute inset-y-0 bg-amber-200" style={{ left: `${pct(min)}%`, width: `${pct(min + safety) - pct(min)}%` }} />
      <div className="absolute inset-y-0 bg-emerald-200" style={{ left: `${pct(min + safety)}%`, width: `${pct(max) - pct(min + safety)}%` }} />
      <div className="absolute inset-y-0 w-1 bg-[#1a3a5c] rounded-full -translate-x-0.5 shadow" style={{ left: `${pct(current)}%` }} />
    </div>
  );
}

export default function StockCalculatorView() {
  const [products, setProducts] = useState<CalculatedProduct[]>(loadProducts);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [result, setResult] = useState<CalculatedProduct | null>(null);
  const [search, setSearch] = useState("");
  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const handleInput = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleCalculate = (event: FormEvent) => {
    event.preventDefault();
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
    const product = { id: createId(), ...data, ...calcProduct(data) };
    setResult(product);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };

  const filtered = products.filter((product) => {
    const term = search.toLowerCase();
    return product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term);
  });

  const summaryStats = {
    critical: products.filter((product) => product.status === "critical").length,
    warning: products.filter((product) => product.status === "warning").length,
    adequate: products.filter((product) => product.status === "adequate").length,
    totalValue: products.reduce((sum, product) => sum + product.estimatedCost, 0),
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-[#1a3a5c]/15 bg-[#f0f4f9] text-[#0d1b2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 focus:border-[#1a3a5c]/40 transition-all placeholder:text-[#5a7090]/50";
  const selectClass =
    "w-full px-3 py-2.5 rounded-lg border border-[#1a3a5c]/15 bg-[#f0f4f9] text-[#0d1b2a] text-sm focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 focus:border-[#1a3a5c]/40 transition-all";

  return (
    <div className="space-y-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a3a5c] font-['Barlow_Condensed'] tracking-wide">Calculadora de Estoque</h2>
          <p className="text-sm text-[#5a7090] mt-0.5">Calcule estoque mínimo, máximo, segurança e sugestão de compra</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#1a3a5c]/10 bg-white px-3 py-2 text-xs text-[#5a7090]">
          <Calculator size={14} className="text-[#f97316]" />
          Módulo de Gestão
        </div>
      </div>

      {products.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "Itens Críticos", value: summaryStats.critical, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50 border-red-200" },
            { label: "Em Atenção", value: summaryStats.warning, icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
            { label: "Adequados", value: summaryStats.adequate, icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
            { label: "Compras Estimadas", value: fmtCurrency(summaryStats.totalValue), icon: ShoppingCart, color: "text-[#1a3a5c]", bg: "bg-white border-[#1a3a5c]/10" },
          ].map((stat) => (
            <div key={stat.label} className={`${stat.bg} border rounded-xl px-4 py-3 flex items-center gap-3 shadow-sm`}>
              <stat.icon className={`w-5 h-5 ${stat.color} flex-shrink-0`} />
              <div className="min-w-0">
                <p className="text-xs text-[#5a7090] leading-none mb-1">{stat.label}</p>
                <p className={`font-bold text-base ${stat.color} leading-tight truncate`}>{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-[#1a3a5c]/10">
        <div className="px-6 py-4 border-b border-[#1a3a5c]/10 flex items-center gap-3">
          <div className="w-8 h-8 bg-[#1a3a5c] rounded-lg flex items-center justify-center">
            <Calculator className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-[#0d1b2a] text-base">Dados do Produto</h3>
            <p className="text-xs text-[#5a7090]">Preencha os campos para calcular os níveis ideais</p>
          </div>
        </div>

        <form onSubmit={handleCalculate} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Nome do Produto *</label>
              <input name="name" value={form.name} onChange={handleInput} required placeholder="Ex: Disco de corte 4 1/2 pol" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Categoria *</label>
              <select name="category" value={form.category} onChange={handleInput} className={selectClass}>
                {CATEGORIES.map((category) => <option key={category}>{category}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Unidade de Medida *</label>
              <select name="unit" value={form.unit} onChange={handleInput} className={selectClass}>
                {UNITS.map((unit) => <option key={unit}>{unit}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Estoque Atual *</label>
              <input name="currentStock" type="number" min="0" step="any" value={form.currentStock} onChange={handleInput} required placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Consumo Médio Diário *</label>
              <input name="dailyConsumption" type="number" min="0" step="any" value={form.dailyConsumption} onChange={handleInput} required placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Tempo de Reposição (dias) *</label>
              <input name="replenishmentTime" type="number" min="1" step="1" value={form.replenishmentTime} onChange={handleInput} required placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Dias Extras de Segurança *</label>
              <input name="safetyDays" type="number" min="0" step="1" value={form.safetyDays} onChange={handleInput} required placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Lote de Compra *</label>
              <input name="purchaseLot" type="number" min="1" step="any" value={form.purchaseLot} onChange={handleInput} required placeholder="0" className={inputClass} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1.5">Custo Unitário (R$) *</label>
              <input name="unitCost" type="number" min="0" step="any" value={form.unitCost} onChange={handleInput} required placeholder="0,00" className={inputClass} />
            </div>
          </div>

          <div className="mt-5 p-4 bg-[#1a3a5c]/5 border border-[#1a3a5c]/10 rounded-xl">
            <p className="text-xs font-bold text-[#1a3a5c] uppercase tracking-widest mb-2.5">Fórmulas</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { color: "bg-red-500", label: "Est. Mínimo", formula: "Consumo x Tempo de Reposição" },
                { color: "bg-amber-400", label: "Est. Segurança", formula: "Consumo x Dias Extras" },
                { color: "bg-emerald-500", label: "Est. Máximo", formula: "Mínimo + Segurança + Lote" },
              ].map((formula) => (
                <div key={formula.label} className="flex items-start gap-2">
                  <span className={`${formula.color} rounded-sm w-2 h-2 mt-1 flex-shrink-0`} />
                  <span className="text-xs text-[#5a7090]">
                    <strong className="text-[#0d1b2a]">{formula.label}:</strong> {formula.formula}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <button type="button" onClick={() => setForm(EMPTY_FORM)} className="text-sm text-[#5a7090] hover:text-[#0d1b2a] transition-colors">
              Limpar campos
            </button>
            <button type="submit" className="inline-flex items-center gap-2 bg-[#1a3a5c] hover:bg-[#122a45] text-white px-6 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
              <Calculator className="w-4 h-4" />
              Calcular Estoque
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>

      {result && (
        <section ref={resultsRef} className="bg-white rounded-xl shadow-sm border border-[#1a3a5c]/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a3a5c]/10 flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#f97316] rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0d1b2a]">{result.name}</h3>
                <p className="text-xs text-[#5a7090]">{result.category} - {result.unit}</p>
              </div>
            </div>
            <button onClick={() => setResult(null)} className="p-1.5 rounded-lg text-[#5a7090] hover:text-[#0d1b2a] hover:bg-[#eef2f7] transition-colors" title="Fechar resultado">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${STATUS[result.status].pill}`}>
              <span className={`w-2 h-2 rounded-full ${STATUS[result.status].dot}`} />
              {STATUS[result.status].long}
            </span>

            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
              {[
                { label: "Estoque Atual", value: fmt(result.currentStock), unit: result.unit, bg: "bg-slate-50 border-slate-200", val: "text-slate-700" },
                { label: "Estoque Mínimo", value: fmt(result.minStock), unit: result.unit, bg: "bg-red-50 border-red-200", val: "text-red-700" },
                { label: "Est. Segurança", value: fmt(result.safetyStock), unit: result.unit, bg: "bg-amber-50 border-amber-200", val: "text-amber-700" },
                { label: "Estoque Máximo", value: fmt(result.maxStock), unit: result.unit, bg: "bg-emerald-50 border-emerald-200", val: "text-emerald-700" },
                { label: "Sugestão Compra", value: fmt(result.purchaseSuggestion), unit: result.unit, bg: "bg-blue-50 border-blue-200", val: "text-blue-700" },
                { label: "Valor Estimado", value: fmtCurrency(result.estimatedCost), unit: "", bg: "bg-orange-50 border-orange-200", val: "text-[#f97316]" },
              ].map((card) => (
                <div key={card.label} className={`${card.bg} border rounded-xl p-3.5 text-center`}>
                  <p className="text-xs text-[#5a7090] leading-tight mb-1.5">{card.label}</p>
                  <p className={`text-lg font-bold leading-tight ${card.val}`}>{card.value}</p>
                  {card.unit && <p className="text-xs text-[#5a7090] mt-1">{card.unit}</p>}
                </div>
              ))}
            </div>

            <div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-1.5 text-xs text-[#5a7090]">
                <span>Visualização do Estoque</span>
                <span className="flex items-center gap-3 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-red-300 inline-block" />Mínimo</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-amber-300 inline-block" />Segurança</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-emerald-300 inline-block" />Máximo</span>
                  <span className="flex items-center gap-1"><span className="w-1 h-3 rounded-sm bg-[#1a3a5c] inline-block" />Atual</span>
                </span>
              </div>
              <StockBar current={result.currentStock} min={result.minStock} safety={result.safetyStock} max={result.maxStock} />
            </div>

            <div className="flex justify-end">
              <button onClick={() => { setProducts((current) => [result, ...current]); setResult(null); setForm(EMPTY_FORM); }} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors shadow-sm">
                <Plus className="w-4 h-4" />
                Adicionar à Tabela
              </button>
            </div>
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl shadow-sm border border-[#1a3a5c]/10">
        <div className="px-6 py-4 border-b border-[#1a3a5c]/10 flex flex-col md:flex-row md:items-center gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-8 h-8 bg-[#eef2f7] rounded-lg flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#1a3a5c]" />
            </div>
            <h3 className="font-semibold text-[#0d1b2a]">Produtos Calculados</h3>
            <span className="text-xs bg-[#1a3a5c]/10 text-[#1a3a5c] border border-[#1a3a5c]/10 px-2 py-0.5 rounded-full font-medium">{filtered.length}</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#5a7090] absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar produto..." className="pl-9 pr-3 py-2 text-sm rounded-lg border border-[#1a3a5c]/15 bg-[#f0f4f9] text-[#0d1b2a] focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 w-44 transition-all placeholder:text-[#5a7090]/50" />
            </div>
            {products.length > 0 && (
              <button onClick={() => { if (window.confirm("Limpar todos os produtos da tabela? Esta ação não pode ser desfeita.")) setProducts([]); }} className="inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors font-medium">
                <RotateCcw className="w-3.5 h-3.5" />
                Limpar tudo
              </button>
            )}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-16 text-center text-[#5a7090]">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">{products.length === 0 ? "Nenhum produto cadastrado ainda." : "Nenhum produto encontrado."}</p>
            <p className="text-xs mt-1 opacity-70">{products.length === 0 ? "Preencha o formulário acima e clique em Calcular Estoque." : "Tente buscar por outro termo."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#eef2f7] text-[#5a7090] text-xs uppercase tracking-wide border-b border-[#1a3a5c]/10">
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
              <tbody className="divide-y divide-[#1a3a5c]/10">
                {filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#eef2f7] transition-colors group">
                    <td className="px-4 py-3 font-medium text-[#0d1b2a] max-w-[180px]">
                      <span className="truncate block">{product.name}</span>
                    </td>
                    <td className="px-4 py-3 text-[#5a7090] hidden md:table-cell text-xs">{product.category}</td>
                    <td className="px-4 py-3 text-center text-[#5a7090] hidden sm:table-cell text-xs">{product.unit}</td>
                    <td className="px-4 py-3 text-right font-medium font-mono text-xs">{fmt(product.currentStock)}</td>
                    <td className="px-4 py-3 text-right text-red-600 hidden lg:table-cell font-mono text-xs">{fmt(product.minStock)}</td>
                    <td className="px-4 py-3 text-right text-amber-600 hidden lg:table-cell font-mono text-xs">{fmt(product.safetyStock)}</td>
                    <td className="px-4 py-3 text-right text-emerald-600 hidden lg:table-cell font-mono text-xs">{fmt(product.maxStock)}</td>
                    <td className="px-4 py-3 text-right text-blue-600 hidden xl:table-cell font-mono text-xs">{fmt(product.purchaseSuggestion)}</td>
                    <td className="px-4 py-3 text-right hidden xl:table-cell font-mono text-xs">{fmtCurrency(product.estimatedCost)}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${STATUS[product.status].pill}`}>
                        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${STATUS[product.status].dot}`} />
                        {STATUS[product.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setProducts((current) => current.filter((item) => item.id !== product.id))} className="p-1.5 rounded-lg text-[#5a7090] hover:text-red-600 hover:bg-red-50 transition-all opacity-100 lg:opacity-0 lg:group-hover:opacity-100" title="Excluir produto">
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
    </div>
  );
}
