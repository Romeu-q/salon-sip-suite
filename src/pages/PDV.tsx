import { useState, useMemo } from 'react';
import { Search, Plus, Minus, ShoppingCart, X, UserPlus } from 'lucide-react';
import { useProducts, type Product } from '@/hooks/use-products';

interface CartItem {
  product: Product;
  qty: number;
}

export default function PDV() {
  const { data: products = [], isLoading } = useProducts();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [clientName, setClientName] = useState('');

  const categories = useMemo(() => ['Todos', ...Array.from(new Set(products.map(p => p.category)))], [products]);

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [products, search, activeCategory]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { product, qty: 1 }];
    });
  };

  const updateQty = (productId: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.product.id !== productId) return i;
      const newQty = i.qty + delta;
      return newQty > 0 ? { ...i, qty: newQty } : i;
    }).filter(i => i.qty > 0));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const total = cart.reduce((sum, i) => sum + i.product.sell_price * i.qty, 0);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-32" />
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex-1 p-4 md:p-6 space-y-4 overflow-y-auto">
        <div className="animate-fade-in-up">
          <h1 className="text-2xl font-bold">Cafeteria</h1>
          <p className="text-sm text-muted-foreground">Ponto de venda rápido</p>
        </div>

        <div className="relative animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar produto..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors active:scale-[0.97] ${
                activeCategory === cat
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((product, i) => (
            <button
              key={product.id}
              onClick={() => addToCart(product)}
              className="bg-card rounded-xl border border-border p-4 text-left transition-all hover:shadow-md active:scale-[0.97] animate-fade-in-up"
              style={{ animationDelay: `${0.05 * i}s` }}
            >
              <span className="text-2xl">{product.emoji}</span>
              <p className="font-medium text-sm mt-2">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.category}</p>
              <p className="text-sm font-semibold mt-1 gold-text">
                R$ {product.sell_price.toFixed(2)}
              </p>
              {product.stock_qty <= product.min_stock && (
                <span className="text-[10px] text-status-delayed font-medium">Estoque baixo</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:w-80 border-t lg:border-t-0 lg:border-l border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-sm">Comanda</h2>
            {cart.length > 0 && (
              <span className="ml-auto text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                {cart.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Vincular ao cliente..."
              value={clientName}
              onChange={e => setClientName(e.target.value)}
              className="flex-1 text-xs bg-transparent focus:outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <ShoppingCart className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-xs">Toque em um produto para adicionar</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2.5">
                <span className="text-lg">{item.product.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    R$ {item.product.sell_price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQty(item.product.id, -1)}
                    className="w-6 h-6 rounded-md bg-background flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-xs font-medium w-5 text-center tabular-nums">{item.qty}</span>
                  <button
                    onClick={() => updateQty(item.product.id, 1)}
                    className="w-6 h-6 rounded-md bg-background flex items-center justify-center hover:bg-muted active:scale-95 transition-all"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="w-6 h-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive active:scale-95 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-bold">R$ {total.toFixed(2)}</span>
          </div>
          <button
            disabled={cart.length === 0}
            className="w-full py-2.5 rounded-lg gold-gradient text-white text-sm font-medium transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Finalizar Venda
          </button>
          <button
            disabled={cart.length === 0 || !clientName}
            className="w-full py-2.5 rounded-lg border border-border text-sm font-medium transition-all hover:bg-secondary active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Adicionar à Comanda do Salão
          </button>
        </div>
      </div>
    </div>
  );
}
