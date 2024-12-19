import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (
  title: string,
  text: string,
  authorId: string,
  isPublished: boolean = false
) => {
  const data: Prisma.PostCreateInput = {
    title,
    text,
    isPublished,
    author: {
      connect: { id: authorId }
    },
  };
  return prisma.post.create({ data });
};

export const getAll = async () => {
  return prisma.post.findMany({
    include: {
      author: true // Include author details in the response
    }
  });
};

export const getById = async (id: string) => {
  return prisma.post.findUnique({
    where: { id },
    include: {
      author: true
    }
  });
};

const update = async (
  id: string,
  data: Prisma.PostUpdateInput
) => {
  const updateData: Prisma.PostUpdateInput = {
    ...data,
    publishedAt: data.isPublished ? new Date() : null // Set publishedAt when publishing/re-publishing
  };
  
  return prisma.post.update({
    where: { id },
    data: updateData
  });
};

const deleteById = async (id: string) => {
  return prisma.post.delete({
    where: { id },
  });
};

export default {
  create,
  getAll,
  getById,
  update,
  deleteById,
};
