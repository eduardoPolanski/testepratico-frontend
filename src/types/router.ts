import { z } from "zod";
const getRoutersSchema = z.strictObject({
  id: z.number(),
  addressIp: z.string(),
  addressIpv6: z.string(),
  brand: z.string(),
  model: z.string(),
  inactive: z.boolean(),
  customer: z.array(z.object({ fullName: z.string(), id: z.number() })),
});

const updateRoutersSchema = z.strictObject({
  addressIp: z.string(),
  addressIpv6: z.string(),
  brand: z.string(),
  model: z.string(),
  inactive: z.boolean(),
  customer: z.array(z.object({ id: z.number() })),
});
export type GetRoutersSchema = z.infer<typeof getRoutersSchema>;
export type UpdateRoutersSchema = z.infer<typeof updateRoutersSchema>;
