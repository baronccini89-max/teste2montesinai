import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { TRPCError } from "@trpc/server";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext(role: "admin" | "user" = "user"): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@montesinai.com",
    name: "Test User",
    loginMethod: "local",
    role,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("users router - admin access", () => {
  it("allows admin to list users", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("blocks non-admin from listing users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(caller.users.list()).rejects.toThrow();
  });

  it("allows admin to create users", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.create({
      name: "Novo Usuário",
      email: `test-${Date.now()}@montesinai.com`,
      password: "senha123",
      role: "user",
    });

    expect(result.success).toBe(true);
  });

  it("blocks non-admin from creating users", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.users.create({
        name: "Novo Usuário",
        email: "novo@montesinai.com",
        password: "senha123",
        role: "user",
      })
    ).rejects.toThrow();
  });

  it("allows admin to update user role", async () => {
    const { ctx } = createAuthContext("admin");
    const caller = appRouter.createCaller(ctx);

    const result = await caller.users.updateRole({
      id: 2,
      role: "admin",
    });

    expect(result.success).toBe(true);
  });

  it("blocks non-admin from updating user role", async () => {
    const { ctx } = createAuthContext("user");
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.users.updateRole({
        id: 2,
        role: "admin",
      })
    ).rejects.toThrow();
  });
});
