import { services } from '@/data/mock';
import { Clock, DollarSign } from 'lucide-react';

const categories = Array.from(new Set(services.map(s => s.category)));

export default function Services() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Serviços</h1>
        <p className="text-sm text-muted-foreground">Catálogo de serviços do salão</p>
      </div>

      {categories.map((cat, ci) => (
        <div key={cat} className="animate-fade-in-up" style={{ animationDelay: `${0.08 * ci}s` }}>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">{cat}</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            {services.filter(s => s.category === cat).map(s => (
              <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" /> {s.duration}min
                    </span>
                  </div>
                </div>
                <span className="text-sm font-semibold gold-text">R$ {s.price.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors active:scale-[0.99]">
        + Adicionar Serviço
      </button>
    </div>
  );
}
