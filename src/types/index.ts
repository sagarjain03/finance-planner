export interface UserData {
  monthlySalary: string;
  fixedExpenses: string;
  savingsGoalAmount: string;
  goalDurationMonths: string;
}

export interface FormErrors {
  monthlySalary?: string;
  fixedExpenses?: string;
  savingsGoalAmount?: string;
  goalDurationMonths?: string;
}
