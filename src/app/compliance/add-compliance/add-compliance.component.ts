import { HttpClient } from '@angular/common/http';
import { Component, ErrorHandler, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';
import { CredentialService } from 'src/app/services/credential/credential.service';
import { SideBarService } from 'src/app/services/side-panel/side-bar.service';

@Component({
  selector: 'app-add-compliance',
  templateUrl: './add-compliance.component.html',
  styleUrls: ['./add-compliance.component.css']
})
export class AddComplianceComponent implements OnInit {

  complianceForm: FormGroup | any

  createdOrUpdatedUserName: any

  loginName: string = '';
  loginPassword: string = '';


  receivedUser: any;

    @Input() loggedInUser: any;
    @Input() recursiveLogginUser: any = {};

  tags: any[] = [];
  suggestions: any[] = [];
  allTags: any[] = [];
  selectedTags: any[] = [];
  selectedCategory: any;

  jobRoleList: any[] = [];
  departmentList: any[] = [];
  category: any = [];
  project: any = [];
  sub_proj: any = [];
  status: any = [];
  empName: any = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];

  inputHasValue: boolean = false;


  constructor(
    private apiService: ApiService,
        private formBuilder: FormBuilder,
        private tostar: ToastrService,
        private credentialService: CredentialService,
        private http: HttpClient,
        private router: Router,
        // private sidebarService: SideBarService
  ) { }

  ngOnInit(): void {

    this.onLogin();
    this.complianceFormInitlize();
    // this.fetchCategoryData();
    this.fetchProjectData();
    this.fetchEmployeeName();
    this.getTagsnew();
  }


  complianceFormInitlize(){
    this.complianceForm = this.formBuilder.group({
        property:['', Validators.required],
        building:['', Validators.required],
        shortDescription:['', Validators.required],
        longDescription:['', Validators.required],
        raisedAt:['', Validators.required],
        responsibleDepartment:['', Validators.required],
        jobRole:['', Validators.required],
        responsiblePerson:['', Validators.required],
        toBeCompletedBy:['', Validators.required],
        noOfDays:['', Validators.required],
        status:['', Validators.required],
        tags:['', Validators.required]
    })
  }


  onLogin() {

    this.credentialService.validateUser(this.loginName, this.loginPassword);

    const data = this.credentialService.getUser();

    this.createdOrUpdatedUserName = data[0]?.FIRST_NAME,

      console.log('onLogin data')

    const USER_CRED = {
      EMAIL_ID_OFFICIAL: data[0]?.EMAIL_ID_OFFICIAL,
      PASSWORD: atob(data[0]?.LOGIN_PASSWORD)
    };

    this.apiService.login(USER_CRED.EMAIL_ID_OFFICIAL, USER_CRED.PASSWORD).subscribe({
      next: (response) => {
        if (response.jwtToken) {
          this.fetchData();
          // this.fetchTaskDetails();
        }
      },
      error: (error) => {
        console.error('Login failed:', error);
      }
    });
  }

  private fetchData(): void {
    this.recursiveLogginUser = this.apiService.getRecursiveUser();


 
    // 4. Job Role DP
    this.apiService.getJobRoleDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.jobRoleList = list;
        this.setJobName();
        console.log('Job Role List:', this.jobRoleList);
      },
      error: (error: any) => {
        console.error('Unable to fetch Job Role List', error);
      }
    });




    this.apiService.getDepartmentDP(this.recursiveLogginUser).subscribe({
      next: (list: any) => {
        this.departmentList = list
        this.setDepartmentName();

      }, error: (error: ErrorHandler) => {

      }
    })

    // if (this.taskData.MKEY && this.buildingList && this.standardList) {
    //   this.getSubProj();
    //   // this.checkValueForNewRow_1();
    // }  

  }

  

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  selectEmployee(employee: any): void {

    // console.log('selectEmployee',employee)
    const assignedTo = employee.Assign_to;

    // console.log('assignedTo', assignedTo)
    this.complianceForm.get('responsiblePerson').setValue(assignedTo);

    if (assignedTo) {
      this.filteredEmployees = [];
      return
    }
  }


  getTagsnew() {
    this.loggedInUser = this.credentialService.getUser();
    const token = this.apiService.getRecursiveUser();


    this.apiService.getTagDetailss1(this.loggedInUser[0]?.MKEY.toString(), token).subscribe((response: any) => { 
        this.allTags = response[0].data.map((item: { name: string }) => item.name);
    
    });
}


