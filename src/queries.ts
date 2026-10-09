
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  // Query 1: All posts by a user, newest first.
  const userPosts = await prisma.post.findMany({
    where: { authorId: 1 },
    orderBy: { createdAt: "desc" },
  });
  console.log("\n1. Posts by user 1:", userPosts);

  // Query 2: A post, its comments, and each comment author's name.
  const postWithComments = await prisma.post.findUnique({
    where: { id: 1 },
    include: {
      comments: {
        include: {
          author: {
            select: { name: true },
          },
        },
      },
    },
  });
  console.log("\n2. Post with comments:", postWithComments);

  // Query 3: Comment counts for ALL posts, including zero-comment posts.
  const postsWithCounts = await prisma.post.findMany({
    select: {
      id: true,
      title: true,
      _count: { select: { comments: true } },
    },
  });

  const commentCounts = postsWithCounts
    .map((post) => ({
      id: post.id,
      title: post.title,
      commentCount: post._count.comments,
    }))
    .sort((a, b) => b.commentCount - a.commentCount);

  console.log("\n3. Comment counts:", commentCounts);

  // Query 4: Users who have never created a post.
  const usersWithoutPosts = await prisma.user.findMany({
    where: { posts: { none: {} } },
  });
  console.log("\n4. Users without posts:", usersWithoutPosts);

  // Query 5: Three posts with the most recent comment activity.
  const postsWithLatestComment = await prisma.post.findMany({
    where: { comments: { some: {} } },
    include: {
      comments: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { createdAt: true },
      },
    },
  });

  const mostRecentlyActive = postsWithLatestComment
    .map((post) => ({
      id: post.id,
      title: post.title,
      latestCommentActivity: post.comments[0]?.createdAt ?? null,
    }))
    .sort(
      (a, b) =>
        (b.latestCommentActivity?.getTime() ?? 0) -
        (a.latestCommentActivity?.getTime() ?? 0),
    )
    .slice(0, 3);

  console.log("\n5. Most recently active posts:", mostRecentlyActive);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
