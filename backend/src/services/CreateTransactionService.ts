import { getRepository, getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';

import TransactionRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    category,
    type,
  }: Request): Promise<Transaction> {
    let createdCategory = null;
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError(
        'The transaction amount is greater than the cash value!',
      );
    }

    const categoryExists = await categoryRepository.findOne({
      where: { title: category },
    });

    if (!categoryExists) {
      const newCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(newCategory);

      createdCategory = newCategory;
    } else {
      createdCategory = categoryExists;
    }

    const transaction = transactionRepository.create({
      title,
      value,
      category: createdCategory,
      type,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
