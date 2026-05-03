"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { UserData } from "@/types";

interface UserDataContextType {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  resetUserData: () => void;
  isComplete: boolean;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

const INITIAL_STATE: UserData = {
  monthlySalary: "",
  fixedExpenses: "",
  savingsGoalAmount: "",
  goalDurationMonths: "",
};

const STORAGE_KEY = "finance-planner-user-data";

export function UserDataProvider({ children }: { children: React.ReactNode }) {
  const [userData, setUserData] = useState<UserData>(INITIAL_STATE);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load data from sessionStorage on mount
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem(STORAGE_KEY);
      if (storedData) {
        setUserData(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Error loading user data from sessionStorage:", error);
    }
    setIsHydrated(true);
  }, []);

  const updateUserData = useCallback((data: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...data };
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error("Error saving user data to sessionStorage:", error);
      }
      return updated;
    });
  }, []);

  const resetUserData = useCallback(() => {
    setUserData(INITIAL_STATE);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing sessionStorage:", error);
    }
  }, []);

  const isComplete =
    userData.monthlySalary !== "" &&
    userData.fixedExpenses !== "" &&
    userData.savingsGoalAmount !== "" &&
    userData.goalDurationMonths !== "";

  return (
    <UserDataContext.Provider
      value={{
        userData,
        updateUserData,
        resetUserData,
        isComplete,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
}

export function useUserData() {
  const context = useContext(UserDataContext);
  if (context === undefined) {
    throw new Error("useUserData must be used within UserDataProvider");
  }
  return context;
}
