import { professionals } from '@/data/mock';
import { Percent, Clock, Star } from 'lucide-react';

export default function Professionals() {
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Equipe</h1>
        <p className="text-sm text-muted-foreground">Gerencie seus profissionais</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {professionals.map((p, i) => (
          <div
            key={p.id}
            className="bg-card rounded-xl border border-border p-5 flex items-start gap-4 transition-shadow hover:shadow-md animate-fade-in-up"
            style={{ animationDelay: `${0.08 * i}s` }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: p.color }}
            >
              {p.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.specialty}</p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Percent className="w-3.5 h-3.5" />
                  <span>{p.commission}% comissão</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>09:00 - 18:00</span>
                </div>
              </div>
            </div>
            <button className="text-xs text-primary hover:underline shrink-0 mt-1">Editar</button>
          </div>
        ))}
      </div>

      <button className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors active:scale-[0.99]">
        + Adicionar Profissional
      </button>
    </div>
  );
}
