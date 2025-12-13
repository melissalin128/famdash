import { supabase } from "./supabaseClient";

export const base44 = {
  auth: {
    async signIn({ email, password }) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    async signUp({ email, password }) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },

    async signOut() {
      await supabase.auth.signOut();
    },

    async getUser() {
      const { data } = await supabase.auth.getUser();
      return data?.user ?? null;
    },
  },
};
