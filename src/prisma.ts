import { PrismaClient } from '@prisma/client';
import { deleteCloudinaryAsset } from './app/helpers/deleteAssets';

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
    asset: {
      async deleteMany({ args, query }) {
        const assets = await xprisma.asset.findMany(args);
        await Promise.all(
          assets.map((asset) => {
            if (asset?.secureUrl) {
              return deleteCloudinaryAsset(
                asset?.assetId ??
                  asset?.secureUrl
                    .split(/[\/\.]/)
                    .slice(-3, -1)
                    .join('/')
              );
            }
          })
        );
        return query(args);
      },
      async delete({ args, query }) {
        const asset = await query(args);
        if (asset?.secureUrl) {
          await deleteCloudinaryAsset(
            asset?.assetId ??
              asset?.secureUrl
                .split(/[\/\.]/)
                .slice(-3, -1)
                .join('/')
          );
        }
        return Promise.resolve(asset);
      },
    },
  },
});

export default prisma;
