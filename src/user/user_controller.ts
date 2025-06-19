import { Request, Response } from 'express';
import { User } from './model';
import { sequelize } from '..';
import { ApiError } from '../common/error';

export async function updateBalance(req: Request, res: Response) {
  const id = Number(req.params.id);
  const amount = Number(req.body.amount);

  if (isNaN(amount)) {
    throw new ApiError(400, 'Invalid amount');
  }

  if (isNaN(id)) {
    throw new ApiError(400, 'Invalid id');
  }

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!user) {
      await transaction.rollback();
      throw new ApiError(404, 'User not found');
    }

    const newBalance = user.balance - amount;

    if (newBalance < 0) {
      await transaction.rollback();
      throw new ApiError(400, "Not enough funds")
    }

    user.balance = newBalance;
    await user.save({ transaction });

    await transaction.commit();

    res.json(user);
  } catch (error: any) {
    console.log(error.message);
    await transaction.rollback();
    res.status(500).json({ message: 'Internal server error' });
  }
}

