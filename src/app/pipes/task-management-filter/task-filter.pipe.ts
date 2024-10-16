import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskFilter'
})
export class TaskFilterPipe implements PipeTransform {
  transform(tasks: any[], searchText: string): any[] {
    if (!tasks || !searchText) {
      return tasks;
    }
    searchText = searchText.toLowerCase();
  
    return tasks.filter(task =>
      (task.TASK_NAME && task.TASK_NAME.toLowerCase().includes(searchText)) ||
      (task.TASK_DESCRIPTION && task.TASK_DESCRIPTION.toLowerCase().includes(searchText)) ||
      (task.TASK_NO && task.TASK_NO.toString().includes(searchText)) ||
      (task.TAGS && Array.isArray(task.TAGS) && task.TAGS.some((tag:string) => tag.toLowerCase().includes(searchText))) ||
      (task.PROJECT_NAME && task.PROJECT_NAME.toLowerCase().includes(searchText)) ||
      (task.RESPONSIBLE_TAG && task.RESPONSIBLE_TAG.toLowerCase().includes(searchText))
    );
  }
  
}
