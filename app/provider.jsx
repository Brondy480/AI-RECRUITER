"use client";
import { UserDetailContext } from "@/Context/UserDetailContext";
import supabase from "@/service/supabaseClient";
import React, { useEffect, useState, useContext } from "react";

function Provider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ⭐ SIMPLE: Just get the session ONCE and that's it
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user from database
        const { data: users } = await supabase
          .from("Users")
          .select("*")
          .eq("email", session.user.email);
          
        if (users && users.length > 0) {
          setCurrentUser(users[0]);
        }
      }
      
      setLoading(false); // ⭐ Set to false ONCE and never touch it again
    };

    getUser();
    
    // ⭐ NO AUTH LISTENER AT ALL - this is what's causing the problem
    
  }, []); // ⭐ Empty dependency - runs ONCE only

  return (
    <UserDetailContext.Provider
      value={{ user: currentUser, setUser: setCurrentUser, loading }}
    >
      {children}
    </UserDetailContext.Provider>
  );
}

export default Provider;

export const useUser = () => {
  return useContext(UserDetailContext);
};