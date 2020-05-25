import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(
    getTasksFilterDTO: GetTasksFilterDTO,
    user: User,
  ): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTasksFilterDTO, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const foundTask = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!foundTask) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return foundTask;
  }

  createTask(createTaskDTO: CreateTaskDTO, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO, user);
  }

  async updateTaskStatus(
    id: number,
    newStatus: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = newStatus;
    await task.save();
    return task;
  }
  async deleteTaskById(id: number, user: User): Promise<void> {
    // requires 2 calls to the db
    // const taskFound = await this.getTaskById(id);
    // return await this.taskRepository.remove(taskFound);

    // requires only 1 call to the db
    try {
      const result = await this.taskRepository.delete({ id, userId: user.id });
      if (result.affected === 0) {
        throw new NotFoundException(`Task with id "${id}" not found`);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}
