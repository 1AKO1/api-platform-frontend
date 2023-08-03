/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import {loginUser} from "@/services/swagger/user";

export default function access(initialState: InitialState | undefined) {
  const { loginUser } = initialState ?? {};
  return {
    canUser: loginUser,
    canAdmin: loginUser?.userRole === 'admin',
  };
}
