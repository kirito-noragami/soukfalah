import { supabase } from '../../services/supabase';

export const authApi = {
  login: async ({ username, password }) => {
    // username is the email in production
    const { data, error } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });
    if (error) throw error;
    return data.user;
  },

  register: async ({ fullName, email, password, role }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName, role }
      }
    });
    if (error) throw error;

    // Create profile row
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email,
      role: role || 'buyer',
      status: 'pending',
    });

    return data.user;
  },

  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  getSession: async () => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    if (error) throw error;
    return data;
  },
};