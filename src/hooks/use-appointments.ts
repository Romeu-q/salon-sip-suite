import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type Appointment = Tables<'appointments'>;
export type AppointmentStatus = 'scheduled' | 'in_salon' | 'delayed' | 'finished' | 'cancelled';

export function useAppointments(date?: string) {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['appointments', date, tenantId],
    queryFn: async () => {
      let query = supabase.from('appointments').select('*');
      if (date) {
        query = query.eq('appointment_date', date);
      }
      const { data, error } = await query.order('start_time');
      if (error) throw error;
      return data as Appointment[];
    },
    enabled: !!tenantId,
  });
}

export function useAddAppointment() {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();
  return useMutation({
    mutationFn: async (appointment: Omit<TablesInsert<'appointments'>, 'tenant_id'>) => {
      const { data, error } = await supabase.from('appointments').insert({ ...appointment, tenant_id: tenantId! }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Tables<'appointments'>>) => {
      const { data, error } = await supabase.from('appointments').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
