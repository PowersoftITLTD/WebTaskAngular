import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'taskDue'
})
export class TaskDuePipe implements PipeTransform {

  transform(taskList: any[], selectedOption: string, isAscending: boolean = true): any[] {

    let filteredTasks: any[] = [];

    switch (selectedOption) {
      case 'All':
        filteredTasks = taskList;
      break;

      case 'To-day':
        filteredTasks = taskList.filter(task => this.isToday(task.COMPLETION_DATE) && task.STATUS !== 'Cancel Initiated' );
      break;

      case 'Over-due':
        filteredTasks = taskList.filter(task => this.isOverdue(task.COMPLETION_DATE));
      break;

      case 'Next 3 days':
        filteredTasks = taskList.filter(task => this.isNext3Days(task.COMPLETION_DATE));
      break;

      case 'Next 7 days':
        filteredTasks = taskList.filter(task => this.isNext7Days(task.COMPLETION_DATE));
      break;

      case 'Next 2 weeks':
        filteredTasks = taskList.filter(task => this.isNext2Weeks(task.COMPLETION_DATE));
      break;

      case 'Next month':
        filteredTasks = taskList.filter(task => this.isNextMonth(task.COMPLETION_DATE));
      break;

      case 'Future':
        filteredTasks = taskList.filter(task => this.isFuture(task.COMPLETION_DATE));
      break;

      case 'Review':
        filteredTasks = taskList.filter(task => task.STATUS === 'Close Initiated' || task.STATUS === 'Cancel Initiated');
      break;

      default:
        filteredTasks = taskList;
      break;
    }

    filteredTasks.sort((a, b) => {
      const dateA = new Date(this.parseDateString(a.COMPLETION_DATE));
      const dateB = new Date(this.parseDateString(b.COMPLETION_DATE));
      return isAscending ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
    });

    return filteredTasks;
  }
  

  private isToday(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private isOverdue(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  private isNext3Days(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 3);
  
    threeDaysFromNow.setHours(23, 59, 59, 999);
  
    return date >= today && date <= threeDaysFromNow;
  }

  private isNext7Days(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 7);
  
    threeDaysFromNow.setHours(23, 59, 59, 999);
  
    return date >= today && date <= threeDaysFromNow;
  }

  private isNext2Weeks(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    const threeDaysFromNow = new Date(today);
    threeDaysFromNow.setDate(today.getDate() + 14);
  
    threeDaysFromNow.setHours(23, 59, 59, 999);
  
    return date >= today && date <= threeDaysFromNow;
  }

  private isNextMonth(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
    endOfNextMonth.setHours(23, 59, 59, 999);
    return date >= nextMonth && date <= endOfNextMonth;
  }

  private isFuture(completionDate: string): boolean {
    const date = this.parseDateString(completionDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  }
  
  private parseDateString(completionDate: string): Date {
    const parts = completionDate.split('/');
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; 
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
}




