import { auth } from "@/lib/auth";

export const GET = async (request) => {
  return auth.handler(request);
};

export const POST = async (request) => {
  return auth.handler(request);
};
