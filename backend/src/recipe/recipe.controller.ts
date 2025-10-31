import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user?: { userId: string; email: string };
}

@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() data: CreateRecipeDto, @Req() req: AuthenticatedRequest) {
    const user = req.user as any;
    return this.recipeService.create(data, user.id);
  }

  @Get()
  findAll() {
    return this.recipeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recipeService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() data: UpdateRecipeDto) {
    return this.recipeService.update(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/transform")
  async transformRecipe(
    @Param("id") id: string,
    @Body("instruction") instruction: string
  ) {
    return this.recipeService.transformRecipe(id, instruction);
  }
}
