import { Module } from '@nestjs/common';
import { RecipeModule } from './recipe/recipe.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, RecipeModule, AuthModule],
})
export class AppModule {}
