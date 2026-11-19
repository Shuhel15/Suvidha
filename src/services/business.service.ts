import {prisma} from "@/lib/prisma";

export async function getOwnerBusinesses(ownerId: string){
  const businesses = await prisma.business.findMany({
    where:{
      ownerId
    },

    include:{
      locations:{
        orderBy:{
          createdAt:"asc"
        },
        take:1
      }
    },
    orderBy:{
      createdAt:"desc"
    }
  })
  return businesses
}

export async function getBusinessDetails(
  businessId:string,
  ownerId:string
){
  const business = await prisma.business.findFirst({
    where:{
      id:businessId,
      ownerId
    },
    include:{
      locations:{
        orderBy:{
          createdAt:"asc"
        }
      },
      hours:{
        orderBy:{
          dayOfWeek:"asc"
        }
      }
    }
  })

  return business
}


type PublicBusinessFilters = {
  category?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  search?: string;
};

export async function getPublicBusinesses(
  filters: PublicBusinessFilters = {},
) {
  const { category, city, area, postalCode, search } = filters;

  const businesses = await prisma.business.findMany({
    where: {
      ...(category && { category }),

      ...(search && {
        name: {
          contains: search,
          mode: "insensitive",
        },
      }),

      services: {
        some: {
          isActive: true,
        },
      },

      ...((city || area || postalCode) && {
        locations: {
          some: {
            ...(city && {
              city: {
                contains: city,
                mode: "insensitive",
              },
            }),

            ...(area && {
              area: {
                contains: area,
                mode: "insensitive",
              },
            }),

            ...(postalCode && {
              postalCode,
            }),
          },
        },
      }),
    },

    include: {
      locations: {
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      },

      services: {
        where: {
          isActive: true,
        },
      },

      hours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });

  return businesses;
}
