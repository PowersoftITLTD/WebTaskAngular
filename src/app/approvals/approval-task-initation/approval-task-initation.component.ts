import { Component, OnInit } from '@angular/core';
<<<<<<< HEAD
import { CITIES, ICity } from './../add-approval-tempelate/cities';

=======
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)

@Component({
  selector: 'app-approval-task-initation',
  templateUrl: './approval-task-initation.component.html',
  styleUrls: ['./approval-task-initation.component.css']
})
export class ApprovalTaskInitationComponent implements OnInit {

<<<<<<< HEAD
  receivedUser: string | any;

  taskDetails: any;
  loading:boolean = false;

  public activeIndices: number[] = []; // Change here
  subTasks: any[] = [];
  noSubParentTasks: any[] = [];


  public accordionItems = [
    { title: 'Checklist', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Sub Task', content: 'Some placeholder content for the second accordion panel.' },
  ];


  projDefinationTable = [
    {TASK_NO:'1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.3', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.1.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.1.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.1.3', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.2.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.2.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'1.3.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'4.1.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'4.1.1.1', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'4.1.1.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'3.2.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'3.2.23.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},
    {TASK_NO:'3.2', Abbrivation:'Abbrivation 1', Approved_Description:'Approved_Description 1', Days_Required:'6', Department:'Department 1', Job_Role:'Job Role 1', Responsible_Person:'Responsible_Person 1', Output_Document:'Output Document 1' , Tentative_Start_Date:'24-10-2024', Tentative_End_Date:'24-10-2024', status:'Status'},

  ]

  constructor() { }

  ngOnInit(): void {
    this.activeIndices = this.accordionItems.map((_, index) => index); // Set all indices to open
    this.getTree()

  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index); // Add index if not present
    } else {
      this.activeIndices.splice(idx, 1); // Remove index if present
    }
  }


  getTree() {
    this.loading = true;
  
    const same_data = this.projDefinationTable; // Use projDefinationTable directly
    console.log('same_data', same_data);
  
    const buildHierarchy = (tasks: any, rootTaskNo: any) => {
      const rootTask = tasks.find((task: any) => task.TASK_NO === rootTaskNo);
      if (!rootTask) return null;
  
      const buildSubtasks = (taskNo: any, depth: any) => {
        const subtasks = tasks.filter((task: any) => {
          const taskDepth = task.TASK_NO.split('.').length - 1;
          return task.TASK_NO.startsWith(taskNo + '.') && taskDepth === depth + 1;
        });
        if (subtasks.length === 0) return []; // No subtasks, return empty array
  
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
  
      const rootDepth = rootTask.TASK_NO.split('.').length - 1;
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
  
    // Build hierarchy for all tasks in projDefinationTable
    const taskNumbers = [...new Set(same_data.map(task => task.TASK_NO.split('.')[0]))]; // Get unique root TASK_NO
    taskNumbers.forEach(taskNo => {
      const hierarchy = buildHierarchy(same_data, taskNo);
      if (hierarchy) {
        this.subTasks.push(hierarchy);
      }
    });

    const noSubParentTasks:any = []

    // Now, we need to check for tasks that are not included in subTasks
    const allRootTaskNumbersInHierarchy = this.subTasks.map((subtask: any) => subtask.TASK_NO.TASK_NO.split('.')[0]);
    
  
    // For each task in projDefinationTable, check if it has any subtasks or not
    same_data.forEach((task: any) => {
      
      const taskRootNo = task.TASK_NO.split('.')[0];
      // If the root task number does not exist in the subtask hierarchy, push it to noSubParentTasks
      if (!allRootTaskNumbersInHierarchy.includes(taskRootNo)) {
        noSubParentTasks.push(task);
      }
    });
  
    this.loading = false;
    console.log('Subtasks:', this.subTasks);
    this.noParentTree(noSubParentTasks)
  }


  noParentTree(noParentTree: any) {
    console.log('noParentTree', noParentTree);

    const no_parent_arr = noParentTree.map((item: any) => ({
        TASK_NO: item,
        subtask: [],
        visible: true
    }));


    no_parent_arr.forEach((task: any) => {
        const taskNoParts = task.TASK_NO.TASK_NO.split('.');
        
        const parentTaskNo = taskNoParts.slice(0, taskNoParts.length - 1).join('.'); 

        console.log('parentTaskNo',parentTaskNo)
        
        const parentTaskPrefix = parentTaskNo ? parentTaskNo : taskNoParts[0]; 
        
        console.log(`Task: ${task.TASK_NO.TASK_NO}, Parent Task Prefix: ${parentTaskPrefix}`);

        if (parentTaskPrefix !== task.TASK_NO.TASK_NO) {
            let parentTask = no_parent_arr.find((t: any) => t.TASK_NO.TASK_NO === parentTaskPrefix);

            if (!parentTask) {
                
                console.log(`Parent Task not found for ${task.TASK_NO.TASK_NO}, creating new parent: ${parentTaskPrefix}`);
                parentTask = {
                    TASK_NO: { TASK_NO: parentTaskPrefix },
                    subtask: [task], 
                    visible: true
                };
                no_parent_arr.push(parentTask); 
            } else {
                console.log(`Found Parent Task: ${parentTask.TASK_NO.TASK_NO}`);
                parentTask.subtask.push(task);
            }
        }
    });

    // Step 3: Log the final organized tasks
    const tasks = no_parent_arr.filter((task:any) => {
      console.log('task',task)
      return  task.TASK_NO.Abbrivation !== undefined;
  });

      const subtasks = tasks.flatMap((task:any) => task.subtask.map((sub:any) => sub.TASK_NO.TASK_NO));

    // Step 2: Filter out tasks whose TASK_NO is in the subtasks list
    const filteredTasks = tasks.filter((task:any) => !subtasks.includes(task.TASK_NO.TASK_NO));
      
      console.log('Filtered Tasks:', filteredTasks);

      this.subTasks = [...this.subTasks, ...filteredTasks];

}








  
  
  

  calculateIndentation(taskNo: string, baseIndent: number): number {
    return (taskNo.split('.').length - 1) * baseIndent;
  }
  
  toggleVisibility(task: any) {
    task.visible = !task.visible;
=======
  constructor() { }

  ngOnInit(): void {
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  }

}
