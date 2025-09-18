import { Module } from '@nestjs/common';
import { RecipeModule } from './recipe/recipe.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, RecipeModule],
})
export class AppModule {}
