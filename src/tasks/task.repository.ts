import { Repository, EntityRepository } from 'typeorm';
import { Task } from './task.entity';
import { CreateTaskDTO } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async getTasks(filterTasksDTO: GetTasksFilterDTO): Promise<Task[]> {
    const { search, status } = filterTasksDTO;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        'task.title LIKE :search OR task.description LIKE :search',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();

    return tasks;
  }

  async createTask(createTaskDTO: CreateTaskDTO): Promise<Task> {
    const { description, title } = createTaskDTO;
    const task = new Task();
    task.description = description;
    task.title = title;
    task.status = TaskStatus.OPEN;

    await task.save();

    return task;
  }
}
