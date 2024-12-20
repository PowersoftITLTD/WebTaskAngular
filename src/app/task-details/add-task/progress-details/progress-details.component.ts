import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-progress-details',
  templateUrl: './progress-details.component.html',
  styleUrls: ['./progress-details.component.css']
})
export class ProgressDetailsComponent implements OnInit {

  taskDetails: any;
  subTasks: any[] = [];

  @Input() task: any;
  loading: boolean = true;


  constructor(
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['Task_Num']) {
        this.task = JSON.parse(params['Task_Num']);
        const token = this.apiService.getRecursiveUser();

        this.getSelectedTaskDetails(this.task.toString(), token).subscribe((response: any) => {
          this.taskDetails = response[0]?.data;


          this.getTree(response[0]?.data);
        });
      }
    });
  }

  getSelectedTaskDetails(mkey: string, tokecn:string) {
    const token = this.apiService.getRecursiveUser();

    return this.apiService.getSelectedTaskDetailsNew(mkey, token);
  }


  getTree(taskDetails: any) {
    console.log('taskDetails getTree', taskDetails)

    console.log('this.task', this.task)

    this.loading = true;
    this.apiService.getTreeList(this.task).subscribe((same_data) => {

      console.log('same_data',same_data)
      const selectedData = taskDetails.filter((item: any) => {
        return same_data.some((task: any) => task.TASK_NO === item.TASK_NO);
      });

      console.log('selectedData', selectedData)
      const buildHierarchy = (tasks: any, rootTaskNo: any) => {
        const rootTask = tasks.find((task: any) => task.TASK_NO === rootTaskNo);
        if (!rootTask) return null;

        const buildSubtasks = (taskNo: any, depth: any) => {
          const subtasks = tasks.filter((task: any) => {
            const taskDepth = task.TASK_NO.split(".").length - 1;
            return task.TASK_NO.startsWith(taskNo + '.') && taskDepth === depth + 1;
          });
          if (subtasks.length === 0) return [];

          return subtasks.map((subtask: any) => {
            const subtaskWithNestedTaskNo: any = {
              TASK_NO: subtask,
              visible: true,
              subtask: buildSubtasks(subtask.TASK_NO, depth + 1)
            };

            // Add spaces based on depth
            const spaces = '  '.repeat(depth + 1);

            // Create new object with spaced TASK_NO
            const indentedSubtask = Object.keys(subtaskWithNestedTaskNo).reduce((acc: any, key) => {
              if (key === 'TASK_NO') {
                acc[key] = {
                  ...subtaskWithNestedTaskNo[key],
                  TASK_NO: spaces + subtaskWithNestedTaskNo[key].TASK_NO
                };
              } else {
                acc[key] = subtaskWithNestedTaskNo[key];
              }
              return acc;
            }, {});

            return indentedSubtask;
          });
        };

        const rootDepth = rootTask.TASK_NO.split(".").length - 1;
        const rootHierarchy = {
          TASK_NO: {
            ...rootTask,
            TASK_NO: rootTask.TASK_NO,
          },
          visible: true,
          subtask: buildSubtasks(rootTask.TASK_NO, rootDepth)
        };

        return rootHierarchy;
      };

      selectedData.forEach((selectedTask: any) => {
        const taskNo = selectedTask.TASK_NO;
        const hierarchy = buildHierarchy(same_data, taskNo);


        if (hierarchy) {
          this.subTasks.push(hierarchy);
          this.loading = false;
        }
      });
    });
  }



  calculateIndentation(taskNo: string, multiplier: number): number {
    const spacesCount = taskNo.search(/\S/);
    return spacesCount * multiplier;
  }


  toggleVisibility(task: any) {
    task.visible = !task.visible;
  }

}

