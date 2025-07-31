import { auth } from "@/lib/auth/config";
import { toNextJsHandler } from "better-auth/next-js";

const { GET, POST } = toNextJsHandler(auth);

export { GET, POST };
