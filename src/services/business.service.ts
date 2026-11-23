import { prisma } from "@/lib/prisma";

export async function getOwnerBusinesses(ownerId: string) {
  const businesses = await prisma.business.findMany({
    where: {
      ownerId,
    },
    include: {
      locations: {
        orderBy: {
          createdAt: "asc",
        },
        take: 1,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return businesses;
}

export async function getBusinessDetails(businessId: string, ownerId: string) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      ownerId,
    },
    include: {
      locations: {
        orderBy: {
          createdAt: "asc",
        },
      },
      hours: {
        orderBy: {
          dayOfWeek: "asc",
        },
      },
    },
  });

  return business;
}

export async function getPublicBusinessDetails(businessId: string) {
  const business = await prisma.business.findFirst({
    where: {
      id: businessId,
      services: {
        some: {
          isActive: true,
        },
      },
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
  });

  return business;
}

type PublicBusinessFilters = {
  category?: string;
  city?: string;
  area?: string;
  postalCode?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  radiusKm?: number;
};

// Calculate distance between two geographical coordinates using the Haversine formula
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const earthRadiusKm = 6371;

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const latitudeDifference = toRadians(lat2 - lat1);
  const longitudeDifference = toRadians(lon2 - lon1);

  const a =
    Math.sin(latitudeDifference / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(longitudeDifference / 2) ** 2;

  const centralAngle = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * centralAngle;
}

export async function getPublicBusinesses(filters: PublicBusinessFilters = {}) {
  const {
    category,
    city,
    area,
    postalCode,
    search,
    latitude,
    longitude,
    radiusKm,
  } = filters;

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

  // Apply nearby location filtering
  if (typeof latitude === "number" && typeof longitude === "number") {
    const radius = radiusKm ?? 5;

    return businesses
      .map((business) => {
        const location = business.locations[0];

        if (location?.latitude == null || location?.longitude == null) {
          return null;
        }

        const distance = calculateDistance(
          latitude,
          longitude,
          location.latitude,
          location.longitude,
        );

        return { business, distance };
      })
      .filter(
        (
          result,
        ): result is {
          business: (typeof businesses)[number];
          distance: number;
        } => result !== null && result.distance <= radius,
      )
      .sort((a, b) => a.distance - b.distance)
      .map((result) => result.business);
  }

  return businesses;
}
