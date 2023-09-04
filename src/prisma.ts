import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
  return new PrismaClient();
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};
const xprisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = xprisma;

const prisma = xprisma.$extends({
  query: {
    shop: {
      async findUnique({ model, operation, args, query }) {
        args.where = { approved: true, ...args.where };
        return query(args);
      },
    },
    product: {
      async findMany({ model, operation, args, query }) {
        args.where = { shop: { approved: true }, ...args.where };

        return query(args);
      },
      async findUnique({ model, operation, args, query }) {
        args.where = { shop: { approved: true }, ...args.where };

        return query(args);
      },
    },
  },
});

export default prisma;
