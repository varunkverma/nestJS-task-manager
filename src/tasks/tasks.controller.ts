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
  ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) getTasksFilterDTO: GetTasksFilterDTO,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(getTasksFilterDTO);
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDTO: CreateTaskDTO): Promise<Task> {
    return this.tasksService.createTask(createTaskDTO);
  }

  // @Post('/seed')
  // createTasks(@Body('tasks') createTaskDTOs: CreateTaskDTO[]): Task[] {
  //   return this.tasksService.createTasks(createTaskDTOs);
  // }
  @Patch('/:id/status')
  updateTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, newStatus);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id', ParseIntPipe) id: number): void {
    this.tasksService.deleteTaskById(id);
  }
}
