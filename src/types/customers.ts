import { z } from "zod";

const getCustomerSchema = z.strictObject({
  id: z.number(),
  fullName: z.string().min(3).max(255),
  cpf: z.string().length(11).optional(),
  cnpj: z.string().length(14).optional(),
  accountType: z.enum(["PF", "PJ"]),
  birth: z.coerce.date(),
  street: z.string().min(3).max(255),
  number: z.string().min(3).max(255),
  cep: z.string().min(1).max(10),
  district: z.string().min(3).max(255),
  complement: z.string().min(0).max(255).default(""),
  city: z.string().min(3).max(255),
  inactive: z.boolean(),
  routeId: z.number().optional(),
  router: z
    .object({
      id: z.number(),
      addressIp: z.string(),
      addressIpv6: z.string(),
      brand: z.string(),
      model: z.string(),
      inactive: z.boolean(),
      createdAt: z.coerce.date(),
      updatedAt: z.coerce.date(),
    })
    .optional(),
});


export type GetCustomerSchema = z.infer<typeof getCustomerSchema>;
