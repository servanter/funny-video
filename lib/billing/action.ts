import prisma from "@/lib/prisma";
import { Billing } from "@prisma/client";

export class BillingResult {
  billingList: Billing[];
  total: number;

  constructor(billingList: Billing[], total: number) {
    this.billingList = billingList;
    this.total = total;
  }
}

export async function listBilling(page: number, pageSize: number, userId: string): Promise<BillingResult> {
  const skip = (page - 1) * pageSize;

  const list = await prisma.billing.findMany({
    where: {
      user_id: userId
    },
    skip: skip,
    take: pageSize,
    orderBy: {
      create_time: 'desc'
    }
  });

  const total = await prisma.billing.count({
    where: {
      user_id: userId
    }
  });

  return new BillingResult(list, total);
}

export async function addBilling(
  userId: string,
  amount: number,
  orderId: string
): Promise<{ success: boolean; billing?: Billing; error?: string }> {
  try {
    const billing = await prisma.billing.create({
      data: {
        user_id: userId,
        amount: amount,
        order_id: orderId,
        ip_address: "",
        create_time: new Date(),
        update_time: new Date()
      }
    });
    
    return { success: true, billing };
  } catch (error) {
    console.error('Error creating billing record:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
