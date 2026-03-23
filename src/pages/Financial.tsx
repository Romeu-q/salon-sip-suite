import { useMemo, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet, Plus } from 'lucide-react';
import { useFinancialEntries, useAddFinancialEntry } from '@/hooks/use-financial';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

function MetricCard({ icon: Icon, label, value, trend, up }: { icon: any; label: string; value: string; trend?: string; up?: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        {trend && (
          <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-status-completed' : 'text-status-delayed'}`}>
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Financial() {
  const today = new Date();
  const startOfMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
  const endOfMonth = today.toISOString().split('T')[0];

  const { data: entries = [], isLoading } = useFinancialEntries(startOfMonth, endOfMonth);
  const addEntry = useAddFinancialEntry();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ type: 'expense', category: '', description: '', amount: '' });

  const income = useMemo(() => entries.filter(e => e.type === 'income').reduce((s, e) => s + Number(e.amount), 0), [entries]);
  const expenses = useMemo(() => entries.filter(e => e.type === 'expense').reduce((s, e) => s + Number(e.amount), 0), [entries]);
  const profit = income - expenses;
  const incomeCount = entries.filter(e => e.type === 'income').length;
  const avgTicket = incomeCount > 0 ? Math.round(income / incomeCount) : 0;

  const dailyData = useMemo(() => {
    const map = new Map<string, { date: string; income: number; expenses: number }>();
    entries.forEach(e => {
      const day = e.date;
      if (!map.has(day)) map.set(day, { date: day, income: 0, expenses: 0 });
      const d = map.get(day)!;
      if (e.type === 'income') d.income += Number(e.amount);
      else d.expenses += Number(e.amount);
    });
    return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category.trim() || !form.amount) return;
    addEntry.mutate(
      {
        type: form.type as any,
        category: form.category.trim(),
        description: form.description.trim() || null,
        amount: Number(form.amount),
        date: today.toISOString().split('T')[0],
      },
      {
        onSuccess: () => {
          toast({ title: 'Lançamento registrado!' });
          setForm({ type: 'expense', category: '', description: '', amount: '' });
          setOpen(false);
        },
        onError: (err) => {
          toast({ title: 'Erro', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

  const fmt = (v: number) => `R$ ${(v / 1000).toFixed(1)}k`;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Visão geral do mês</p>
        </div>
        <Button onClick={() => setOpen(true)} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-1" /> Lançamento
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={DollarSign} label="Receita do Mês" value={`R$ ${income.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        <MetricCard icon={Wallet} label="Despesas" value={`R$ ${expenses.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        <MetricCard icon={TrendingUp} label="Lucro Líquido" value={`R$ ${profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} />
        <MetricCard icon={TrendingUp} label="Ticket Médio" value={`R$ ${avgTicket}`} />
      </div>

      {dailyData.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-sm mb-4">Fluxo de Caixa</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={dailyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={d => d.slice(8)} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`} />
                <Bar dataKey="income" name="Receita" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" name="Despesas" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <h3 className="font-semibold text-sm mb-4">Lucro Diário</h3>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={dailyData.map(d => ({ ...d, profit: d.income - d.expenses }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" tickFormatter={d => d.slice(8)} />
                <YAxis tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" tickFormatter={v => `${v / 1000}k`} />
                <Tooltip formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`} />
                <Line dataKey="profit" name="Lucro" stroke="hsl(var(--status-completed))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent entries */}
      <div className="bg-card rounded-xl border border-border animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold text-sm">Lançamentos Recentes</h3>
        </div>
        <div className="divide-y divide-border">
          {entries.slice(0, 20).map(e => (
            <div key={e.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <p className="text-sm font-medium">{e.category}</p>
                <p className="text-xs text-muted-foreground">{e.description} · {new Date(e.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <span className={`text-sm font-semibold tabular-nums ${e.type === 'income' ? 'text-status-completed' : 'text-status-delayed'}`}>
                {e.type === 'income' ? '+' : '-'} R$ {Number(e.amount).toFixed(2)}
              </span>
            </div>
          ))}
          {entries.length === 0 && (
            <div className="p-8 text-center text-muted-foreground text-sm">Nenhum lançamento no período</div>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Lançamento</DialogTitle>
            <DialogDescription>Registre uma entrada ou despesa</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Tipo</label>
              <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Entrada</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: Aluguel, Fornecedor" required />
            </div>
            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Detalhes (opcional)" />
            </div>
            <div>
              <label className="text-sm font-medium">Valor (R$)</label>
              <Input type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0.00" required />
            </div>
            <Button type="submit" className="w-full" disabled={addEntry.isPending}>
              {addEntry.isPending ? 'Salvando...' : 'Registrar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
