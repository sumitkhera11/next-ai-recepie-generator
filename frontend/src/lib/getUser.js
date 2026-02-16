import { checkUserServer } from "@/lib/checkUserServer";

export async function getUser() {
  return await checkUserServer();
}
