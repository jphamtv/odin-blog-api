import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (
  text: string,
  userId: string,
  postId: string
) => {
  const data: Prisma.CommentCreateInput = {
    text,
    post: {
      connect: { id: postId }
    },
    user: {
      connect: { id: userId }
    },
  };
  return prisma.comment.create({ data });
};

export const getAll = async (postId: string) => {
  return prisma.comment.findMany({
    where: {
      postId: postId
    }
  });
};


export const getById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: true
    }
  });
};

export const deleteById = async (id: string) => {
  return prisma.comment.delete({
    where: { id },
  });
};
