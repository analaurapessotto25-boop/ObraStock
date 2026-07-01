import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  CheckCircle,
  ChevronDown,
  Copy,
  Download,
  Hash,
  Layers,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Save,
  Search,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";

interface SkuProduct {
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

const SAMPLE_PRODUCTS: Omit<SkuProduct, "id">[] = [
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
];

const STORAGE_KEY = "obrastock_skus";

const EMPTY_FORM = {
  category: "",
  categoryCode: "",
  name: "",
  type: "",
  measure: "",
  brand: "",
  sector: "",
  notes: "",
};

function slugify(text: string, maxLen = 3): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
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
  return [
    categoryCode || "OUT",
    slugify(name) || "PRD",
    slugify(type) || "UN",
    slugify(measure, 5) || "UN",
    slugify(brand) || "GEN",
    String(seq).padStart(3, "0"),
  ].join("-");
}

function nextSeq(products: SkuProduct[]): number {
  const nums = products
    .map((product) => Number.parseInt(product.sku.split("-").pop() || "0", 10))
    .filter((num) => !Number.isNaN(num));

  return nums.length ? Math.max(...nums) + 1 : products.length + 1;
}

function loadProducts(): SkuProduct[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  return SAMPLE_PRODUCTS.map((product, index) => ({ ...product, id: String(index + 1) }));
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR");
}

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
    <div className={`rounded-lg p-4 flex items-start gap-3 border shadow-sm ${accent ? "bg-[#1a3a5c] text-white border-[#1a3a5c]" : "bg-white border-[#1a3a5c]/10"}`}>
      <div className={accent ? "text-white/80 mt-0.5" : "text-[#1a3a5c] mt-0.5"}>{icon}</div>
      <div className="min-w-0">
        <p className={`text-xs font-semibold uppercase tracking-wide ${accent ? "text-white/70" : "text-[#5a7090]"}`}>{label}</p>
        <p className={`text-xl font-bold mt-0.5 font-mono truncate ${accent ? "text-white" : "text-[#0d1b2a]"}`}>{value}</p>
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
    success: "bg-green-600 text-white",
    error: "bg-red-600 text-white",
    warn: "bg-amber-500 text-white",
  };
  const Icon = type === "success" ? CheckCircle : type === "warn" ? AlertTriangle : X;

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${colors[type]}`}>
      <Icon size={16} />
      <span>{msg}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100" title="Fechar aviso">
        <X size={14} />
      </button>
    </div>
  );
}

export default function SkuGeneratorView() {
  const [products, setProducts] = useState<SkuProduct[]>(loadProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" | "warn" } | null>(null);
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  const previewSKU = useMemo(() => {
    if (!form.category) return "";
    const seq = editingId
      ? Number.parseInt(products.find((product) => product.id === editingId)?.sku.split("-").pop() || "0", 10)
      : nextSeq(products);

    return generateSKU(form.categoryCode, form.name, form.type, form.measure, form.brand, seq);
  }, [editingId, form, products]);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const term = search.toLowerCase();
      const matchSearch = !term || product.name.toLowerCase().includes(term) || product.sku.toLowerCase().includes(term);
      const matchCat = !filterCat || product.category === filterCat;
      const matchSector = !filterSector || product.sector === filterSector;
      return matchSearch && matchCat && matchSector;
    });
  }, [filterCat, filterSector, products, search]);

  const sectors = [...new Set(products.map((product) => product.sector).filter(Boolean))];
  const categoriesUsed = [...new Set(products.map((product) => product.category))];
  const lastSKU = products[products.length - 1]?.sku || "-";
  const catDist = CATEGORIES.map((category) => ({
    label: category.label,
    count: products.filter((product) => product.category === category.label).length,
  })).filter((category) => category.count > 0);

  function showToast(msg: string, type: "success" | "error" | "warn" = "success") {
    setToast({ msg, type });
    window.setTimeout(() => setToast(null), 3500);
  }

  function handleCatChange(label: string) {
    const category = CATEGORIES.find((item) => item.label === label);
    setForm((current) => ({ ...current, category: label, categoryCode: category?.code || "" }));
  }

  function clearForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function handleSubmit() {
    if (!form.category || !form.name) {
      showToast("Preencha pelo menos Categoria e Nome do produto.", "warn");
      return;
    }

    const duplicate = products.find((product) => product.sku === previewSKU && product.id !== editingId);
    if (duplicate) {
      showToast("SKU duplicado. Já existe um produto com esse código.", "warn");
      return;
    }

    if (editingId) {
      setProducts((current) => current.map((product) => (product.id === editingId ? { ...product, ...form, sku: previewSKU } : product)));
      showToast("Produto atualizado com sucesso.");
    } else {
      setProducts((current) => [
        ...current,
        {
          id: Date.now().toString(),
          sku: previewSKU,
          ...form,
          createdAt: new Date().toISOString().split("T")[0],
        },
      ]);
      showToast("Produto cadastrado com sucesso.");
    }

    clearForm();
  }

  function startEdit(product: SkuProduct) {
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
    setProducts((current) => current.filter((product) => product.id !== id));
    showToast("Produto removido.", "warn");
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(
      () => showToast("SKU copiado."),
      () => showToast("Não foi possível copiar o SKU.", "error")
    );
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "obrastock_produtos_sku.json";
    anchor.click();
    URL.revokeObjectURL(url);
    showToast("Arquivo exportado com sucesso.");
  }

  function importJSON() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (event: Event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        try {
          const data = JSON.parse(String(readerEvent.target?.result || "[]"));
          if (Array.isArray(data)) {
            setProducts(data);
            showToast(`${data.length} produto(s) importado(s).`);
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
    setProducts(SAMPLE_PRODUCTS.map((product, index) => ({ ...product, id: String(index + 1) })));
    showToast("Dados de exemplo restaurados.");
  }

  const inputCls =
    "w-full rounded-md border border-[#1a3a5c]/15 bg-[#f0f4f9] px-3 py-2 text-sm text-[#0d1b2a] placeholder:text-[#5a7090]/70 focus:outline-none focus:ring-2 focus:ring-[#1a3a5c]/30 transition";
  const labelCls = "block text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-1";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a3a5c] font-['Barlow_Condensed'] tracking-wide">Gerador de SKU</h2>
          <p className="text-sm text-[#5a7090] mt-0.5">Cadastro e padronização de códigos para materiais e ferramentas</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-[#1a3a5c]/10 bg-white px-3 py-2 text-xs text-[#5a7090]">
          <Tag size={14} className="text-[#f97316]" />
          Módulo de Cadastro
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={<Package size={18} />} label="Total de Produtos" value={products.length} />
        <StatCard icon={<Layers size={18} />} label="Categorias Ativas" value={categoriesUsed.length} />
        <StatCard icon={<Hash size={18} />} label="Último SKU" value={lastSKU.length > 18 ? `${lastSKU.slice(0, 18)}...` : lastSKU} />
        <StatCard icon={<BarChart3 size={18} />} label="SKUs Hoje" value={products.filter((product) => product.createdAt === new Date().toISOString().split("T")[0]).length} accent />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <section className="bg-white border border-[#1a3a5c]/10 rounded-xl overflow-hidden shadow-sm">
            <div className="bg-[#1a3a5c] px-4 py-3 flex items-center gap-2">
              <Plus size={15} className="text-white/70" />
              <h3 className="text-sm font-semibold text-white tracking-wide">{editingId ? "Editar Produto" : "Novo Produto"}</h3>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <label className={labelCls}>Categoria *</label>
                <div className="relative">
                  <select className={`${inputCls} appearance-none pr-8`} value={form.category} onChange={(event) => handleCatChange(event.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {CATEGORIES.map((category) => (
                      <option key={category.code} value={category.label}>
                        {category.label} ({category.code})
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-3 text-[#5a7090] pointer-events-none" />
                </div>
              </div>

              <div>
                <label className={labelCls}>Nome do Produto *</label>
                <input className={inputCls} placeholder="Ex: Cimento, Disco de Corte" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Tipo / Modelo</label>
                  <input className={inputCls} placeholder="Ex: CP2" value={form.type} onChange={(event) => setForm((current) => ({ ...current, type: event.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Medida / Peso</label>
                  <input className={inputCls} placeholder="Ex: 50KG" value={form.measure} onChange={(event) => setForm((current) => ({ ...current, measure: event.target.value }))} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Marca</label>
                  <input className={inputCls} placeholder="Ex: Bosch" value={form.brand} onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))} />
                </div>
                <div>
                  <label className={labelCls}>Setor / Obra</label>
                  <input className={inputCls} placeholder="Ex: Obra A" value={form.sector} onChange={(event) => setForm((current) => ({ ...current, sector: event.target.value }))} />
                </div>
              </div>

              <div>
                <label className={labelCls}>Observações</label>
                <textarea className={`${inputCls} resize-none`} rows={2} placeholder="Informações adicionais..." value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
              </div>

              {previewSKU && (
                <div className="rounded-lg border border-[#f97316]/30 bg-[#f97316]/5 p-3">
                  <p className="text-xs text-[#5a7090] font-semibold uppercase tracking-wide mb-1">Prévia do SKU</p>
                  <div className="flex items-center gap-2">
                    <code className="text-base font-bold text-[#1a3a5c] tracking-wider flex-1 break-all">{previewSKU}</code>
                    <button onClick={() => copyToClipboard(previewSKU)} className="p-1.5 rounded text-[#f97316] hover:bg-[#f97316]/10 transition" title="Copiar SKU">
                      <Copy size={15} />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-1">
                <button onClick={handleSubmit} className="flex-1 flex items-center justify-center gap-2 bg-[#1a3a5c] text-white rounded-md px-4 py-2.5 text-sm font-semibold hover:bg-[#122a45] transition">
                  <Save size={15} />
                  {editingId ? "Salvar Edição" : "Cadastrar Produto"}
                </button>
                <button onClick={clearForm} className="px-3 py-2 rounded-md border border-[#1a3a5c]/15 text-[#5a7090] hover:bg-[#eef2f7] transition" title="Limpar formulário">
                  <X size={15} />
                </button>
              </div>
            </div>
          </section>

          {catDist.length > 0 && (
            <section className="bg-white border border-[#1a3a5c]/10 rounded-xl overflow-hidden shadow-sm">
              <div className="px-4 py-3 border-b border-[#1a3a5c]/10">
                <h3 className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide">Distribuição por Categoria</h3>
              </div>
              <div className="p-4 space-y-2">
                {catDist.map((category) => (
                  <div key={category.label} className="flex items-center gap-2">
                    <span className="text-xs text-[#0d1b2a] w-24 truncate">{category.label}</span>
                    <div className="flex-1 bg-[#eef2f7] rounded-full h-2 overflow-hidden">
                      <div className="h-full bg-[#1a3a5c] rounded-full transition-all" style={{ width: `${(category.count / products.length) * 100}%` }} />
                    </div>
                    <span className="text-xs font-mono text-[#5a7090] w-5 text-right">{category.count}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white border border-[#1a3a5c]/10 rounded-xl p-4 space-y-2 shadow-sm">
            <p className="text-xs font-semibold text-[#5a7090] uppercase tracking-wide mb-3">Ferramentas</p>
            <button onClick={exportJSON} className="w-full flex items-center gap-2 text-sm text-[#0d1b2a] border border-[#1a3a5c]/10 rounded-md px-3 py-2 hover:bg-[#eef2f7] transition">
              <Download size={14} className="text-[#1a3a5c]" />
              Exportar JSON
            </button>
            <button onClick={importJSON} className="w-full flex items-center gap-2 text-sm text-[#0d1b2a] border border-[#1a3a5c]/10 rounded-md px-3 py-2 hover:bg-[#eef2f7] transition">
              <Upload size={14} className="text-[#1a3a5c]" />
              Importar JSON
            </button>
            <button onClick={restoreSamples} className="w-full flex items-center gap-2 text-sm text-[#0d1b2a] border border-[#1a3a5c]/10 rounded-md px-3 py-2 hover:bg-[#eef2f7] transition">
              <RefreshCw size={14} className="text-[#f97316]" />
              Restaurar Exemplos
            </button>
            {confirmClear ? (
              <div className="flex gap-2">
                <button onClick={() => { setProducts([]); setConfirmClear(false); showToast("Todos os produtos removidos.", "warn"); }} className="flex-1 text-sm bg-red-600 text-white rounded-md px-3 py-2 hover:bg-red-700 transition">
                  Confirmar
                </button>
                <button onClick={() => setConfirmClear(false)} className="flex-1 text-sm border border-[#1a3a5c]/10 rounded-md px-3 py-2 hover:bg-[#eef2f7] transition">
                  Cancelar
                </button>
              </div>
            ) : (
              <button onClick={() => setConfirmClear(true)} className="w-full flex items-center gap-2 text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 hover:bg-red-50 transition">
                <Trash2 size={14} />
                Apagar Todos
              </button>
            )}
          </section>
        </div>

        <div className="xl:col-span-3 space-y-4">
          <section className="bg-white border border-[#1a3a5c]/10 rounded-xl p-4 flex flex-wrap gap-3 shadow-sm">
            <div className="flex-1 min-w-[180px] relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[#5a7090]" />
              <input className={`${inputCls} pl-8 bg-white`} placeholder="Buscar por nome ou SKU..." value={search} onChange={(event) => setSearch(event.target.value)} />
            </div>
            <div className="relative min-w-[150px]">
              <select className={`${inputCls} appearance-none pr-7 bg-white`} value={filterCat} onChange={(event) => setFilterCat(event.target.value)}>
                <option value="">Todas as Categorias</option>
                {CATEGORIES.map((category) => (
                  <option key={category.code} value={category.label}>{category.label}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-3 text-[#5a7090] pointer-events-none" />
            </div>
            <div className="relative min-w-[140px]">
              <select className={`${inputCls} appearance-none pr-7 bg-white`} value={filterSector} onChange={(event) => setFilterSector(event.target.value)}>
                <option value="">Todos os Setores</option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <ChevronDown size={13} className="absolute right-2 top-3 text-[#5a7090] pointer-events-none" />
            </div>
          </section>

          <section className="bg-white border border-[#1a3a5c]/10 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1a3a5c] px-4 py-3 flex items-center justify-between">
              <span className="text-sm font-semibold text-white">Produtos Cadastrados</span>
              <span className="text-xs text-white/60 font-mono">{filtered.length} / {products.length}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#1a3a5c]/10 bg-[#eef2f7]">
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide">SKU</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide">Produto</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide hidden sm:table-cell">Tipo</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide hidden md:table-cell">Medida</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide hidden lg:table-cell">Setor</th>
                    <th className="text-left px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide hidden lg:table-cell">Data</th>
                    <th className="text-right px-4 py-2.5 text-xs font-semibold text-[#5a7090] uppercase tracking-wide">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center py-10 text-[#5a7090] text-sm">Nenhum produto encontrado.</td>
                    </tr>
                  )}
                  {filtered.map((product, index) => (
                    <tr key={product.id} className={`border-b border-[#1a3a5c]/10 last:border-0 hover:bg-[#eef2f7] transition ${editingId === product.id ? "bg-[#1a3a5c]/5" : index % 2 === 1 ? "bg-[#f8fafc]" : ""}`}>
                      <td className="px-4 py-3">
                        <code className="text-xs font-semibold text-[#1a3a5c] bg-[#1a3a5c]/8 rounded px-1.5 py-0.5 whitespace-nowrap">{product.sku}</code>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-[#0d1b2a] text-xs">{product.name}</p>
                        <p className="text-xs text-[#5a7090]">{product.category}</p>
                      </td>
                      <td className="px-4 py-3 text-xs text-[#5a7090] hidden sm:table-cell">{product.type || "-"}</td>
                      <td className="px-4 py-3 text-xs text-[#5a7090] hidden md:table-cell">{product.measure || "-"}</td>
                      <td className="px-4 py-3 text-xs text-[#5a7090] hidden lg:table-cell">{product.sector || "-"}</td>
                      <td className="px-4 py-3 text-xs text-[#5a7090] hidden lg:table-cell whitespace-nowrap">{formatDate(product.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => copyToClipboard(product.sku)} className="p-1.5 rounded text-[#5a7090] hover:text-[#f97316] hover:bg-[#f97316]/10 transition" title="Copiar SKU">
                            <Copy size={13} />
                          </button>
                          <button onClick={() => startEdit(product)} className="p-1.5 rounded text-[#5a7090] hover:text-[#1a3a5c] hover:bg-[#1a3a5c]/10 transition" title="Editar">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteProduct(product.id)} className="p-1.5 rounded text-[#5a7090] hover:text-red-600 hover:bg-red-50 transition" title="Excluir">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>

      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
