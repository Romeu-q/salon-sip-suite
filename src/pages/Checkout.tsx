import { useState, useMemo } from 'react';
import { useOrders, useUpdateOrder, useOrderServiceItems, useOrderProductItems } from '@/hooks/use-orders';
import { useProfessionals } from '@/hooks/use-professionals';
import { ShoppingCart, CreditCard, DollarSign, Smartphone, Banknote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAddFinancialEntry } from '@/hooks/use-financial';

const paymentMethods = [
  { value: 'cash', label: 'Dinheiro', icon: Banknote },
  { value: 'debit', label: 'Débito', icon: CreditCard },
  { value: 'credit', label: 'Crédito', icon: CreditCard },
  { value: 'pix', label: 'Pix', icon: Smartphone },
];

export default function Checkout() {
  const { data: orders = [], isLoading } = useOrders('open');
  const { data: professionals = [] } = useProfessionals();
  const updateOrder = useUpdateOrder();
  const addFinancial = useAddFinancialEntry();
  const { toast } = useToast();

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [discountStr, setDiscountStr] = useState('0');

  const selectedOrder = orders.find(o => o.id === selectedOrderId);
  const { data: serviceItems = [] } = useOrderServiceItems(selectedOrderId ?? undefined);
  const { data: productItems = [] } = useOrderProductItems(selectedOrderId ?? undefined);

  const subtotal = useMemo(() => {
    const servicesTotal = serviceItems.reduce((s, i) => s + Number(i.price), 0);
    const productsTotal = productItems.reduce((s, i) => s + Number(i.unit_price) * i.quantity, 0);
    return servicesTotal + productsTotal;
  }, [serviceItems, productItems]);

  const discount = Number(discountStr) || 0;
  const total = Math.max(subtotal - discount, 0);

  const handleClose = async () => {
    if (!selectedOrderId) return;
    try {
      await updateOrder.mutateAsync({
        id: selectedOrderId,
        status: 'closed' as any,
        total,
        discount,
        payment_method: paymentMethod,
        closed_at: new Date().toISOString(),
      });
      await addFinancial.mutateAsync({
        type: 'income' as any,
        category: 'Venda',
        description: `Comanda fechada`,
        amount: total,
        date: new Date().toISOString().split('T')[0],
        order_id: selectedOrderId,
      });
      toast({ title: 'Comanda fechada com sucesso!' });
      setSelectedOrderId(null);
    } catch (err: any) {
      toast({ title: 'Erro', description: err.message, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          {[1, 2, 3].map(i => <div key={i} className="h-20 bg-muted rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="animate-fade-in-up">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <p className="text-sm text-muted-foreground">{orders.length} comanda(s) aberta(s)</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Open orders list */}
        <div className="space-y-3 animate-fade-in-up">
          <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Comandas Abertas</h2>
          {orders.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center text-muted-foreground text-sm">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-30" />
              Nenhuma comanda aberta
            </div>
          ) : (
            orders.map(order => (
              <button
                key={order.id}
                onClick={() => setSelectedOrderId(order.id)}
                className={`w-full text-left bg-card rounded-xl border p-4 transition-all hover:shadow-md ${
                  selectedOrderId === order.id ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Comanda #{order.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleString('pt-BR')}
                    </p>
                  </div>
                  <span className="text-sm font-semibold gold-text">R$ {Number(order.total).toFixed(2)}</span>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Checkout panel */}
        {selectedOrder && (
          <div className="bg-card rounded-xl border border-border p-5 space-y-5 animate-slide-in-right">
            <h2 className="font-semibold">Fechar Comanda</h2>

            {serviceItems.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Serviços</h3>
                {serviceItems.map(item => (
                  <div key={item.id} className="flex justify-between py-1.5 text-sm">
                    <span>Serviço</span>
                    <span className="tabular-nums">R$ {Number(item.price).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            {productItems.length > 0 && (
              <div>
                <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Cafeteria</h3>
                {productItems.map(item => (
                  <div key={item.id} className="flex justify-between py-1.5 text-sm">
                    <span>{item.quantity}x Produto</span>
                    <span className="tabular-nums">R$ {(Number(item.unit_price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-border pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="tabular-nums">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Desconto (R$)</span>
                <Input
                  type="number"
                  min="0"
                  value={discountStr}
                  onChange={e => setDiscountStr(e.target.value)}
                  className="w-24 h-8 text-right"
                />
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
                <span>Total</span>
                <span className="gold-text">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-medium text-muted-foreground uppercase mb-2">Forma de Pagamento</h3>
              <div className="grid grid-cols-2 gap-2">
                {paymentMethods.map(pm => (
                  <button
                    key={pm.value}
                    onClick={() => setPaymentMethod(pm.value)}
                    className={`flex items-center gap-2 p-3 rounded-lg border text-sm transition-all ${
                      paymentMethod === pm.value
                        ? 'border-primary bg-primary/10 text-primary font-medium'
                        : 'border-border hover:bg-secondary/50'
                    }`}
                  >
                    <pm.icon className="w-4 h-4" />
                    {pm.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleClose}
              className="w-full"
              disabled={updateOrder.isPending}
            >
              {updateOrder.isPending ? 'Fechando...' : `Fechar Comanda — R$ ${total.toFixed(2)}`}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
