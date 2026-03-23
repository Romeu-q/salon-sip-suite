import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type Product = Tables<'products'>;

export function useProducts() {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['products', tenantId],
    queryFn: async () => {
      const { data, error } = await supabase.from('products').select('*').order('category, name');
      if (error) throw error;
      return data as Product[];
    },
    enabled: !!tenantId,
  });
}
