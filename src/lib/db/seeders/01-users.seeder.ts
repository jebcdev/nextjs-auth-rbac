import { prismaDB } from "@/lib/db/prismaDB";
import { Role } from "@/generated/prisma/enums";
import bcrypt from "bcryptjs";

export const usersSeeder = async () => {
    try {
        const generalPassword = await bcrypt.hash("123456789", 10);

        const adminUser = await prismaDB.user.create({
            data: {
                name: "Admin User",
                email: "admin@email.com",
                password: generalPassword,
                role: Role.ADMIN,
            },
        });

        const regularUser = await prismaDB.user.create({
            data: {
                name: "Regular User",
                email: "user@email.com",
                password: generalPassword,
                role: Role.USER,
            },
        });

        return { adminUser, regularUser };
    } catch (error) {
        console.error("❌ Error seeding tenants:", error);
        throw error;
    }
};
