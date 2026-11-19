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

export async function getPublicBusinesses(){
  const businesses = await prisma.business.findMany({
    where:{
      services:{
        some:{
          isActive:true,
        }
      }
    },
    include:{
      locations:{
        orderBy:{
          createdAt:"asc",
        },
        take:1,
      },
      services:{
        where:{
          isActive:true,
        }
      },
      hours:{
        orderBy:{
          dayOfWeek:"asc"
        }
      }
    },
    orderBy:{
      createdAt:"desc",
    }
  })

  return businesses;
}