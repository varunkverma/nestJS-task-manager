import { Injectable } from '@nestjs/common';
import { v1 as uuidv1 } from 'uuid';

import { Task, TaskStatus } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }
  getTasksWithFilters(getTasksFilterDTO: GetTasksFilterDTO): Task[] {
    const { search, status } = getTasksFilterDTO;
    let tasks = this.tasks;
    if (status) {
      tasks = tasks.filter(task => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        task =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    return this.tasks.find(task => task.id === id);
  }

  createTask(createTaskDTO: CreateTaskDTO): Task {
    const { title, description } = createTaskDTO;

    const task: Task = {
      id: uuidv1(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }
  createTasks(createTaskDTOs: CreateTaskDTO[]): Task[] {
    createTaskDTOs.forEach(createTaskDTO => {
      const { title, description } = createTaskDTO;

      const task: Task = {
        id: uuidv1(),
        title,
        description,
        status: TaskStatus.OPEN,
      };
      this.tasks.push(task);
    });
    return this.tasks;
  }

  updateTaskStatus(id: string, newStatus: string): Task {
    if (this.tasks.find(task => task.id === id)) {
      this.tasks = this.tasks.map(task => {
        if (task.id === id) {
          switch (newStatus) {
            case TaskStatus.OPEN:
              task.status = TaskStatus.OPEN;
              break;
            case TaskStatus.IN_PROGRESS:
              task.status = TaskStatus.IN_PROGRESS;
              break;
            case TaskStatus.DONE:
              task.status = TaskStatus.DONE;
              break;
          }
        }
        return task;
      });
      return this.getTaskById(id);
    }
    return null;
  }

  deleteTaskById(id: string): boolean {
    if (this.tasks.find(task => task.id === id) !== undefined) {
      this.tasks = this.tasks.filter(task => task.id !== id);
      return true;
    }
    return false;
  }
}
