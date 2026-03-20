import { FileText, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-3xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Configurações</h1>
        <p className="text-sm text-muted-foreground">Ajustes gerais do sistema</p>
      </div>

      {/* Fiscal placeholder */}
      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-status-in-salon/15 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-status-in-salon" />
          </div>
          <div>
            <h2 className="font-semibold">Configurações Fiscais</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Integração com NFC-e para emissão de notas fiscais eletrônicas.
            </p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-lg bg-status-delayed/10 border border-status-delayed/20 flex items-start gap-3">
          <AlertTriangle className="w-4 h-4 text-status-delayed shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-status-delayed">Em breve</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Suporte a Focus NFe e PlugNotas será adicionado em uma atualização futura. Configure seus dados fiscais antecipadamente.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">CNPJ</label>
            <input
              type="text"
              placeholder="00.000.000/0001-00"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Razão Social</label>
            <input
              type="text"
              placeholder="Beleza Studio LTDA"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Provedor NFC-e</label>
            <select className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30" disabled>
              <option>Selecione o provedor...</option>
              <option>Focus NFe</option>
              <option>PlugNotas</option>
            </select>
          </div>
        </div>
      </div>

      {/* General settings */}
      <div className="bg-card rounded-xl border border-border p-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <h2 className="font-semibold mb-4">Geral</h2>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Nome do Salão</label>
            <input
              type="text"
              defaultValue="Beleza Studio"
              className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Horário de Funcionamento</label>
            <div className="flex gap-3 mt-1">
              <input
                type="time"
                defaultValue="09:00"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <span className="self-center text-muted-foreground">até</span>
              <input
                type="time"
                defaultValue="18:00"
                className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
