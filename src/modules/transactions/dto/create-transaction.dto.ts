import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { TransactionType } from '../entities/Transaction';

export class CreateTransactionDto {
  @IsString({ message: 'Id da conta bancária deve ser uma string' })
  @IsNotEmpty({ message: 'Id da conta bancária é obrigatório' })
  @IsUUID(undefined, { message: 'Id da conta bancária deve ser do tipo UUID' })
  bankAccountId: string;

  @IsString({ message: 'Id da categoria bancária deve ser uma string' })
  @IsNotEmpty({ message: 'Id da categoria bancária é obrigatório' })
  @IsUUID(undefined, {
    message: 'Id da categoria bancária deve ser do tipo UUID',
  })
  categoryId: string;

  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  name: string;

  @IsNumber({}, { message: 'Valor deve ser um número' })
  @IsNotEmpty({ message: 'Valor é obrigatório' })
  @IsPositive({ message: 'Valor deve ser positivo' })
  value: number;

  @IsDateString({}, { message: 'Data dever ter formato de iso string' })
  @IsNotEmpty({ message: 'Data é obrigatório' })
  date: string;

  @IsEnum(TransactionType, {
    message: 'Tipo deve ser: INCOME ou EXPENSE',
  })
  @IsNotEmpty({ message: 'Tipo é obrigatório' })
  type: TransactionType;
}
