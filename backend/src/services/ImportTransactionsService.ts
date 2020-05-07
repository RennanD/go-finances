import { getRepository, In } from 'typeorm';
import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface TransactionsCSV {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string | undefined;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const categories: string[] = [];
    const transactions: TransactionsCSV[] = [];

    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getRepository(Transaction);

    const csvReadStream = fs.createReadStream(filePath);

    const parsers = csvParse({
      from_line: 2,
    });

    const parseCSV = csvReadStream.pipe(parsers);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({
        title,
        value,
        type,
        category,
      });
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    const existentCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitles = existentCategories.map(
      (category: Category) => category.title,
    );

    // console.log(categories);

    const addCategoriesTitle = categories
      .filter(category => !existentCategoriesTitles.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const newCategories = categoriesRepository.create(
      addCategoriesTitle.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(newCategories);

    const finalCategories = [...newCategories, ...existentCategories];

    const createTransactions = transactionsRepository.create(
      transactions.map(transaction => {
        return {
          title: transaction.title,
          type: transaction.type,
          value: transaction.value,
          category: finalCategories.find(category => {
            return category.title === transaction.category;
          }),
        };
      }),
    );

    await transactionsRepository.save(createTransactions);

    fs.promises.unlink(filePath);

    return createTransactions;
  }
}

export default ImportTransactionsService;
