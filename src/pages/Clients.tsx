import { useState, useMemo } from 'react';
import { useClients, useAddClient } from '@/hooks/use-clients';
import { Search, Phone, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Clients() {
  const { data: clients = [], isLoading } = useClients();
  const addClient = useAddClient();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' });

  const filtered = useMemo(() => {
    if (!search) return clients;
    const q = search.toLowerCase();
    return clients.filter(c => c.name.toLowerCase().includes(q) || c.phone?.includes(q));
  }, [clients, search]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addClient.mutate(
      { name: form.name.trim(), phone: form.phone || null, email: form.email || null, notes: form.notes || null },
      {
        onSuccess: () => {
          toast({ title: 'Cliente adicionado!' });
          setForm({ name: '', phone: '', email: '', notes: '' });
          setOpen(false);
        },
        onError: (err) => {
          toast({ title: 'Erro', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-sm text-muted-foreground">{clients.length} cadastrados</p>
        </div>
        <Button onClick={() => setOpen(true)}>+ Novo Cliente</Button>
      </div>

      <div className="relative animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome ou telefone..." className="pl-10" />
      </div>

      <div className="bg-card rounded-xl border border-border divide-y divide-border animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">Nenhum cliente encontrado</div>
        ) : (
          filtered.map(c => (
            <div key={c.id} className="flex items-center justify-between px-4 py-3 hover:bg-secondary/30 transition-colors">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <div className="flex items-center gap-4 mt-0.5">
                  {c.phone && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Phone className="w-3 h-3" /> {c.phone}
                    </span>
                  )}
                  {c.email && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Mail className="w-3 h-3" /> {c.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Cliente</DialogTitle>
            <DialogDescription>Cadastre um novo cliente</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nome</label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Nome completo" required />
            </div>
            <div>
              <label className="text-sm font-medium">Telefone</label>
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="(11) 99999-9999" />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Observações</label>
              <Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Notas sobre o cliente" />
            </div>
            <Button type="submit" className="w-full" disabled={addClient.isPending}>
              {addClient.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
