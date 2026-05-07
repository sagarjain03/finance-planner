import { ValidationError, Goal } from "@/types/financial";

export function validateFinancialInput(
  monthlySalary: number,
  needs: number,
  wants: number,
  goalAmount?: number,
  goalDuration?: number,
  goals?: Goal[]
): ValidationError[] {
  const errors: ValidationError[] = [];
  const monthlyExpenses = needs + wants;

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

  // Needs validation
  if (isNaN(needs) || needs < 0) {
    errors.push({
      field: "needs",
      message: "Needs (rent, food, bills) cannot be negative",
    });
  }

  // Wants validation
  if (isNaN(wants) || wants < 0) {
    errors.push({
      field: "wants",
      message: "Wants (shopping, entertainment) cannot be negative",
    });
  }

  // Legacy Goal validation (if goals array is empty/undefined)
  const hasGoalsArray = goals && goals.length > 0;
  
  if (!hasGoalsArray) {
    if (goalAmount !== undefined) {
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
    }

    if (goalDuration !== undefined) {
      if (isNaN(goalDuration) || goalDuration < 1) {
        errors.push({
          field: "goalDuration",
          message: "Goal duration must be at least 1 month",
        });
      }
    }

    if (goalAmount !== undefined && goalDuration !== undefined && goalDuration < 12 && goalAmount > monthlySalary * goalDuration * 10) {
      errors.push({
        field: "goalAmount",
        message: "Goal amount is too large for such a short timeframe. Consider a longer duration.",
      });
    }
  } else {
    // Multi-goal validation
    goals.forEach((goal, index) => {
      if (!goal.name || goal.name.trim() === '') {
        errors.push({ field: `goals[${index}].name`, message: "Goal name is required" });
      }
      if (isNaN(goal.amount) || goal.amount <= 0) {
        errors.push({ field: `goals[${index}].amount`, message: "Goal amount must be greater than 0" });
      }
      if (isNaN(goal.duration) || goal.duration < 1) {
        errors.push({ field: `goals[${index}].duration`, message: "Goal duration must be at least 1 month" });
      }
    });
  }

  return errors;
}

export function parseInputs(
  salary: string,
  needsStr: string,
  wantsStr: string,
  goalStr?: string,
  durationStr?: string,
  goalsArr?: any[]
): {
  monthlySalary: number;
  needs: number;
  wants: number;
  monthlyExpenses: number;
  goalAmount?: number;
  goalDuration?: number;
  goals?: Goal[];
} | null {
  try {
    const monthlySalary = parseFloat(salary);
    const parsedNeeds = parseFloat(needsStr);
    const parsedWants = parseFloat(wantsStr);

    if (
      isNaN(monthlySalary) ||
      isNaN(parsedNeeds) ||
      isNaN(parsedWants)
    ) {
      return null;
    }

    let parsedGoalAmount: number | undefined = undefined;
    let parsedGoalDuration: number | undefined = undefined;

    if (goalStr && durationStr) {
      parsedGoalAmount = parseFloat(goalStr);
      parsedGoalDuration = parseInt(durationStr, 10);
      if (isNaN(parsedGoalAmount) || isNaN(parsedGoalDuration)) {
        // Fallback to undefined if invalid, let validation handle it if no goals arr
        parsedGoalAmount = undefined;
        parsedGoalDuration = undefined;
      }
    }

    let parsedGoals: Goal[] | undefined = undefined;
    if (goalsArr && Array.isArray(goalsArr)) {
      parsedGoals = goalsArr.map(g => ({
        id: g.id || crypto.randomUUID(),
        name: String(g.name || ''),
        amount: parseFloat(g.amount),
        duration: parseInt(g.duration, 10),
        createdAt: g.createdAt ? new Date(g.createdAt) : new Date()
      }));
    }

    return {
      monthlySalary,
      needs: parsedNeeds,
      wants: parsedWants,
      monthlyExpenses: parsedNeeds + parsedWants,
      goalAmount: parsedGoalAmount,
      goalDuration: parsedGoalDuration,
      goals: parsedGoals,
    };
  } catch {
    return null;
  }
}
