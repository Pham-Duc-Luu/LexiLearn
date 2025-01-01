import type { Desk } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../connection/prima.client";
export async function addRandomDesk(userid: number, number: number) {
  const desks = Array.from({ length: number }, () => {
    const randomdesk = getRandomDesk();
    return { ...randomdesk, desk_owner_id: Number(userid) };
  });

  console.log("Creating desks...");
  await prisma.desk.createMany({ data: desks });
  console.log("Desks created successfully!");
}

function getRandomDesk() {
  const desk: Pick<
    Desk,
    | "desk_description"
    | "desk_icon"
    | "desk_is_public"
    | "desk_name"
    | "desk_thumbnail"
  > = {
    desk_name: faker.music.songName(),
    desk_description: faker.lorem.paragraph(),
    desk_icon: faker.image.avatar(),
    desk_thumbnail: faker.image.urlPicsumPhotos(),
    desk_is_public: faker.datatype.boolean(),
  };
  return desk;
}
