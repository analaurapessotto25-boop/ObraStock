import { useState, useEffect, useMemo } from "react";
import {
  Package,
  Search,
  Copy,
  Trash2,
  Pencil,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  X,
  ChevronDown,
  BarChart3,
  Tag,
  Hash,
  Layers,
  Save,
  Plus,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────
interface Product {
  id: string;
  sku: string;
  category: string;
  categoryCode: string;
  name: string;
  type: string;
  measure: string;
  brand: string;
  sector: string;
  notes: string;
  createdAt: string;
}

// ── Constants ──────────────────────────────────────────────────────────────────
const CATEGORIES: { label: string; code: string }[] = [
  { label: "Materiais", code: "MAT" },
  { label: "Ferramentas", code: "FER" },
  { label: "EPI", code: "EPI" },
  { label: "Hidráulica", code: "HID" },
  { label: "Elétrica", code: "ELE" },
  { label: "Pintura", code: "PIN" },
  { label: "Acabamento", code: "ACA" },
  { label: "Máquinas", code: "MAQ" },
  { label: "Limpeza", code: "LIM" },
  { label: "Outros", code: "OUT" },
];

const SAMPLE_PRODUCTS: Omit<Product, "id">[] = [
  {
    sku: "MAT-CIM-CP2-50KG-VOT-001",
    category: "Materiais",
    categoryCode: "MAT",
    name: "Cimento",
    type: "CP2",
    measure: "50KG",
    brand: "Votoran",
    sector: "Obra A",
    notes: "",
    createdAt: "2024-01-15",
  },
  {
    sku: "FER-DIS-CORTE-110MM-BOS-002",
    category: "Ferramentas",
    categoryCode: "FER",
    name: "Disco de Corte",
    type: "Corte",
    measure: "110MM",
    brand: "Bosch",
    sector: "Almoxarifado",
    notes: "",
    createdAt: "2024-01-16",
  },
  {
    sku: "EPI-LUV-SEG-M-3M-003",
    category: "EPI",
    categoryCode: "EPI",
    name: "Luva de Segurança",
    type: "Seg",
    measure: "M",
    brand: "3M",
    sector: "Obra B",
    notes: "Nitrila",
    createdAt: "2024-01-17",
  },
  {
    sku: "HID-TUB-PVC-34-TIG-004",
    category: "Hidráulica",
    categoryCode: "HID",
    name: "Tubo PVC",
    type: "PVC",
    measure: "3/4",
    brand: "Tigre",
    sector: "Obra A",
    notes: "",
    createdAt: "2024-01-18",
  },
  {
    sku: "ELE-CAB-25MM-FLE-005",
    category: "Elétrica",
    categoryCode: "ELE",
    name: "Cabo Elétrico",
    type: "Flexível",
    measure: "2.5MM",
    brand: "Ficap",
    sector: "Almoxarifado",
    notes: "",
    createdAt: "2024-01-19",
  },
  {
    sku: "PIN-TIN-BRA-18L-COL-006",
    category: "Pintura",
    categoryCode: "PIN",
    name: "Tinta Branca",
    type: "Látex",
    measure: "18L",
    brand: "Coral",
    sector: "Obra C",
    notes: "",
    createdAt: "2024-01-20",
  },
  {
    sku: "MAT-PAR-SEX-M8-CIN-007",
    category: "Materiais",
    categoryCode: "MAT",
    name: "Parafuso Sextavado",
    type: "Sext",
    measure: "M8",
    brand: "Ciser",
    sector: "Almoxarifado",
    notes: "",
    createdAt: "2024-01-21",
  },
  {
    sku: "EPI-CAP-SEG-UN-3M-008",
    category: "EPI",
    categoryCode: "EPI",
    name: "Capacete de Segurança",
    type: "Aba Total",
    measure: "UN",
    brand: "3M",
    sector: "Obra B",
    notes: "Classe B",
    createdAt: "2024-01-22",
  },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
function slugify(text: string, maxLen = 3): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, maxLen);
}

function generateSKU(
  categoryCode: string,
  name: string,
  type: string,
  measure: string,
  brand: string,
  seq: number
): string {
  const parts = [
    categoryCode || "OUT",
    slugify(name) || "PRD",
    slugify(type) || "UN",
    slugify(measure, 5) || "UN",
    slugify(brand) || "GEN",
    String(seq).padStart(3, "0"),
  ];
  return parts.join("-");
}