setJobName(): void {
  // if (this.taskData && this.taskData.MKEY) {

  //   // console.log('this.departmentList', this.jobRoleList)
  //   const matchedJobRole = this.jobRoleList.find((role: any) =>
  //     role.mkey === Number(this.taskData.JOB_ROLE)
  //   );

  //   if (matchedJobRole) {
  //     this.taskData.JOB_ROLE_NAME = matchedJobRole.typE_DESC;
  //   }
  // }
}


setDepartmentName(): void {
  // if (this.taskData && this.taskData.MKEY) {

  //   // console.log('this.departmentList', this.departmentList)
  //   const matchedDept = this.departmentList.find((department: any) =>
  //     department.mkey === Number(this.taskData.AUTHORITY_DEPARTMENT)
  //   );

  //   if (matchedDept) {
  //     this.taskData.AUTHORITY_DEPARTMENT_NAME = matchedDept.typE_DESC;
  //   }
  // }
}

  fetchEmployeeName(): void {
    const token = this.apiService.getRecursiveUser();


    this.apiService.getEmpDetailsNew(token).subscribe(
      (response: any) => {
        // console.log("Employee data:", data);
        // const _data = data;

        response[0]?.data.forEach((emp: any) => {
          const fullName = emp.EMP_FULL_NAME;
          const MKEY = emp.MKEY;
          let capitalizedFullName = '';
          const nameParts = fullName.split(' ');

          // console.log('nameParts', nameParts)

          for (let i = 0; i < nameParts.length; i++) {
            if (nameParts[i].length === 1 && i < nameParts.length - 1) {
              capitalizedFullName += nameParts[i].toUpperCase() + '.' + nameParts[i + 1].charAt(0).toUpperCase() + nameParts[i + 1].slice(1).toLowerCase();
              i++;
            } else {
              capitalizedFullName += nameParts[i].charAt(0).toUpperCase() + nameParts[i].slice(1).toLowerCase();
            }
            if (i !== nameParts.length - 1) {
              capitalizedFullName += ' ';
            }
          }

          this.employees.push({ Assign_to: capitalizedFullName, MKEY: MKEY });
        });
        // console.log('this.employees', this.employees);    
      },
      (error: ErrorHandler) => {
        console.error('Error fetching employee details:', error);
      }
    );
  }
  

    fetchProjectData(): void {
      const token = this.apiService.getRecursiveUser();
  
      this.apiService.getProjectDetailsNew(token).subscribe(
        (response: any) => {
          this.project = response[0].data;
          // console.log("Project", this.project);
        },
        (error: ErrorHandler) => {
          console.log(error, 'Error Occurred while fetching projects');
        }
      );
    }


    taskNameMaxLength() {
      // return this.taskForm.get('taskName').value.length >= 150;
    }

    descriptionMaxLength() {
      // return this.taskForm.get('taskDescription').value.length >= 1000;
    }
  
    onProjectSelect(selectElement: HTMLSelectElement) {
      const selectedIndex = selectElement.selectedIndex - 1;
      const selectedOption: any = this.project[selectedIndex];
      const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : null;
      const token = this.apiService.getRecursiveUser();
  
  
      console.log('selectedProjectMkey',selectedProjectMkey)
  
      if (selectedProjectMkey) {
        this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
          (response: any) => {
            console.log(response)
            this.sub_proj = response[0]?.data;
            console.log("Sub-Project", this.sub_proj);
          },
          (error: ErrorHandler) => {
            console.log(error, 'Error Occurred while fetching sub-projects');
          }
        );
      }
    }
  


  filterEmployees(event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();

    if (!value) {
      this.filteredEmployees = [];
      return;
    }

    const filterValue = value.toLowerCase();
    this.filteredEmployees = this.employees.filter(emp => {
      const fullName = emp.Assign_to.toLowerCase();
      return fullName.includes(filterValue);
    });

    this.inputHasValue = value.trim().length > 0;

    // console.log('filteredEmployees', this.filteredEmployees);
  }

  createData(){
    const values = this.complianceForm.value
    console.log('Values', values)
  }

}
