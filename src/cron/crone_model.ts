import { Model, Column, Table, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'cron_tasks',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
})
export class CronTask extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false
  })
  status: 'idle' | 'running' | 'finished';

  @Column({
    type: DataType.STRING,
    field: 'app_instance_id'
  })
  appInstanceId?: string;

  @Column({
    type: DataType.DATE,
    field: 'started_at'
  })
  startedAt?: Date;

  @Column({
    type: DataType.DATE,
    field: 'finished_at'
  })
  finishedAt?: Date;

  @Column({
    type: DataType.DATE,
    field: 'created_at',
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at',
  })
  updatedAt: Date;
}

