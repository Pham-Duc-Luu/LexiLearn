import {
  en,
  Faker,
  faker,
  fakerEN,
  fakerJA,
  fakerVI,
  fakerZH_CN,
  ja,
} from "@faker-js/faker";
import type { Vocab } from "@prisma/client";
import { prisma } from "../connection/prima.client";

const lanuages = ["ENGLISH", "CHINESE", "JAPANESE"];
export const getRamdomVocab = (deskId: number) => {
  const vocab: Pick<
    Vocab,
    | "vocab_image"
    | "vocab_meaning"
    | "vocab_text"
    | "vocab_language"
    | "vocab_desk_id"
  > = {
    vocab_image: faker.image.urlPicsumPhotos(),
    vocab_text: faker.helpers.arrayElement([
      fakerEN.word.words(),
      fakerJA.word.words(),
      fakerZH_CN.word.words(),
    ]),
    vocab_language: faker.helpers.arrayElement(lanuages),
    vocab_meaning: fakerVI.word.words(),
    vocab_desk_id: deskId,
  };

  return vocab;
};

export const addRandomVocab = async () => {
  const desks = await prisma.desk.findMany();

  console.log("Creating vocab...");
  Promise.all(
    desks.map(async (desk) => {
      const randomVocab = getRamdomVocab(desk.desk_id);

      const vocabs = Array.from(
        {
          length: faker.number.int({ min: 20, max: 50 }),
        },
        () => {
          return getRamdomVocab(desk.desk_id);
        }
      );

      await prisma.vocab.createMany({ data: vocabs });
    })
  );

  // const desks = Array.from({ length: number }, () => {
  //   return getRamdomVocab();
  // });

  console.log("Desks created successfully!");
};
