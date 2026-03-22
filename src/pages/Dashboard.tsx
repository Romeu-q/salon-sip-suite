import { useMemo, useState } from 'react';
import { Clock, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useProfessionals } from '@/hooks/use-professionals';
import { useAppointments, useAddAppointment, type Appointment, type AppointmentStatus } from '@/hooks/use-appointments';
import { useServices } from '@/hooks/use-services';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const statusConfig: Record<AppointmentStatus, { label: string; className: string }> = {
  scheduled: { label: 'Agendado', className: 'bg-status-scheduled/15 text-status-scheduled' },
  'in-salon': { label: 'No Salão', className: 'bg-status-in-salon/15 text-status-in-salon' },
  delayed: { label: 'Atrasado', className: 'bg-status-delayed/15 text-status-delayed' },
  completed: { label: 'Finalizado', className: 'bg-status-completed/15 text-status-completed' },
  cancelled: { label: 'Cancelado', className: 'bg-status-cancelled/15 text-status-cancelled' },
};

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

function StatCard({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 animate-fade-in-up">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold">{value}</p>
          {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ apt }: { apt: Appointment }) {
  const config = statusConfig[apt.status as AppointmentStatus] || statusConfig.scheduled;
  const topPx = (() => {
    const [h, m] = apt.start_time.split(':').map(Number);
    return ((h - 8) * 80) + (m / 60 * 80);
  })();
  const heightPx = (apt.duration / 60) * 80;

  return (
    <div
      className={`absolute left-1 right-1 rounded-lg px-2.5 py-1.5 overflow-hidden cursor-pointer transition-shadow hover:shadow-md border-l-[3px] ${
        apt.status === 'delayed' ? 'border-l-status-delayed animate-pulse' :
        apt.status === 'completed' ? 'border-l-status-completed' :
        apt.status === 'in-salon' ? 'border-l-status-in-salon' :
        apt.status === 'cancelled' ? 'border-l-status-cancelled' :
        'border-l-status-scheduled'
      } bg-card shadow-sm`}
      style={{ top: `${topPx}px`, height: `${Math.max(heightPx - 4, 28)}px` }}
    >
      <p className="text-xs font-medium truncate">{apt.client_name}</p>
      {heightPx > 40 && (
        <>
          <p className="text-[10px] text-muted-foreground truncate">{apt.service_name}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${config.className}`}>
              {config.label}
            </span>
            <span className="text-[10px] text-muted-foreground">{apt.start_time}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const today = new Date().toISOString().split('T')[0];
  const { data: professionals = [], isLoading: loadingPros } = useProfessionals();
  const { data: appointments = [], isLoading: loadingApts } = useAppointments(today);
  const { data: services = [] } = useServices();
  const addAppointment = useAddAppointment();
  const { toast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [newApt, setNewApt] = useState({ professionalId: '', serviceId: '', clientName: '', startTime: '09:00' });

  const handleTimeSlotClick = (professionalId: string, time: string) => {
    setNewApt({ professionalId, serviceId: '', clientName: '', startTime: time });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const service = services.find(s => s.id === newApt.serviceId);
    if (!service || !newApt.clientName.trim() || !newApt.professionalId) return;
    addAppointment.mutate(
      {
        professional_id: newApt.professionalId,
        client_name: newApt.clientName.trim(),
        service_name: service.name,
        start_time: newApt.startTime,
        duration: service.duration,
        price: Number(service.price),
        status: 'scheduled',
        appointment_date: today,
      },
      {
        onSuccess: () => {
          toast({ title: 'Agendamento criado com sucesso!' });
          setModalOpen(false);
        },
        onError: (err) => {
          toast({ title: 'Erro ao agendar', description: err.message, variant: 'destructive' });
        },
      }
    );
  };

  const appointmentsByProfessional = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    professionals.forEach(p => map.set(p.id, []));
    appointments.forEach(a => {
      map.get(a.professional_id)?.push(a);
    });
    return map;
  }, [professionals, appointments]);

  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const totalRevenue = appointments.filter(a => a.status === 'completed').reduce((s, a) => s + Number(a.price), 0);
  const avgTicket = completedCount > 0 ? Math.round(totalRevenue / completedCount) : 0;

  const isLoading = loadingPros || loadingApts;

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-muted rounded-lg" />)}
          </div>
          <div className="h-96 bg-muted rounded-xl" />
        </div>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-sm text-muted-foreground capitalize">{dateStr}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Faturamento Hoje" value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`} />
        <StatCard icon={Clock} label="Agendamentos" value={String(appointments.length)} sub={`${completedCount} finalizados`} />
        <StatCard icon={TrendingUp} label="Ticket Médio" value={`R$ ${avgTicket}`} />
        <StatCard icon={Users} label="Profissionais" value={String(professionals.length)} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Timeline de Hoje</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            <div className="grid border-b border-border" style={{ gridTemplateColumns: `64px repeat(${professionals.length}, 1fr)` }}>
              <div className="p-3 text-xs text-muted-foreground">Hora</div>
              {professionals.map(p => (
                <div key={p.id} className="p-3 border-l border-border">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                      style={{ backgroundColor: p.color }}
                    >
                      {p.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{p.name}</p>
                      <p className="text-[10px] text-muted-foreground">{p.specialty}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="relative grid" style={{ gridTemplateColumns: `64px repeat(${professionals.length}, 1fr)` }}>
              <div className="relative">
                {timeSlots.map(slot => (
                  <div key={slot} className="h-20 px-3 flex items-start pt-1 border-b border-border/50">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{slot}</span>
                  </div>
                ))}
              </div>

              {professionals.map(p => (
                <div key={p.id} className="relative border-l border-border">
                  {timeSlots.map(slot => (
                    <div
                      key={slot}
                      className="h-20 border-b border-border/50 cursor-pointer hover:bg-secondary/20 transition-colors"
                      onClick={() => handleTimeSlotClick(p.id, slot)}
                    />
                  ))}
                  <div className="absolute inset-0 pointer-events-none">
                    {(appointmentsByProfessional.get(p.id) || []).map(apt => (
                      <div key={apt.id} className="pointer-events-auto">
                        <AppointmentCard apt={apt} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Agendamento</DialogTitle>
            <DialogDescription>
              {professionals.find(p => p.id === newApt.professionalId)?.name} — {newApt.startTime}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Cliente</label>
              <Input value={newApt.clientName} onChange={e => setNewApt({ ...newApt, clientName: e.target.value })} placeholder="Nome do cliente" required />
            </div>
            <div>
              <label className="text-sm font-medium">Serviço</label>
              <Select value={newApt.serviceId} onValueChange={v => setNewApt({ ...newApt, serviceId: v })}>
                <SelectTrigger><SelectValue placeholder="Selecione um serviço" /></SelectTrigger>
                <SelectContent>
                  {services.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name} — R$ {Number(s.price).toFixed(2)} ({s.duration}min)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Horário</label>
              <Input type="time" value={newApt.startTime} onChange={e => setNewApt({ ...newApt, startTime: e.target.value })} />
            </div>
            <Button type="submit" className="w-full" disabled={addAppointment.isPending || !newApt.serviceId}>
              {addAppointment.isPending ? 'Salvando...' : 'Agendar'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
