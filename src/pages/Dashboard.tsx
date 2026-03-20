import { useMemo } from 'react';
import { Clock, Users, DollarSign, TrendingUp } from 'lucide-react';
import { professionals, todayAppointments, financialData, type Appointment, type AppointmentStatus } from '@/data/mock';

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
  const config = statusConfig[apt.status];
  const topPx = (() => {
    const [h, m] = apt.startTime.split(':').map(Number);
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
      <p className="text-xs font-medium truncate">{apt.clientName}</p>
      {heightPx > 40 && (
        <>
          <p className="text-[10px] text-muted-foreground truncate">{apt.serviceName}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${config.className}`}>
              {config.label}
            </span>
            <span className="text-[10px] text-muted-foreground">{apt.startTime}</span>
          </div>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const { todayStats } = financialData;

  const appointmentsByProfessional = useMemo(() => {
    const map = new Map<string, Appointment[]>();
    professionals.forEach(p => map.set(p.id, []));
    todayAppointments.forEach(a => {
      map.get(a.professionalId)?.push(a);
    });
    return map;
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-sm text-muted-foreground">Terça-feira, 20 de Março 2026</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={DollarSign} label="Faturamento Hoje" value={`R$ ${todayStats.revenue.toLocaleString('pt-BR')}`} />
        <StatCard icon={Clock} label="Agendamentos" value={String(todayStats.appointments)} sub="4 finalizados" />
        <StatCard icon={TrendingUp} label="Ticket Médio" value={`R$ ${todayStats.avgTicket}`} />
        <StatCard icon={Users} label="Ocupação" value={`${todayStats.occupancy}%`} />
      </div>

      {/* Timeline */}
      <div className="bg-card rounded-xl border border-border overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold">Timeline de Hoje</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[700px]">
            {/* Professional headers */}
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

            {/* Time grid */}
            <div className="relative grid" style={{ gridTemplateColumns: `64px repeat(${professionals.length}, 1fr)` }}>
              {/* Time labels */}
              <div className="relative">
                {timeSlots.map((slot, i) => (
                  <div key={slot} className="h-20 px-3 flex items-start pt-1 border-b border-border/50">
                    <span className="text-[10px] text-muted-foreground tabular-nums">{slot}</span>
                  </div>
                ))}
              </div>

              {/* Professional columns */}
              {professionals.map(p => (
                <div key={p.id} className="relative border-l border-border">
                  {timeSlots.map(slot => (
                    <div key={slot} className="h-20 border-b border-border/50" />
                  ))}
                  {/* Appointments overlay */}
                  <div className="absolute inset-0">
                    {(appointmentsByProfessional.get(p.id) || []).map(apt => (
                      <AppointmentCard key={apt.id} apt={apt} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
