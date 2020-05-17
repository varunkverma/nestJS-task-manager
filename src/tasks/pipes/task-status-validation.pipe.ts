import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ];
  transform(value: string) {
    const newStatus = value.toUpperCase();
    if (!this.isStatusValid(newStatus)) {
      throw new BadRequestException(`${newStatus} is an invalid status`);
    }

    return newStatus;
  }
  private isStatusValid(status: any) {
    const index = this.allowedStatuses.indexOf(status);

    return index !== -1;
  }
}
