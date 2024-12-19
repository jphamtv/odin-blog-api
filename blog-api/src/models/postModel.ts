import { PrismaClient, Prisma } from "@prisma/client";
const prisma = new PrismaClient();

export const create = async (
  title: string,
  text: string,
  isPublished = false,
  authorId: string
) => {
  const data: Prisma.UserCreateInput = {
    username,
    email,
    password: hashedPassword,
    isAdmin
  };
  return prisma.post.create({ data });
};

export const getAll = async (email: string) => {
  return prisma.post.findUnique({
    where: { email },
  });
};

export const getById = async (id: string) => {
  return prisma.post.findUnique({
    where: { id },
  });
};

const update = async (id, name) => {
  return prisma.post.update({
    where: { id },
    data: { name },
  });
};

const deleteById = async (id) => {
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
