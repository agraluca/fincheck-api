import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { BankAccountType } from '../entities/BankAccount';

export class CreateBankAccountDto {
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Balanço inicial deve ser um número' })
  @IsNotEmpty({ message: 'Balanço inicial é obrigatório' })
  initialBalance: number;

  @IsEnum(BankAccountType, {
    message: 'Tipo deve ser: CHECKING, INVESTMENT ou CASH',
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: BankAccountType;

  @IsString({ message: 'Cor deve ser uma string' })
  @IsNotEmpty({ message: 'Cor é obrigatório' })
  @IsHexColor({ message: 'Cor deve ser hexadecimal' })
  color: string;
}
