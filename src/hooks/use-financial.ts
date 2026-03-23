import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type FinancialEntry = Tables<'financial_entries'>;

export function useFinancialEntries(startDate?: string, endDate?: string) {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['financial-entries', startDate, endDate, tenantId],
    queryFn: async () => {
      let query = supabase.from('financial_entries').select('*');
      if (startDate) query = query.gte('date', startDate);
      if (endDate) query = query.lte('date', endDate);
      const { data, error } = await query.order('date', { ascending: false });
      if (error) throw error;
      return data as FinancialEntry[];
    },
    enabled: !!tenantId,
  });
}

export function useAddFinancialEntry() {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();
  return useMutation({
    mutationFn: async (entry: Omit<TablesInsert<'financial_entries'>, 'tenant_id'>) => {
      const { data, error } = await supabase.from('financial_entries').insert({ ...entry, tenant_id: tenantId! }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financial-entries'] });
    },
  });
}
