import { useState } from 'react';
import { useProfessionals, useAddProfessional } from '@/hooks/use-professionals';
import { Percent, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Professionals() {
  const { data: professionals = [], isLoading } = useProfessionals();
  const addProfessional = useAddProfessional();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', specialty: '', commission: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.specialty.trim()) return;
    const initials = form.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const hue = Math.floor(Math.random() * 360);
    addProfessional.mutate(
      {
        name: form.name.trim(),
        specialty: form.specialty.trim(),
        commission: Number(form.commission) || 0,
        avatar: initials,
        color: `hsl(${hue} 50% 55%)`,
      },
      {
        onSuccess: () => {
          toast({ title: 'Profissional adicionado com sucesso!' });
          setForm({ name: '', specialty: '', commission: '' });
          setOpen(false);
        },
        onError: (err) => {
          toast({ title: 'Erro ao salvar', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

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

      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors active:scale-[0.99]"
      >
        + Adicionar Profissional
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Profissional</DialogTitle>
            <DialogDescription>Preencha os dados do profissional</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" required />
            </div>
            <div>
              <label className="text-sm font-medium">Especialidade</label>
              <Input value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} placeholder="Ex: Colorista, Barbeiro" required />
            </div>
            <div>
              <label className="text-sm font-medium">Comissão (%)</label>
              <Input type="number" min="0" max="100" value={form.commission} onChange={e => setForm({ ...form, commission: e.target.value })} placeholder="40" />
            </div>
            <Button type="submit" className="w-full" disabled={addProfessional.isPending}>
              {addProfessional.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
