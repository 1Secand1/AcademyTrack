import { getCookie } from "../utils/cookie";
export async function getUserGroup() {
  try {
    const response = await fetch("http://localhost:80/studentUserGroups", {
      method: "GET",
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: `Bearer ${getCookie("token")}`,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(`HTTP error! ${error}`)
  }
}
