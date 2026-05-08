export interface UserData {
  monthlySalary: string;
  needs: string;
  wants: string;
  savingsGoalAmount: string;
  goalDurationMonths: string;
}

export interface FormErrors {
  monthlySalary?: string;
  needs?: string;
  wants?: string;
  savingsGoalAmount?: string;
  goalDurationMonths?: string;
  goals?: string;
  [key: string]: string | undefined; // Support dynamic error keys like goal_0_name, goal_0_amount, etc.
}

export interface Goal {
  id: string;
  name: string;
  amount: number;
  duration: number;
}

export interface PlanData {
  monthlySalary: number;
  needs: number;
  wants: number;
  // Legacy fields (some parts of the app use these)
  monthlyExpenses?: number;
  goalAmount?: number;
  goalDuration?: number;
  // New format supports multiple goals
  goals?: Goal[];
}
