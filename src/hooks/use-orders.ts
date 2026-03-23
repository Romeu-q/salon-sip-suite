import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useAuth } from './use-auth';

export type Order = Tables<'orders'>;

export function useOrders(status?: string) {
  const { tenantId } = useAuth();
  return useQuery({
    queryKey: ['orders', status, tenantId],
    queryFn: async () => {
      let query = supabase.from('orders').select('*');
      if (status) query = query.eq('status', status);
      const { data, error } = await query.order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!tenantId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const { tenantId } = useAuth();
  return useMutation({
    mutationFn: async (order: Omit<TablesInsert<'orders'>, 'tenant_id'>) => {
      const { data, error } = await supabase.from('orders').insert({ ...order, tenant_id: tenantId! }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useUpdateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Tables<'orders'>>) => {
      const { data, error } = await supabase.from('orders').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrderServiceItems(orderId?: string) {
  return useQuery({
    queryKey: ['order-service-items', orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from('order_service_items').select('*').eq('order_id', orderId!);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}

export function useOrderProductItems(orderId?: string) {
  return useQuery({
    queryKey: ['order-product-items', orderId],
    queryFn: async () => {
      const { data, error } = await supabase.from('order_product_items').select('*').eq('order_id', orderId!);
      if (error) throw error;
      return data;
    },
    enabled: !!orderId,
  });
}
