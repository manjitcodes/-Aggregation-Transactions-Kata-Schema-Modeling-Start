import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const users = await prisma.users.findMany();

  console.log(users);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });