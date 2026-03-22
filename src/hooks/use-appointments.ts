import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Appointment = Tables<'appointments'>;
export type AppointmentStatus = 'scheduled' | 'in-salon' | 'delayed' | 'completed' | 'cancelled';

export function useAppointments(date?: string) {
  return useQuery({
    queryKey: ['appointments', date],
    queryFn: async () => {
      let query = supabase.from('appointments').select('*');
      if (date) {
        query = query.eq('appointment_date', date);
      }
      const { data, error } = await query.order('start_time');
      if (error) throw error;
      return data as Appointment[];
    },
  });
}

export function useAddAppointment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (appointment: TablesInsert<'appointments'>) => {
      const { data, error } = await supabase.from('appointments').insert(appointment).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}
