import { ValidationError } from "@/types/financial";

export function validateFinancialInput(
  monthlySalary: number,
  monthlyExpenses: number,
  goalAmount: number,
  goalDuration: number
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Salary validation
  if (isNaN(monthlySalary) || monthlySalary < 0) {
    errors.push({
      field: "monthlySalary",
      message: "Monthly salary must be a positive number",
    });
  }

  if (monthlySalary === 0) {
    errors.push({
      field: "monthlySalary",
      message: "Monthly salary cannot be zero",
    });
  }

  // Expenses validation
  if (isNaN(monthlyExpenses) || monthlyExpenses < 0) {
    errors.push({
      field: "monthlyExpenses",
      message: "Monthly expenses cannot be negative",
    });
  }

  // Goal amount validation
  if (isNaN(goalAmount) || goalAmount < 0) {
    errors.push({
      field: "goalAmount",
      message: "Goal amount must be a positive number",
    });
  }

  if (goalAmount === 0) {
    errors.push({
      field: "goalAmount",
      message: "Goal amount cannot be zero",
    });
  }

  // Duration validation
  if (isNaN(goalDuration) || goalDuration < 1) {
    errors.push({
      field: "goalDuration",
      message: "Goal duration must be at least 1 month",
    });
  }

  // Cross-field validation: expenses vs salary
  if (monthlyExpenses >= monthlySalary && monthlySalary > 0) {
    errors.push({
      field: "monthlyExpenses",
      message: "Monthly expenses must be less than salary to have savings",
    });
  }

  // Edge case: very short goal with large amount
  if (goalDuration < 12 && goalAmount > monthlySalary * goalDuration * 10) {
    errors.push({
      field: "goalAmount",
      message: "Goal amount is too large for such a short timeframe. Consider a longer duration.",
    });
  }

  return errors;
}

export function parseInputs(
  salary: string,
  expenses: string,
  goal: string,
  duration: string
): {
  monthlySalary: number;
  monthlyExpenses: number;
  goalAmount: number;
  goalDuration: number;
} | null {
  try {
    const monthlySalary = parseFloat(salary);
    const monthlyExpenses = parseFloat(expenses);
    const goalAmount = parseFloat(goal);
    const goalDuration = parseInt(duration, 10);

    if (
      isNaN(monthlySalary) ||
      isNaN(monthlyExpenses) ||
      isNaN(goalAmount) ||
      isNaN(goalDuration)
    ) {
      return null;
    }

    return {
      monthlySalary,
      monthlyExpenses,
      goalAmount,
      goalDuration,
    };
  } catch {
    return null;
  }
}
