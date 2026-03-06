import { supabase } from './supabase';

export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

export const hasRole = async (role) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return false;
  const { data } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();
  return data?.role === role;
};