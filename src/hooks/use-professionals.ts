import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

export type Professional = Tables<'professionals'>;

export function useProfessionals() {
  return useQuery({
    queryKey: ['professionals'],
    queryFn: async () => {
      const { data, error } = await supabase.from('professionals').select('*').order('name');
      if (error) throw error;
      return data as Professional[];
    },
  });
}

export function useAddProfessional() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (professional: TablesInsert<'professionals'>) => {
      const { data, error } = await supabase.from('professionals').insert(professional).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['professionals'] });
    },
  });
}
