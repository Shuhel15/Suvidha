
import { prisma } from "@/lib/prisma";

export async function getBusinessServices(
  businessId: string,
  ownerId: string
) {
  const services = await prisma.service.findMany({
    where: {
      businessId,
      business: {
        ownerId,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return services;
}
