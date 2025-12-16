import { listBilling } from "@/lib/billing/action";
import { getCurrentUser } from "@/lib/session";
import { UserInfo } from "@/types/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1');
  const pageSize = parseInt(searchParams.get('pageSize') || '10');

  const userInfo = await getCurrentUser() as UserInfo;
  const data = await listBilling(page, pageSize, userInfo.userId);

  return NextResponse.json({
    success: true,
    data: {
      billingList: data.billingList,
      total: data.total
    },
    message: '查询成功',
    code: 200
  });
}
