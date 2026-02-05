import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

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

describe("sessions router", () => {
  it("allows authenticated users to list sessions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sessions.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows authenticated users to create sessions", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.sessions.create({
      name: "Sessão de Teste",
      description: "Descrição de teste",
    });

    expect(result.success).toBe(true);
  });
});

describe("degrees router", () => {
  it("allows authenticated users to list degrees", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.degrees.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows authenticated users to create degrees", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.degrees.create({
      name: "Aprendiz",
      description: "Primeiro grau",
    });

    expect(result.success).toBe(true);
  });
});

describe("brothers router", () => {
  it("allows authenticated users to list brothers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.brothers.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows authenticated users to create brothers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.brothers.create({
      name: "João Silva",
      email: "joao@email.com",
    });

    expect(result.success).toBe(true);
  });

  it("supports filtering brothers by initial", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.brothers.list({ initial: "J" });

    expect(Array.isArray(result)).toBe(true);
  });
});

describe("workers router", () => {
  it("allows authenticated users to list workers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.workers.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows authenticated users to create workers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.workers.create({
      name: "Obreiro Teste",
    });

    expect(result.success).toBe(true);
  });
});

describe("powers router", () => {
  it("allows authenticated users to list powers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.powers.list();

    expect(Array.isArray(result)).toBe(true);
  });

  it("allows authenticated users to create powers", async () => {
    const { ctx } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.powers.create({
      name: "Grande Oriente do Brasil",
    });

    expect(result.success).toBe(true);
  });
});
