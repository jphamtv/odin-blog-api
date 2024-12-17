const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

export const createNew = async (email: string, hashedPassword: string) => {
  return prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
};

export const getByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const getById = async (id: string) => {
  return prisma.user.findUnique({
    where: { id },
  });
};

export default {
  createNew,
  getByEmail,
  getById,
};
