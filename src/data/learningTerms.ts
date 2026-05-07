export interface LearningTerm {
  id: string;
  term: string;
  shortExplanation: string;
  detailedExplanation: string;
  example: string;
  category: 'investments' | 'savings' | 'budgeting' | 'taxes' | 'goals';
}

export const learningTerms: LearningTerm[] = [
  {
    id: 'mutual-funds',
    term: 'Mutual Funds',
    shortExplanation: 'A pool of money from many investors to buy stocks and bonds',
    detailedExplanation: 'A mutual fund is like a basket where many people pool their money together. A professional manager takes this combined money and invests it in stocks, bonds, or other securities. When you invest in a mutual fund, you own a small piece of all those investments. The advantage is that you get the benefit of professional management and diversification without needing a lot of money to start. For example, if the mutual fund goes up, your investment grows. If it goes down, you lose. The fund charges a small fee for managing your money.',
    example: 'If you invest ₹5,000 in a mutual fund with 100 other people, that ₹5,00,000 is invested by professionals across 50+ companies. You benefit without having to pick individual stocks.',
    category: 'investments',
  },
  {
    id: 'sip',
    term: 'SIP (Systematic Investment Plan)',
    shortExplanation: 'Investing a fixed amount regularly instead of one lump sum',
    detailedExplanation: 'SIP is a way to invest money in small, regular amounts (like ₹1,000 every month) instead of investing all your money at once. This strategy helps you avoid the risk of investing all your money when the market is at its peak. By investing regularly, you benefit from something called "rupee-cost averaging" - you buy more units when prices are low and fewer when prices are high. This can reduce your overall risk. It\'s like saving a little bit every month, but instead of keeping cash, you\'re investing it to potentially earn more.',
    example: 'Instead of investing ₹12,000 all at once in January, you invest ₹1,000 every month from January to December. This spreads your risk and helps you get better average prices.',
    category: 'investments',
  },
  {
    id: 'emergency-fund',
    term: 'Emergency Fund',
    shortExplanation: 'Money saved for unexpected expenses or job loss',
    detailedExplanation: 'An emergency fund is money you keep aside for unexpected situations like medical bills, car repairs, or job loss. Most experts recommend keeping 3-6 months of your monthly expenses in an emergency fund. This money should be easily accessible (like in a savings account), not invested in stocks. Having an emergency fund means you won\'t have to take a loan or use your credit card when something unexpected happens. It\'s like having a safety net for your finances.',
    example: 'If your monthly expenses are ₹30,000, you should have ₹90,000 to ₹1,80,000 in an emergency fund. If your car breaks down and costs ₹50,000, you can use this fund without stress.',
    category: 'savings',
  },
  {
    id: 'cagr',
    term: 'CAGR (Compound Annual Growth Rate)',
    shortExplanation: 'The annual rate at which your investment grows over time',
    detailedExplanation: 'CAGR shows how much your investment grows each year on average. It accounts for the fact that your money grows faster as time goes on because of compounding (earning money on your earnings). For example, if you invested ₹1,00,000 and it became ₹2,00,000 in 10 years, the CAGR would be about 7.2% per year. This is useful for comparing different investments or seeing if your wealth is growing as expected.',
    example: 'If your investment grew from ₹1,00,000 to ₹1,60,000 in 5 years, that\'s a CAGR of about 9.86% per year. This is better than keeping money in a savings account that earns only 3-4%.',
    category: 'investments',
  },
  {
    id: 'budget',
    term: 'Budget',
    shortExplanation: 'A plan showing your expected income and expenses',
    detailedExplanation: 'A budget is a plan for your money. It shows how much money you expect to earn (income) and how much you plan to spend (expenses). Creating a budget helps you control your spending, identify where your money goes, and make sure you\'re not spending more than you earn. A good budget includes categories like food, rent, entertainment, savings, and debt payments. Budgets can be monthly, quarterly, or yearly.',
    example: 'Your monthly budget might look like: Income ₹50,000 | Rent ₹15,000 | Food ₹8,000 | Transport ₹5,000 | Entertainment ₹3,000 | Savings ₹19,000. This way you know exactly how much you can spend on each thing.',
    category: 'budgeting',
  },
  {
    id: '50-30-20-rule',
    term: '50-30-20 Rule',
    shortExplanation: 'A budgeting rule: 50% needs, 30% wants, 20% savings',
    detailedExplanation: 'This is a simple budgeting guideline that divides your income into three parts: 50% for NEEDS (essentials like rent, food, utilities), 30% for WANTS (things you enjoy like entertainment, eating out), and 20% for SAVINGS and debt repayment. This ratio helps you balance spending and saving. However, this is just a guideline - your situation might be different based on your salary and expenses.',
    example: 'If you earn ₹1,00,000 per month: ₹50,000 for rent/food/utilities, ₹30,000 for movies/games/dining, and ₹20,000 to save or pay loans.',
    category: 'budgeting',
  },
  {
    id: 'tax',
    term: 'Income Tax',
    shortExplanation: 'Money you pay to the government from your earnings',
    detailedExplanation: 'Income tax is money you pay to the government from your earnings. The amount depends on how much you earn - the more you earn, the more tax you pay (in higher percentages). Governments use tax money to build roads, schools, hospitals, and provide services. In India, different income levels have different tax rates. If you earn below a certain threshold, you might not have to pay income tax at all.',
    example: 'If you earn ₹5,00,000 per year in India, you might pay 20% tax = ₹1,00,000. If you earn ₹3,00,000, you might pay 10% tax = ₹30,000.',
    category: 'taxes',
  },
  {
    id: 'tax-saving',
    term: 'Tax Saving (Tax Deductions)',
    shortExplanation: 'Money you save by reducing taxable income through investments',
    detailedExplanation: 'Tax savings means reducing the amount of tax you have to pay by using tax deductions allowed by the government. For example, if you invest in certain approved investments like life insurance, provident funds, or education funds, the government allows you to deduct this amount from your taxable income. This means you pay less tax. For example, if you earn ₹5,00,000 and invest ₹1,50,000 in tax-saving investments, you only pay tax on ₹3,50,000, saving you thousands in taxes.',
    example: 'You earn ₹5,00,000. You invest ₹1,50,000 in life insurance (Section 80C). Your taxable income becomes ₹3,50,000 instead of ₹5,00,000. This saves you about ₹45,000 in taxes (assuming 30% tax rate).',
    category: 'taxes',
  },
  {
    id: 'diversification',
    term: 'Diversification',
    shortExplanation: 'Spreading investments across different types to reduce risk',
    detailedExplanation: 'Diversification means not putting all your money in one place. Instead of investing everything in one company\'s stock or one mutual fund, you invest in multiple different investments. For example, you might invest in stocks, bonds, real estate, and gold. This way, if one investment loses value, others might still earn money, and your overall loss is reduced. It\'s like the saying "don\'t put all eggs in one basket."',
    example: 'Instead of investing all ₹1,00,000 in Tech stocks, you could invest ₹30,000 in stocks, ₹30,000 in bonds, ₹20,000 in real estate, and ₹20,000 in gold. This way, if tech stocks crash, your other investments can make up for it.',
    category: 'investments',
  },
  {
    id: 'inflation',
    term: 'Inflation',
    shortExplanation: 'The rate at which prices of things increase over time',
    detailedExplanation: 'Inflation means the general increase in prices of goods and services over time. For example, if inflation is 5%, something that cost ₹100 last year costs ₹105 this year. Inflation reduces your purchasing power - the same amount of money buys you less. This is why you need your investments to grow faster than inflation. If your money is just sitting in a savings account earning 3% interest but inflation is 5%, you\'re actually losing money in real value.',
    example: 'If inflation is 6% per year and you keep ₹1,00,000 in cash, next year it can only buy what ₹94,000 could buy this year. This is why investing is important - to beat inflation.',
    category: 'investments',
  },
  {
    id: 'compound-interest',
    term: 'Compound Interest',
    shortExplanation: 'Earning money on the money you earned (interest on interest)',
    detailedExplanation: 'Compound interest is when you earn interest not just on your original investment, but also on the interest you\'ve already earned. It\'s like your money earning money, and then that earnings earning money too. This is powerful over long periods. For example, if you invest ₹1,00,000 at 10% per year: Year 1 you earn ₹10,000 (total ₹1,10,000). Year 2 you earn ₹11,000 (10% of ₹1,10,000, not just the original ₹1,00,000). The longer you invest, the more powerful compound interest becomes.',
    example: 'Invest ₹50,000 at 12% annual return: Year 1: ₹56,000 | Year 5: ₹88,000 | Year 10: ₹1,54,000. The longer you wait, the bigger the growth.',
    category: 'investments',
  },
  {
    id: 'roi',
    term: 'ROI (Return on Investment)',
    shortExplanation: 'The profit you make from an investment as a percentage',
    detailedExplanation: 'ROI shows how much profit you made from your investment compared to what you invested. It\'s calculated as: (Profit / Investment) × 100. For example, if you invested ₹1,00,000 and made ₹10,000 profit, your ROI is 10%. Higher ROI is better, but you also need to consider the risk - very high ROI usually means higher risk.',
    example: 'You invest ₹1,00,000 in a business and earn ₹15,000 profit. Your ROI = (15,000 / 1,00,000) × 100 = 15%.',
    category: 'investments',
  },
  {
    id: 'goal-setting',
    term: 'Financial Goals',
    shortExplanation: 'Specific money targets you want to achieve in the future',
    detailedExplanation: 'Financial goals are specific targets for money you want to achieve. Examples include saving for a house, a car, education, retirement, or a vacation. Good financial goals are SMART: Specific (exactly what you want), Measurable (a clear amount), Achievable (realistic), Relevant (important to you), and Time-bound (by a specific date). Having clear goals helps you stay motivated and make better financial decisions.',
    example: '"I want to save ₹10,00,000 for a house down payment by 2030" is a good financial goal. "I want to be rich" is too vague.',
    category: 'goals',
  },
];
