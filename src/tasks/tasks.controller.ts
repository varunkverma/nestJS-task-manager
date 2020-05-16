import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) getTasksFilterDTO: GetTasksFilterDTO,
  ): Task[] {
    if (Object.keys(getTasksFilterDTO).length) {
      return this.tasksService.getTasksWithFilters(getTasksFilterDTO);
    }
    return this.tasksService.getAllTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Post('/seed')
  createTasks(@Body('tasks') createTaskDTOs: CreateTaskDTO[]): Task[] {
    return this.tasksService.createTasks(createTaskDTOs);
  }
  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body('status', TaskStatusValidationPipe) newStatus: string,
  ): Task {
    return this.tasksService.updateTaskStatus(id, newStatus);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): boolean {
    return this.tasksService.deleteTaskById(id);
  }
}
