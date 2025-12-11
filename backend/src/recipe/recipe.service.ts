import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import OpenAI from 'openai';
import Redis from 'ioredis';

@Injectable()
export class RecipeService {
  constructor(
    private prisma: PrismaService,
     @Inject('REDIS_CLIENT') private redis: Redis) {}

  async create(data: CreateRecipeDto, userId: string) {
    const recipeData = {
      title: data.title,
      ingredients: data.ingredients,
      steps: data.steps,
      userId:userId,
    };
    return this.prisma.recipe.create({ data: recipeData });
  }

  async findAll(skip = 0, take = 10) {
    const cacheKey = `recipes:${skip}:${take}`;
    const cached = await this.redis.get(cacheKey);
    
    if (cached) return JSON.parse(cached);
    
    const recipes = await this.prisma.recipe.findMany({ skip, take });
    await this.redis.setex(cacheKey, 300, JSON.stringify(recipes)); // 5min
    
    return recipes;
  }

  async findOne(id: string) {
    const recipe = await this.prisma.recipe.findUnique({
      where: { id },
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async update(id: string, data: UpdateRecipeDto, userId: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (recipe?.userId !== userId) {
      throw new ForbiddenException('You can only edit your own recipes');
    }
    return this.prisma.recipe.update({ where: { id }, data });
  }

  async remove(id: string) {
    return this.prisma.recipe.delete({ where: { id } });
  }

  async transformRecipe(id: string, instruction: string) {
    const recipe = await this.prisma.recipe.findUnique({ where: { id } });
    if (!recipe) throw new Error("Receita não encontrada");
    if (process.env.OPENAI_API_KEY) {
      throw new BadRequestException('openAI API KEY is required')
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const prompt = `
      Receita original:
      Título: ${recipe.title}
      Ingredientes: ${recipe.ingredients}
      Passos: ${recipe.steps}

      Instrução: ${instruction}

      Gere uma nova versão da receita seguindo a instrução acima.
      Responda em JSON no formato:
      { "title": "...", "ingredients": ["..."], "steps": ["..."] }
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const content = completion.choices[0].message?.content ?? "{}";
    try {
      return JSON.parse(content);
    } catch {
      throw new BadRequestException('Invalid response from OpenAI');
    }  
  }
}
