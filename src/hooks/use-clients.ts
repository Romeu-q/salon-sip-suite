import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type Client = Tables<'clients'>;

export function useClients() {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['clients', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.from('clients').select('*').order('name');
      if (error) throw error;
      return data as Client[];
    },
    enabled: !!tenantId,
  });
}

export function useAddClient() {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();
  return useMutation({
    mutationFn: async (client: Omit<TablesInsert<'clients'>, 'tenant_id'>) => {
      const { data, error } = await supabase.from('clients').insert({ ...client, tenant_id: tenantId! }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}