function nextSeq(products: Product[]): number {
  if (products.length === 0) return 1;
  const nums = products
    .map((p) => parseInt(p.sku.split("-").pop() || "0", 10))
    .filter((n) => !isNaN(n));
  return nums.length ? Math.max(...nums) + 1 : products.length + 1;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

// ── Storage ────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "obrastock_skus";

function loadProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SAMPLE_PRODUCTS.map((p, i) => ({ ...p, id: String(i + 1) }));
}

function saveProducts(products: Product[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ── Sub-components ─────────────────────────────────────────────────────────────
function StatCard({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg p-4 flex items-start gap-3 border ${
        accent
          ? "bg-accent text-accent-foreground border-accent"
          : "bg-card border-border"
      }`}
    >
      <div
        className={`mt-0.5 ${
          accent ? "text-accent-foreground/80" : "text-primary"
        }`}
      >
        {icon}
      </div>
      <div>
        <p
          className={`text-xs font-medium uppercase tracking-wide ${
            accent ? "text-accent-foreground/70" : "text-muted-foreground"
          }`}
        >
          {label}
        </p>
        <p
          className={`text-xl font-bold mt-0.5 font-mono ${
            accent ? "text-accent-foreground" : "text-foreground"
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function Toast({
  msg,
  type,
  onClose,
}: {
  msg: string;
  type: "success" | "error" | "warn";
  onClose: () => void;
}) {
  const colors = {
    success: "bg-accent text-accent-foreground",
    error: "bg-destructive text-destructive-foreground",
    warn: "bg-amber-500 text-white",
  };
  const Icon = type === "success" ? CheckCircle : type === "warn" ? AlertTriangle : X;
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${colors[type]}`}
    >
      <Icon size={16} />
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState<Product[]>(loadProducts);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [form, setForm] = useState({
    category: "",
    categoryCode: "",
    name: "",
    type: "",
    measure: "",
    brand: "",
    sector: "",
    notes: "",
  });

  // UI state
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warn" } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  const previewSKU = useMemo(() => {
    if (!form.category) return "";
    return generateSKU(
      form.categoryCode,
      form.name,
      form.type,
      form.measure,
      form.brand,
      editingId
        ? parseInt(
            products.find((p) => p.id === editingId)?.sku.split("-").pop() || "0",
            10
          )
        : nextSeq(products)
    );
  }, [form, products, editingId]);

  function showToast(msg: string, type: "success" | "error" | "warn" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  function handleCatChange(label: string) {
    const cat = CATEGORIES.find((c) => c.label === label);
    setForm((f) => ({ ...f, category: label, categoryCode: cat?.code || "" }));
  }

  function handleSubmit() {
    if (!form.category || !form.name) {
      showToast("Preencha pelo menos Categoria e Nome do produto.", "warn");
      return;
    }

    const sku = editingId
      ? previewSKU
      : previewSKU;

    // Duplicate check
    const duplicate = products.find(
      (p) =>
        p.sku === sku && p.id !== editingId
    );
    if (duplicate) {
      showToast("SKU duplicado! Um produto com esse código já existe.", "warn");
      return;
    }

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId ? { ...p, ...form, sku } : p
        )
      );
      setEditingId(null);
      showToast("Produto atualizado com sucesso.");
    } else {
      const newProduct: Product = {
        id: Date.now().toString(),
        sku,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setProducts((prev) => [...prev, newProduct]);
      showToast("Produto cadastrado com sucesso.");
    }

    clearForm();
  }

  function clearForm() {
    setForm({ category: "", categoryCode: "", name: "", type: "", measure: "", brand: "", sector: "", notes: "" });
    setEditingId(null);
  }

  function startEdit(product: Product) {
    setForm({
      category: product.category,
      categoryCode: product.categoryCode,
      name: product.name,
      type: product.type,
      measure: product.measure,
      brand: product.brand,
      sector: product.sector,
      notes: product.notes,
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast("Produto removido.", "warn");
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => showToast("SKU copiado!"));
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "obrastock_produtos.json";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exportado com sucesso.");
  }

  function importJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) {
            setProducts(data);
            showToast(`${data.length} produtos importados.`);
          } else {
            showToast("Arquivo inválido.", "error");
          }
        } catch {
          showToast("Erro ao importar JSON.", "error");
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }

  function restoreSamples() {
    setProducts(SAMPLE_PRODUCTS.map((p, i) => ({ ...p, id: String(i + 1) })));
    showToast("Dados de exemplo restaurados.");
  }

  // Filtered list
  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase());
      const matchCat = !filterCat || p.category === filterCat;
      const matchSector = !filterSector || p.sector === filterSector;
      return matchSearch && matchCat && matchSector;
    });
  }, [products, search, filterCat, filterSector]);

  const sectors = [...new Set(products.map((p) => p.sector).filter(Boolean))];
  const categoriesUsed = [...new Set(products.map((p) => p.category))];
  const lastSKU = products[products.length - 1]?.sku || "—";

  // Category distribution
  const catDist = CATEGORIES.map((c) => ({
    label: c.label,
    count: products.filter((p) => p.category === c.label).length,
  })).filter((c) => c.count > 0);

  const inputCls =
    "w-full rounded-md border border-border bg-input-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition";
  const labelCls = "block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1";

  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Header ── */}
      <header className="bg-[#0f1f3d] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-0">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <div className="bg-accent rounded-md p-1.5">
                <Tag size={18} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-base tracking-tight">ObraStock</span>
                <span className="mx-2 text-white/30">|</span>
                <span className="text-sm text-white/70">Gerador Inteligente de SKU</span>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
              <span className="bg-white/10 rounded px-2 py-0.5">v1.0</span>
              <span>Módulo de Cadastro</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<Package size={18} />} label="Total de Produtos" value={products.length} />
          <StatCard icon={<Layers size={18} />} label="Categorias Ativas" value={categoriesUsed.length} />
          <StatCard icon={<Hash size={18} />} label="Último SKU" value={lastSKU.length > 18 ? lastSKU.slice(0, 18) + "…" : lastSKU} />
          <StatCard icon={<BarChart3 size={18} />} label="SKUs Hoje" value={products.filter((p) => p.createdAt === new Date().toISOString().split("T")[0]).length} accent />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Form panel ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
              <div className="bg-[#0f1f3d] px-4 py-3 flex items-center gap-2">
                <Plus size={15} className="text-white/70" />
                <h2 className="text-sm font-semibold text-white tracking-wide">
                  {editingId ? "Editar Produto" : "Novo Produto"}
                </h2>
              </div>

              <div className="p-4 space-y-3">
                {/* Category */}
                <div>
                  <label className={labelCls}>Categoria *</label>
                  <div className="relative">
                    <select
                      className={inputCls + " appearance-none pr-8"}
                      value={form.category}
                      onChange={(e) => handleCatChange(e.target.value)}
                    >
                      <option value="">Selecione uma categoria</option>
                      {CATEGORIES.map((c) => (
                        <option key={c.code} value={c.label}>
                          {c.label} ({c.code})
                        </option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-2.5 top-3 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className={labelCls}>Nome do Produto *</label>
                  <input
                    className={inputCls}
                    placeholder="Ex: Cimento, Disco de Corte"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>

                {/* Type + Measure */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Tipo / Modelo</label>
                    <input
                      className={inputCls}
                      placeholder="Ex: CP2, Flexível"
                      value={form.type}
                      onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Medida / Peso</label>
                    <input
                      className={inputCls}
                      placeholder="Ex: 50KG, 3/4"
                      value={form.measure}
                      onChange={(e) => setForm((f) => ({ ...f, measure: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Brand + Sector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Marca</label>
                    <input
                      className={inputCls}
                      placeholder="Ex: Bosch, Tigre"
                      value={form.brand}
                      onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Setor / Obra</label>
                    <input
                      className={inputCls}
                      placeholder="Ex: Obra A"
                      value={form.sector}
                      onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))}
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className={labelCls}>Observações</label>
                  <textarea
                    className={inputCls + " resize-none"}
                    rows={2}
                    placeholder="Informações adicionais..."
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>

                {/* SKU Preview */}
                {previewSKU && (
                  <div className="rounded-md border border-accent/40 bg-accent/5 p-3">
                    <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wide mb-1">
                      Prévia do SKU
                    </p>
                    <div className="flex items-center gap-2">
                      <code
                        className="text-base font-bold text-accent tracking-wider flex-1"
                        style={{ fontFamily: "'JetBrains Mono', monospace" }}
                      >
                        {previewSKU}
                      </code>
                      <button
                        onClick={() => copyToClipboard(previewSKU)}
                        className="p-1.5 rounded text-accent hover:bg-accent/10 transition"
                        title="Copiar SKU"
                      >
                        <Copy size={15} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-primary/90 transition"
                  >
                    <Save size={15} />
                    {editingId ? "Salvar Edição" : "Cadastrar Produto"}
                  </button>
                  <button
                    onClick={clearForm}
                    className="px-3 py-2 rounded-md border border-border text-muted-foreground hover:bg-muted transition text-sm"
                    title="Limpar formulário"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Category distribution */}
            {catDist.length > 0 && (
              <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm">
                <div className="px-4 py-3 border-b border-border">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Distribuição por Categoria
                  </h3>
                </div>
                <div className="p-4 space-y-2">
                  {catDist.map((c) => (
                    <div key={c.label} className="flex items-center gap-2">
                      <span className="text-xs text-foreground w-24 truncate">{c.label}</span>
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(c.count / products.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono text-muted-foreground w-5 text-right">{c.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Utility buttons */}
            <div className="bg-card border border-border rounded-lg p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Ferramentas
              </p>
              <button
                onClick={exportJSON}
                className="w-full flex items-center gap-2 text-sm text-foreground border border-border rounded-md px-3 py-2 hover:bg-muted transition"
              >
                <Download size={14} className="text-primary" />
                Exportar JSON
              </button>
              <button
                onClick={importJSON}
                className="w-full flex items-center gap-2 text-sm text-foreground border border-border rounded-md px-3 py-2 hover:bg-muted transition"
              >
                <Upload size={14} className="text-primary" />
                Importar JSON
              </button>
              <button
                onClick={restoreSamples}
                className="w-full flex items-center gap-2 text-sm text-foreground border border-border rounded-md px-3 py-2 hover:bg-muted transition"
              >
                <RefreshCw size={14} className="text-accent" />
                Restaurar Exemplos
              </button>
              {confirmClear ? (
                <div className="flex gap-2">
                  <button
                    onClick={() => { setProducts([]); setConfirmClear(false); showToast("Todos os produtos removidos.", "warn"); }}
                    className="flex-1 text-sm bg-destructive text-destructive-foreground rounded-md px-3 py-2 hover:bg-destructive/90 transition"
                  >
                    Confirmar
                  </button>
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 text-sm border border-border rounded-md px-3 py-2 hover:bg-muted transition"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(true)}
                  className="w-full flex items-center gap-2 text-sm text-destructive border border-destructive/30 rounded-md px-3 py-2 hover:bg-destructive/5 transition"
                >
                  <Trash2 size={14} />
                  Apagar Todos
                </button>
              )}
            </div>
          </div>

          {/* ── Product table panel ── */}
          <div className="lg:col-span-3 space-y-4">
            {/* Filters */}
            <div className="bg-card border border-border rounded-lg p-4 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[180px] relative">
                <Search size={14} className="absolute left-3 top-2.5 text-muted-foreground" />
                <input
                  className={inputCls + " pl-8"}
                  placeholder="Buscar por nome ou SKU..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="relative min-w-[150px]">
                <select
                  className={inputCls + " appearance-none pr-7"}
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                >
                  <option value="">Todas as Categorias</option>
                  {CATEGORIES.map((c) => (
                    <option key={c.code} value={c.label}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-3 text-muted-foreground pointer-events-none" />
              </div>
              <div className="relative min-w-[140px]">
                <select
                  className={inputCls + " appearance-none pr-7"}
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                >
                  <option value="">Todos os Setores</option>
                  {sectors.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <ChevronDown size={13} className="absolute right-2 top-3 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
              <div className="bg-[#0f1f3d] px-4 py-3 flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Produtos Cadastrados
                </span>
                <span className="text-xs text-white/50 font-mono">
                  {filtered.length} / {products.length}
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">SKU</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Produto</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">Medida</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Setor</th>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden lg:table-cell">Data</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                          Nenhum produto encontrado.
                        </td>
                      </tr>
                    )}
                    {filtered.map((p, idx) => (
                      <tr
                        key={p.id}
                        className={`border-b border-border last:border-0 hover:bg-muted/30 transition ${
                          editingId === p.id ? "bg-primary/5" : idx % 2 === 1 ? "bg-muted/20" : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <code
                            className="text-xs font-semibold text-primary bg-primary/8 rounded px-1.5 py-0.5 whitespace-nowrap"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            {p.sku}
                          </code>
                        </td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground text-xs">{p.name}</p>
                            <p className="text-xs text-muted-foreground">{p.category}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden sm:table-cell">{p.type || "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden md:table-cell">{p.measure || "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell">{p.sector || "—"}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground hidden lg:table-cell whitespace-nowrap">{formatDate(p.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => copyToClipboard(p.sku)}
                              className="p-1.5 rounded text-muted-foreground hover:text-accent hover:bg-accent/10 transition"
                              title="Copiar SKU"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => startEdit(p)}
                              className="p-1.5 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition"
                              title="Editar"
                            >
                              <Pencil size={13} />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                              title="Excluir"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border mt-8 py-4 text-center text-xs text-muted-foreground">
        ObraStock — Gerador de SKU © 2024 · Módulo de Cadastro de Materiais
      </footer>

      {/* Toast */}
      {toast && (
        <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </div>
  );
}
