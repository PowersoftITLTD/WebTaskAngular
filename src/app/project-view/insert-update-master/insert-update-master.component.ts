import { Component, ErrorHandler, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

type AOA = any[][];

@Component({
  selector: 'app-insert-update-master',
  templateUrl: './insert-update-master.component.html',
  styleUrls: ['./insert-update-master.component.css']
})
export class InsertUpdateMasterComponent implements OnInit {



  project: any = [];
  sub_proj: any = [];

  receivedUser: any;


  file: File | null = null;
  fileExtension: string | any;
  data: AOA = [];
  loading = false;


  constructor(
        private apiService: ApiService,
        private toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.fetchProjectData();

  }


  onProjectSelect(selectElement: HTMLSelectElement) {
    const selectedIndex = selectElement.selectedIndex - 1;
    const selectedOption: any = this.project[selectedIndex];
    const selectedProjectMkey = selectedOption ? selectedOption.MASTER_MKEY : null;
    const token = this.apiService.getRecursiveUser();


    if (selectedProjectMkey) {
      this.apiService.getSubProjectDetailsNew(selectedProjectMkey.toString(), token).subscribe(
        (response: any) => {
          console.log(response)
          this.sub_proj = response[0]?.data;
          // this.raisedAtListCheck()

        },
        (error: ErrorHandler | any) => {
          const errorData = error.error.errors;
          const errorMessage = Object.values(errorData).flat().join(' , ');
          this.toastr.error(errorMessage, 'Error Occured in server')
        }
      );
    }
  }


  fetchProjectData(): void {
    const token = this.apiService.getRecursiveUser();

    this.apiService.getProjectDetailsNew(token).subscribe(
      (response: any) => {
        this.project = response[0].data;
      },
      (error: ErrorHandler | any) => {
        const errorData = error.error.errors;
        const errorMessage = Object.values(errorData).flat().join(' , ');
        this.toastr.error(errorMessage, 'Error Occured in server')
      }
    );
  }


  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

}
