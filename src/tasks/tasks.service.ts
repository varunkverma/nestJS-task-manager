import { Injectable, NotFoundException } from '@nestjs/common';

import { TaskStatus } from './task-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  async getTasks(getTasksFilterDTO: GetTasksFilterDTO): Promise<Task[]> {
    return await this.taskRepository.getTasks(getTasksFilterDTO);
  }

  async getTaskById(id: number): Promise<Task> {
    const foundTask = await this.taskRepository.findOne(id);
    if (!foundTask) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
    return foundTask;
  }

  createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.taskRepository.createTask(createTaskDTO);
  }

  async updateTaskStatus(id: number, newStatus: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = newStatus;
    await task.save();
    return task;
  }
  async deleteTaskById(id: number): Promise<void> {
    // requires 2 calls to the db
    // const taskFound = await this.getTaskById(id);
    // return await this.taskRepository.remove(taskFound);

    // requires only 1 call to the db
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id "${id}" not found`);
    }
  }
}
