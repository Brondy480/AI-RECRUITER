"use client";

import { UserDetailContext } from "@/Context/UserDetailContext";
import supabase from "@/service/supabaseClient";
import React, { useEffect, useState, useContext } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFromDB = async (email, authUser) => {
      const meta = authUser?.user_metadata ?? {};
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .single();

      if (!data || error?.code === "PGRST116") {
        const { data: newUser, error: insertError } = await supabase
          .from("Users")
          .insert([{ email: email, credits: 10 }])
          .select()
          .single();
        if (!insertError) setUser({ ...newUser, name: meta.full_name, picture: meta.avatar_url });
        setLoading(false);
        return;
      }

      if (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } else {
        setUser({ ...data, name: meta.full_name, picture: meta.avatar_url });
      }

      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        await fetchUserFromDB(session.user.email, session.user);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        fetchUserFromDB(session.user.email, session.user);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <UserDetailContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  return useContext(UserDetailContext);
};
