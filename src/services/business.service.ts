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