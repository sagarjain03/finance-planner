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
