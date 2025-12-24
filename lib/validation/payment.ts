import { z } from "zod";

export const paymentSchema = z.object({
  nama_pelanggan: z
    .string()
    .min(3, "Nama terlalu pendek")
    .max(100, "Nama terlalu panjang")
    .trim(),

  email: z
    .string()
    .email("Format email tidak valid")
    .max(255, "Email terlalu panjang")
    .transform((val) => val.toLowerCase().trim()),

  items: z
    .array(
      z.object({
        menu_id: z.number().int().positive(),
        jumlah: z.number().int().positive(),
        sub_total: z.number().int().positive(),
        catatan: z.string().max(500).nullable().optional(),
      })
    )
    .min(1, "Minimal 1 item"),
});
