import { getCurrentUser } from "@/lib/session";
import { getUserUsage } from "@/lib/user/action";
import { UserInfo } from "@/types/user";
import HomePage from "./homePage";

export default async function Page() {

  // 服务端获取数据， 传递客户端组件
  const user = (await getCurrentUser()) as UserInfo;
  let userUsage = null;

  if (user) {
    userUsage = await getUserUsage(user.userId)
  }

  return (
    <HomePage
      user={user}
      userUsage={userUsage}
    />
  );
}
