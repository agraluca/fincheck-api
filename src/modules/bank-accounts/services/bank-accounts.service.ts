import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories';
import { ValidateBankAccountsOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepo: BankAccountsRepository,
    private readonly validateBankAccountOwnership: ValidateBankAccountsOwnershipService,
  ) {}

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, color, type } = createBankAccountDto;
    return this.bankAccountsRepo.create({
      data: {
        userId,
        name,
        initialBalance,
        color,
        type,
      },
    });
  }

  async findAllByUserId(userId: string) {
    const bankAccounts = await this.bankAccountsRepo.findMany({
      where: {
        userId,
      },
      include: {
        transactions: {
          select: {
            value: true,
            type: true,
          },
        },
      },
    });

    return bankAccounts.map(({ transactions, ...bankAccount }) => {
      const totalTransactionBalance = transactions.reduce(
        (acc, { type, value }) => {
          if (type === 'INCOME') {
            return (acc += value);
          }
          return (acc -= value);
        },
        0,
      );

      const currentBalance =
        bankAccount.initialBalance + totalTransactionBalance;

      return {
        ...bankAccount,
        currentBalance,
      };
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateBankAccountOwnership.validate(userId, bankAccountId);

    const { name, initialBalance, color, type } = updateBankAccountDto;

    return this.bankAccountsRepo.update({
      where: {
        id: bankAccountId,
      },
      data: {
        name,
        initialBalance,
        color,
        type,
      },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateBankAccountOwnership.validate(userId, bankAccountId);

    await this.bankAccountsRepo.delete({
      where: {
        id: bankAccountId,
      },
    });

    return null;
  }
}
