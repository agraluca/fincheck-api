import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersRepository } from 'src/shared/database/repositories/users.repositories';

import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';

import { SignUpDto } from './dto/signUp.dto';
import { SignInDto } from './dto/signIn.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto) {
    const { name, email, password } = signUpDto;
    const isEmailTaken = await this.usersRepo.findUnique({
      where: { email },
      select: { id: true },
    });

    if (isEmailTaken) {
      throw new ConflictException('Email ja foi utilizado');
    }

    const hashedPassword = await hash(password, 12);
    const user = await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
        categories: {
          createMany: {
            data: [
              // Income
              { name: 'Salário', icon: 'salary', type: 'INCOME' },
              { name: 'Freelance', icon: 'freelance', type: 'INCOME' },
              { name: 'Outro', icon: 'other', type: 'INCOME' },
              // Expense
              { name: 'Casa', icon: 'home', type: 'EXPENSE' },
              { name: 'Alimentação', icon: 'food', type: 'EXPENSE' },
              { name: 'Educação', icon: 'education', type: 'EXPENSE' },
              { name: 'Lazer', icon: 'fun', type: 'EXPENSE' },
              { name: 'Mercado', icon: 'grocery', type: 'EXPENSE' },
              { name: 'Roupas', icon: 'clothes', type: 'EXPENSE' },
              { name: 'Transporte', icon: 'transport', type: 'EXPENSE' },
              { name: 'Viagem', icon: 'travel', type: 'EXPENSE' },
              { name: 'Outro', icon: 'other', type: 'EXPENSE' },
            ],
          },
        },
      },
    });

    const accessToken = await this.generateAccessToken(user);

    return {
      accessToken,
    };
  }

  async signIn(signInDto: SignInDto) {
    const { email, password } = signInDto;
    const user = await this.usersRepo.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const accessToken = await this.generateAccessToken(user);

    return { accessToken };
  }

  private generateAccessToken(user: User) {
    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
    };

    return this.jwtService.signAsync(payload);
  }
}
