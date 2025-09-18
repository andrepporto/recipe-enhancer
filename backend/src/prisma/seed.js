// backend/prisma/seed.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.recipe.createMany({
    data: [
      {
        title: 'Panquecas Simples',
        ingredients: 'farinha, ovo, leite',
        steps: 'Misturar e fritar',
      },
      {
        title: 'Salada Rápida',
        ingredients: 'alface, tomate, azeite',
        steps: 'Cortar e Misturar',
      },
    ],
  });
  console.log('Seed criada');
}
main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
