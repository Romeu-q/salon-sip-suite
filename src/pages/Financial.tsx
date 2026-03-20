import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { financialData } from '@/data/mock';

const { monthlyRevenue } = financialData;
const lastMonth = monthlyRevenue[monthlyRevenue.length - 1];
const profit = monthlyRevenue.map(m => ({ ...m, profit: m.revenue - m.expenses }));

function MetricCard({ icon: Icon, label, value, trend, up }: { icon: any; label: string; value: string; trend: string; up: boolean }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <span className={`text-xs font-medium flex items-center gap-0.5 ${up ? 'text-status-completed' : 'text-status-delayed'}`}>
          {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          {trend}
        </span>
      </div>
      <p className="text-2xl font-bold mt-3">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export default function Financial() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Financeiro</h1>
        <p className="text-sm text-muted-foreground">Visão geral do fluxo de caixa</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard icon={DollarSign} label="Receita Mensal" value={`R$ ${(lastMonth.revenue / 1000).toFixed(1)}k`} trend="+8.2%" up />
        <MetricCard icon={Wallet} label="Despesas" value={`R$ ${(lastMonth.expenses / 1000).toFixed(1)}k`} trend="-3.1%" up />
        <MetricCard icon={TrendingUp} label="Lucro Líquido" value={`R$ ${((lastMonth.revenue - lastMonth.expenses) / 1000).toFixed(1)}k`} trend="+12.4%" up />
        <MetricCard icon={TrendingUp} label="Ticket Médio" value="R$ 195" trend="+5.7%" up />
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <h3 className="font-semibold text-sm mb-4">Receita vs Despesas</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyRevenue} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 10% 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(30 5% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(30 5% 50%)" tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: 'hsl(0 0% 100%)', border: '1px solid hsl(40 10% 90%)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`}
              />
              <Bar dataKey="revenue" name="Receita" fill="hsl(38 50% 56%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" name="Despesas" fill="hsl(40 10% 85%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <h3 className="font-semibold text-sm mb-4">Lucro Líquido</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={profit}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(40 10% 90%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="hsl(30 5% 50%)" />
              <YAxis tick={{ fontSize: 11 }} stroke="hsl(30 5% 50%)" tickFormatter={v => `${v / 1000}k`} />
              <Tooltip
                contentStyle={{ background: 'hsl(0 0% 100%)', border: '1px solid hsl(40 10% 90%)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: number) => `R$ ${v.toLocaleString('pt-BR')}`}
              />
              <Line dataKey="profit" name="Lucro" stroke="hsl(152 55% 42%)" strokeWidth={2} dot={{ r: 4, fill: 'hsl(152 55% 42%)' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* DRE Simplificado placeholder */}
      <div className="bg-card rounded-xl border border-border p-5 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <h3 className="font-semibold text-sm mb-4">DRE Simplificado — Junho 2026</h3>
        <div className="space-y-2">
          {[
            { label: 'Receita Bruta (Serviços)', value: 'R$ 28.600', positive: true },
            { label: 'Receita Bruta (Cafeteria)', value: 'R$ 7.200', positive: true },
            { label: 'Total Receita', value: 'R$ 35.800', positive: true, bold: true },
            { label: 'Comissões Profissionais', value: '- R$ 11.440', positive: false },
            { label: 'Custo Produtos (CMV)', value: '- R$ 2.880', positive: false },
            { label: 'Despesas Fixas', value: '- R$ 6.480', positive: false },
            { label: 'Lucro Líquido', value: 'R$ 15.000', positive: true, bold: true },
          ].map((row, i) => (
            <div key={i} className={`flex justify-between py-2 ${row.bold ? 'border-t border-border font-semibold pt-3' : ''}`}>
              <span className="text-sm">{row.label}</span>
              <span className={`text-sm tabular-nums ${row.positive ? 'text-status-completed' : 'text-status-delayed'} ${row.bold ? 'font-bold' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
