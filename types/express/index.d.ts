import { User as PrismaUser } from "@prisma/client";

declare global {
  namespace Express {
    export interface User extends PrismaUser {}
  }
}

export {};
