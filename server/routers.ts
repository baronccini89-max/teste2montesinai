import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import * as db from "./db";
import { hashPassword, verifyPassword } from "./utils/password";
import { generateCertificatePDF } from "./utils/certificatePdfGenerator";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso negado. Apenas administradores." });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),

    login: publicProcedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await db.getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos" });
        }
        
        const valid = await verifyPassword(input.password, user.password);
        if (!valid) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Email ou senha inválidos" });
        }

        // Update last signed in
        await db.upsertUser({ ...user, lastSignedIn: new Date() });

        return { success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
      }),

    register: publicProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Email já cadastrado" });
        }

        const hashedPassword = await hashPassword(input.password);
        await db.upsertUser({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          loginMethod: "local",
          role: "user",
        });

        return { success: true };
      }),
  }),

  users: router({
    list: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),

    create: adminProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6),
        role: z.enum(["user", "admin"]),
      }))
      .mutation(async ({ input }) => {
        const existing = await db.getUserByEmail(input.email);
        if (existing) {
          throw new TRPCError({ code: "CONFLICT", message: "Email já cadastrado" });
        }

        const hashedPassword = await hashPassword(input.password);
        await db.upsertUser({
          name: input.name,
          email: input.email,
          password: hashedPassword,
          loginMethod: "local",
          role: input.role,
        });

        return { success: true };
      }),

    updateRole: adminProcedure
      .input(z.object({ id: z.number(), role: z.enum(["user", "admin"]) }))
      .mutation(async ({ input }) => {
        await db.updateUserRole(input.id, input.role);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (input.id === ctx.user.id) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Não é possível deletar seu próprio usuário" });
        }
        await db.deleteUser(input.id);
        return { success: true };
      }),
  }),

  sessions: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllSessions();
    }),

    create: protectedProcedure
      .input(z.object({ name: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.createSession(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.updateSession(input.id, { name: input.name, description: input.description });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteSession(input.id);
        return { success: true };
      }),
  }),

  degrees: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllDegrees();
    }),

    create: protectedProcedure
      .input(z.object({ name: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.createDegree(input);
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string(), description: z.string().optional() }))
      .mutation(async ({ input }) => {
        await db.updateDegree(input.id, { name: input.name, description: input.description });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteDegree(input.id);
        return { success: true };
      }),
  }),

  brothers: router({
    list: protectedProcedure
      .input(z.object({ initial: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllBrothers(input?.initial);
      }),

    create: protectedProcedure
      .input(z.object({ name: z.string(), email: z.string().email().optional() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.createBrother({ ...input, initials });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string(), email: z.string().email().optional() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.updateBrother(input.id, { name: input.name, email: input.email, initials });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteBrother(input.id);
        return { success: true };
      }),
  }),

  workers: router({
    list: protectedProcedure
      .input(z.object({ initial: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllWorkers(input?.initial);
      }),

    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.createWorker({ ...input, initials });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.updateWorker(input.id, { name: input.name, initials });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteWorker(input.id);
        return { success: true };
      }),
  }),

  powers: router({
    list: protectedProcedure
      .input(z.object({ initial: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return await db.getAllPowers(input?.initial);
      }),

    create: protectedProcedure
      .input(z.object({ name: z.string() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.createPower({ ...input, initials });
        return { success: true };
      }),

    update: protectedProcedure
      .input(z.object({ id: z.number(), name: z.string() }))
      .mutation(async ({ input }) => {
        const initials = input.name.charAt(0).toUpperCase();
        await db.updatePower(input.id, { name: input.name, initials });
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deletePower(input.id);
        return { success: true };
      }),
  }),

  certificates: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllCertificates();
    }),

    generate: protectedProcedure
      .input(z.object({
        sessionName: z.string(),
        degreeName: z.string(),
        brotherName: z.string(),
        brotherEmail: z.string().email().optional(),
        workerName: z.string(),
        powerName: z.string(),
        certificateDate: z.date(),
      }))
      .mutation(async ({ input, ctx }) => {
        // Generate PDF
        const pdfBuffer = await generateCertificatePDF({
          session: input.sessionName,
          degree: input.degreeName,
          brother: input.brotherName,
          worker: input.workerName,
          power: input.powerName,
          date: input.certificateDate,
        });

        // Upload to S3
        const fileName = `certificado-${input.brotherName.replace(/\s+/g, "-")}-${nanoid(8)}.pdf`;
        const { url: pdfUrl } = await storagePut(
          `certificates/${fileName}`,
          pdfBuffer,
          "application/pdf"
        );

        // Save to database
        await db.createCertificate({
          sessionName: input.sessionName,
          degreeName: input.degreeName,
          brotherName: input.brotherName,
          brotherEmail: input.brotherEmail,
          workerName: input.workerName,
          powerName: input.powerName,
          certificateDate: input.certificateDate,
          pdfUrl,
          createdBy: ctx.user.id,
        });

        return { success: true, pdfUrl, fileName };
      }),

    sendEmail: protectedProcedure
      .input(z.object({
        certificateId: z.number(),
        recipientEmail: z.string().email(),
        message: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        // TODO: Implement email sending functionality
        // This will be implemented in phase 5
        throw new TRPCError({ 
          code: "NOT_IMPLEMENTED", 
          message: "Funcionalidade de envio de e-mail será implementada em breve" 
        });
      }),
  }),
});

export type AppRouter = typeof appRouter;
