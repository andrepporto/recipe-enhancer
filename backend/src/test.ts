import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const recipe = await prisma.recipe.create({
    data: {
      title: 'Bolo de cenoura',
      ingredients: ['cenoura', 'açúcar', 'farinha'],
      steps: ['bater no liquidificador', 'assar'],
    },
  });

  console.log(recipe);
}

main();
