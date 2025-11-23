"use server";

import { db } from "@/lib/prisma";
import { subDays } from "date-fns";

const USER_ID = "287b5229-2c5c-493b-a66a-32d4b5684724";
const ACCOUNT_ID = "90ab7029-de8f-4b13-a05c-db4bad3555eeS";

const CATEGORIES = {
  INCOME: [
    { name: "salary", range: [5000, 8000] },
    { name: "freelance", range: [1000, 3000] },
    { name: "investments", range: [500, 2000] },
    { name: "other-income", range: [100, 1000] },
  ],
  EXPENSE: [
    { name: "housing", range: [1000, 2000] },
    { name: "transportation", range: [100, 500] },
    { name: "groceries", range: [200, 600] },
    { name: "utilities", range: [100, 300] },
    { name: "entertainment", range: [50, 200] },
    { name: "food", range: [50, 150] },
    { name: "shopping", range: [100, 500] },
    { name: "healthcare", range: [100, 1000] },
    { name: "education", range: [200, 1000] },
    { name: "travel", range: [500, 2000] },
  ],
};

function getRandomAmount(min, max) {
  return Number((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomCategory(type) {
  const categories = CATEGORIES[type];
  const category = categories[Math.floor(Math.random() * categories.length)];
  const amount = getRandomAmount(category.range[0], category.range[1]);
  return { category: category.name, amount };
}

export async function seedTransactions() {
  try {
    // ✅ Ensure user exists
    let user = await db.user.findUnique({ where: { id: USER_ID } });
    if (!user) {
      user = await db.user.create({
        data: {
          id: USER_ID,
          name: "Demo User",
          email: "demo@example.com",
        },
      });
    }

    // ✅ Ensure account exists
    let account = await db.account.findUnique({ where: { id: ACCOUNT_ID } });
    if (!account) {
      account = await db.account.create({
        data: {
          id: ACCOUNT_ID,
          name: "Main Account",
          type: "SAVINGS",
          balance: 0,
          userId: USER_ID,
        },
      });
    }

    // ✅ Generate 90 days of transactions
    const transactions = [];
    let totalBalance = 0;

    for (let i = 90; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const transactionsPerDay = Math.floor(Math.random() * 3) + 1;

      for (let j = 0; j < transactionsPerDay; j++) {
        const type = Math.random() < 0.4 ? "INCOME" : "EXPENSE";
        const { category, amount } = getRandomCategory(type);

        transactions.push({
          id: crypto.randomUUID(),
          type,
          amount,
          description: `${type === "INCOME" ? "Received" : "Paid for"} ${category}`,
          date,
          category,
          status: "COMPLETED",
          userId: USER_ID,
          accountId: ACCOUNT_ID,
          createdAt: date,
          updatedAt: date,
        });

        totalBalance += type === "INCOME" ? amount : -amount;
      }
    }

    // ✅ Insert transactions and update balance
    await db.$transaction(async (tx) => {
      await tx.transaction.deleteMany({ where: { accountId: ACCOUNT_ID } });
      await tx.transaction.createMany({ data: transactions });
      await tx.account.update({
        where: { id: ACCOUNT_ID },
        data: { balance: totalBalance },
      });
    });

    console.log(`✅ Seeded ${transactions.length} transactions.`);
    return { success: true, message: `Created ${transactions.length} transactions` };
  } catch (error) {
    console.error("Error seeding transactions:", error);
    return { success: false, error: error.message };
  }
}
