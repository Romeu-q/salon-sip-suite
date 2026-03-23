import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function Signup() {
  const [fullName, setFullName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, tenant_name: tenantName || 'Meu Salão' },
        emailRedirectTo: window.location.origin,
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Erro no cadastro', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Conta criada!', description: 'Verifique seu email para confirmar o cadastro.' });
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm space-y-8 animate-fade-in-up">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
            <Scissors className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold">Criar Conta</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure seu salão em minutos</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Seu nome</label>
            <Input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Nome completo" required />
          </div>
          <div>
            <label className="text-sm font-medium">Nome do Salão</label>
            <Input value={tenantName} onChange={e => setTenantName(e.target.value)} placeholder="Ex: Beleza Studio" />
          </div>
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="text-sm font-medium">Senha</label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Criando...' : 'Criar conta'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
