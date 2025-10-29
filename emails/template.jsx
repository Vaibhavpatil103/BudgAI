import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

// Dummy data for preview
const PREVIEW_DATA = {
  monthlyReport: {
    userName: "John Doe",
    type: "monthly-report",
    data: {
      month: "December",
      stats: {
        totalIncome: 5000,
        totalExpenses: 3500,
        byCategory: {
          housing: 1500,
          groceries: 600,
          transportation: 400,
          entertainment: 300,
          utilities: 700,
        },
      },
      insights: [
        "Your housing expenses are 43% of your total spending - consider reviewing your housing costs.",
        "Great job keeping entertainment expenses under control this month!",
        "Setting up automatic savings could help you save 20% more of your income.",
      ],
    },
  },
  budgetAlert: {
    userName: "Jane Smith",
    type: "budget-alert",
    data: {
      percentageUsed: 85,
      budgetAmount: 4000,
      totalExpenses: 3400,
    },
  },
};

// Safe data access helper functions
const getMonthlyReportData = (data) => {
  return {
    month: data?.month || "Current Month",
    stats: {
      totalIncome: data?.stats?.totalIncome || 0,
      totalExpenses: data?.stats?.totalExpenses || 0,
      byCategory: data?.stats?.byCategory || {},
    },
    insights: data?.insights || [],
  };
};

const getBudgetAlertData = (data) => {
  return {
    percentageUsed: data?.percentageUsed || 0,
    budgetAmount: data?.budgetAmount || 0,
    totalExpenses: data?.totalExpenses || 0,
  };
};

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  // Safe data extraction
  const safeData = type === "monthly-report" 
    ? getMonthlyReportData(data)
    : getBudgetAlertData(data);

  if (type === "monthly-report") {
    const monthlyData = safeData;
    const netAmount = monthlyData.stats.totalIncome - monthlyData.stats.totalExpenses;

    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName || "there"},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {monthlyData.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Total Income</Text>
                <Text style={styles.statValue}>${monthlyData.stats.totalIncome}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Total Expenses</Text>
                <Text style={styles.statValue}>${monthlyData.stats.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Net</Text>
                <Text style={styles.statValue}>${netAmount}</Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {monthlyData.stats.byCategory && Object.keys(monthlyData.stats.byCategory).length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.sectionHeading}>Expenses by Category</Heading>
                {Object.entries(monthlyData.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{formatCategoryName(category)}</Text>
                      <Text style={styles.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {monthlyData.insights && monthlyData.insights.length > 0 && (
              <Section style={styles.section}>
                <Heading style={styles.sectionHeading}>Welth Insights</Heading>
                {monthlyData.insights.map((insight, index) => (
                  <Text key={index} style={styles.insightText}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using Welth. Keep tracking your finances for better
              financial health!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    const budgetData = safeData;
    const remainingAmount = budgetData.budgetAmount - budgetData.totalExpenses;

    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName || "there"},</Text>
            <Text style={styles.text}>
              You&rsquo;ve used {budgetData.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Budget Amount</Text>
                <Text style={styles.statValue}>${budgetData.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Spent So Far</Text>
                <Text style={styles.statValue}>${budgetData.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.statLabel}>Remaining</Text>
                <Text style={styles.statValue}>${remainingAmount}</Text>
              </div>
            </Section>
            <Text style={styles.footer}>
              Consider reviewing your spending to stay within budget.
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  // Fallback for unknown email types
  return (
    <Html>
      <Head />
      <Preview>Financial Update</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.title}>Financial Update</Heading>
          <Text style={styles.text}>Hello {userName || "there"},</Text>
          <Text style={styles.text}>
            There seems to be an issue with your email content. Please contact support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Helper function to format category names
function formatCategoryName(category) {
  const categoryMap = {
    housing: "Housing",
    groceries: "Groceries",
    transportation: "Transportation",
    entertainment: "Entertainment",
    utilities: "Utilities",
  };
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  },
  title: {
    color: "#1f2937",
    fontSize: "24px",
    fontWeight: "bold",
    textAlign: "center",
    margin: "0 0 20px",
  },
  sectionHeading: {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0 0 16px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "0 0 16px",
  },
  insightText: {
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: "1.5",
    margin: "8px 0",
    paddingLeft: "16px",
  },
  section: {
    marginTop: "24px",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
    border: "1px solid #e5e7eb",
  },
  statsContainer: {
    margin: "24px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "5px",
  },
  stat: {
    marginBottom: "12px",
    padding: "12px",
    backgroundColor: "#fff",
    borderRadius: "4px",
    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "14px",
    margin: "0 0 4px",
  },
  statValue: {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
    margin: "0",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 0",
    borderBottom: "1px solid #e5e7eb",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "24px",
    paddingTop: "16px",
    borderTop: "1px solid #e5e7eb",
  },
};