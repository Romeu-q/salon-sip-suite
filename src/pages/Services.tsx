import { useState } from 'react';
import { useServices, useAddService } from '@/hooks/use-services';
import { Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Services() {
  const { data: services = [], isLoading } = useServices();
  const addService = useAddService();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', price: '', duration: '', category: '' });

  const categories = Array.from(new Set(services.map(s => s.category)));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) return;
    addService.mutate(
      {
        name: form.name.trim(),
        price: Number(form.price) || 0,
        duration: Number(form.duration) || 30,
        category: form.category.trim(),
      },
      {
        onSuccess: () => {
          toast({ title: 'Serviço adicionado com sucesso!' });
          setForm({ name: '', price: '', duration: '', category: '' });
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
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

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
                <span className="text-sm font-semibold gold-text">R$ {Number(s.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={() => setOpen(true)}
        className="w-full py-3 rounded-xl border-2 border-dashed border-border text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors active:scale-[0.99]"
      >
        + Adicionar Serviço
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Serviço</DialogTitle>
            <DialogDescription>Preencha os dados do serviço</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome do serviço" required />
            </div>
            <div>
              <label className="text-sm font-medium">Categoria</label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Ex: Cabelo, Barbearia, Unhas" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Preço (R$)</label>
                <Input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="85.00" />
              </div>
              <div>
                <label className="text-sm font-medium">Duração (min)</label>
                <Input type="number" min="5" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="45" />
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={addService.isPending}>
              {addService.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
