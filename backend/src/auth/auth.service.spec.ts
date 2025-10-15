import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, { provide: PrismaService, useValue: mockPrisma }],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should hash password on register', async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    mockPrisma.user.create.mockImplementation(({ data }) => ({ ...data, id: '1', createdAt: new Date() }));
    const user = await service.register({ email: 'a@a.com', password: '123456', name: 'A' });
    expect(user.email).toBe('a@a.com');
    expect(mockPrisma.user.create).toHaveBeenCalled();
  });

});
