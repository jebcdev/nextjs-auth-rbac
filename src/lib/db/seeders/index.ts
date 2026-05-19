"use server";

import { prismaDB } from "../prismaDB";
import { usersSeeder } from "./01-users.seeder";

const main = async () => {
    console.log("🌱 Starting seed...");

    await usersSeeder();
    return console.log("✅ Seed completed!");
};

main().catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
});
