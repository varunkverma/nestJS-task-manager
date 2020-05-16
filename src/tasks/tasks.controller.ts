import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Patch,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './tasks.model';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTasksFilterDTO } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDTO: GetTasksFilterDTO): Task[] {
    console.log(getTasksFilterDTO);
    if (Object.keys(getTasksFilterDTO).length) {
      return this.tasksService.getTasksWithFilters(getTasksFilterDTO);
    }
    return this.tasksService.getAllTasks();
  }

  //   @Post()
  //   createTask(@Body() body): Task {
  //     return this.tasksService.createTask(body.title, body.description);
  //   }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Task {
    return this.tasksService.getTaskById(id);
  }
  @Post()
  createTask(@Body() createTaskDTO: CreateTaskDTO): Task {
    return this.tasksService.createTask(createTaskDTO);
  }
  @Post('/seed')
  createTasks(@Body('tasks') createTaskDTOs: CreateTaskDTO[]): Task[] {
    console.log(createTaskDTOs);
    return this.tasksService.createTasks(createTaskDTOs);
  }
  @Patch('/:id/status')
  updateTaskById(
    @Param('id') id: string,
    @Body('status') newStatus: string,
  ): Task {
    return this.tasksService.updateTaskStatus(id, newStatus);
  }

  @Delete('/:id')
  deleteTaskById(@Param('id') id: string): boolean {
    return this.tasksService.deleteTaskById(id);
  }
}
