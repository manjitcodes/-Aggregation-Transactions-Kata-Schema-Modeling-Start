
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Delete child records before parent records.
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const manjit = await prisma.user.create({
    data: {
      name: "Manjit",
      email: "manjit@example.com",
    },
  });

  const sita = await prisma.user.create({
    data: {
      name: "Sita",
      email: "sita@example.com",
    },
  });

  const ram = await prisma.user.create({
    data: {
      name: "Ram",
      email: "ram@example.com",
    },
  });

  const anita = await prisma.user.create({
    data: {
      name: "Anita",
      email: "anita@example.com",
    },
  });

  const post1 = await prisma.post.create({
    data: {
      title: "Learning PostgreSQL",
      authorId: manjit.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Understanding SQL Joins",
      authorId: manjit.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "REST API Design",
      authorId: sita.id,
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: "Node.js Streams",
      authorId: ram.id,
    },
  });

  await prisma.comment.createMany({
    data: [
      {
        text: "Very useful explanation",
        postId: post1.id,
        authorId: sita.id,
      },
      {
        text: "The JOIN example helped me",
        postId: post1.id,
        authorId: ram.id,
      },
      {
        text: "Good explanation of foreign keys",
        postId: post2.id,
        authorId: sita.id,
      },
      {
        text: "This is useful for backend development",
        postId: post3.id,
        authorId: manjit.id,
      },
      {
        text: "I understand streams better now",
        postId: post4.id,
        authorId: anita.id,
      },
    ],
  });

  console.log("Seed completed successfully.");
  console.log("Users:", await prisma.user.count());
  console.log("Posts:", await prisma.post.count());
  console.log("Comments:", await prisma.comment.count());
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });