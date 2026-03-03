import z from "zod";
import { UserRole, UserStatus, UserType } from "@/graphql/types.generated";

export const UserSearchInputForAdminSchema = z.object({
    page: z.number().default(1),
    size: z.number().default(10),
    keyword: z.string().optional().nullable(),
    role: z.enum(UserRole).optional().nullable(),
    status: z.enum(UserStatus).optional().nullable(),
    type: z.enum(UserType).optional().nullable(),
});

export type UserSearchInputForAdminValues = z.infer<typeof UserSearchInputForAdminSchema>;
