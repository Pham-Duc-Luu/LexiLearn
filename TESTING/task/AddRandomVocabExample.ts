import { faker } from "@faker-js/faker";
import { prisma } from "../connection/prima.client";

export const addRamdomVocabExample = async () => {
  const vocabs = await prisma.vocab.findMany();

  Promise.all(
    vocabs.map(async (vocab) => {
      const vocabExamples = Array.from(
        {
          length: faker.number.int({ min: 1, max: 3 }),
        },
        () => {
          return {
            VE_vocab_id: vocab.vocab_id,
            VE_text: faker.lorem.paragraph(),
          };
        }
      );

      await prisma.vocab_Example.createMany({ data: vocabExamples });
    })
  );
};
