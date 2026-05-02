"use client";

import { UserDetailContext } from "@/Context/UserDetailContext";
import supabase from "@/service/supabaseClient";
import React, { useEffect, useState, useContext } from "react";

function Provider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserFromDB = async (email) => {
      const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("email", email)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } else {
        setUser(data);
      }

      setLoading(false);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user?.email) {
        await fetchUserFromDB(session.user.email);
      } else {
        setUser(null);
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
