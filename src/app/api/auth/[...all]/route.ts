import { auth } from "@/lib/auth/auth";
import {toNextJsHandler} from "better-auth/next-js";

// on convertit le handler de Better Auth en un handler Next.js
export const { GET, POST } = toNextJsHandler(auth);
