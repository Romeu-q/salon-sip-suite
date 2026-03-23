import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type Professional = Tables<'professionals'>;

export function useProfessionals() {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['professionals', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.from('professionals').select('*').order('name');
      if (error) throw error;
      return data as Professional[];
    },
    enabled: !!tenantId,
  });
}

export function useAddProfessional() {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();
  return useMutation({
    mutationFn: async (professional: Omit<TablesInsert<'professionals'>, 'tenant_id'>) => {
      const { data, error } = await supabase.from('professionals').insert({ ...professional, tenant_id: tenantId! }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
}
