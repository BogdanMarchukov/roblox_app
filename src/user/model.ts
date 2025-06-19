import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';
import { Expose } from 'class-transformer';

@Table({
  tableName: 'users',
  modelName: 'User',
  timestamps: false,
})
export class User extends Model<User> {
  @Expose()
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id: number;

  @Expose()
  @Column(DataType.INTEGER)
  balance: number;
}

