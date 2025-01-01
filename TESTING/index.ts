import { prisma } from "./connection/prima.client";
import { addRandomDesk } from "./task/AddRandomDesk";
import { addRandomVocab } from "./task/AddRandomVocab";
import { addRamdomVocabExample } from "./task/AddRandomVocabExample";

async function main() {
  // addRandomVocab();
  addRamdomVocabExample();
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
