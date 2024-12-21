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
    where: { postId },
    include: {
      user: {
        select: {
          id: true,
          username: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};


export const getById = async (id: string) => {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          username: true
        }
      }
    }
  });
};

export const update = async ( id: string, text: string) => {
  const updateData: Prisma.CommentUpdateInput = {
    text,
  };
  
  return prisma.comment.update({
    where: { id },
    data: updateData
  });
};

export const deleteById = async (id: string) => {
  return prisma.comment.delete({
    where: { id },
  });
};
