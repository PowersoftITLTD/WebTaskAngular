import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // apiUrl = 'http://127.0.0.1:5500/';

  // _apiUrl = environment.apiUrl;
  _apiUrl_1 = environment.apiUrl_1;

  constructor(private http: HttpClient) { }

  /**LOGIN**/
  getEmpDetailsNew(jwtToken: string): Observable<any[]>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const emp_body = {
      CURRENT_EMP_MKEY: "0",
      FILTER: "DEFAULT"
    }

    return this.http.post<any>(`${this._apiUrl_1}api/CommonApi/Task-Management/Get-Emp`, emp_body, {headers});

  }



  getLoginDetailsNew(user_id: string, password: string){
   

    const pre_login_body = {
      Login_ID: user_id,
      Login_Password: password
    }

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Login`, pre_login_body )

  }


  addTaskManagement(addTaskData:any,jwtToken:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Add-Task`, addTaskData , {headers})
  }


  // saveTaskManagement(saveTaskData:any, jwtToken:string){

  // }

  
  addSubTaskManagement(addSubTaskData:any, jwtToken:string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Add-Sub-Task`, addSubTaskData , {headers})
  }
  

  // getChangePassword(LoginName: any, old_pass: any, new_pass: any): Observable<any> {
  //   return this.http.get<any>(`${this._apiUrl}CommonApi/Task-Management/Change_Password?LoginName=${LoginName}&Old_Password=${old_pass}&New_Password=${new_pass}`);
  // }


  /**TASK MANAGEMENT INTEGRATION**/
  getCategorynew(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });
  
    const category_body = {
      Type_Code: 'Category',
      Master_mkey: '0',
    };
  
    return this.http.post<any>(`${this._apiUrl_1}api/CommonApi/Task-Management/Get-Option`, category_body, {headers});
  }
    

  // Project
  getProjectDetailsNew(jwtToken: string): Observable<any> {
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const property_body = {
      type_Code: "PROJECT",
      master_mkey: "0"
    }
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Get-Option`, property_body, {headers});
  }


  getSubProjectDetailsNew(mkey:string,jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const building_body = {
      Project_Mkey: mkey,
    };

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Get-Sub_Project`, building_body , {headers})
  }
  
  // Tags
  // getTagDetailss(mkey: string): Observable<any> {
  //   return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/EMP_TAGS?EMP_TAGS=${mkey}`);
  // }


  getTagDetailss1(mkey: string, jwtToken:string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    const tag_body = {
      EMP_TAGS: mkey
    }
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/EMP_TAGS`, tag_body, {headers});
  }



  //Task Management
  getTaskManagementDetailsNew(mkey: string, option:string, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const dashoard_body = {
      CURRENT_EMP_MKEY: mkey,
      FILTER: option
    };

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/TASK-DASHBOARD`, dashoard_body , {headers});
  }




 getSelectedTaskDetailsNew(mkey: string, jwtToken: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  });

  const task_details_body = {
    Mkey: mkey
  }
  return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/TASK-DETAILS_BY_MKEY`, task_details_body, {headers});
}


  getActionableDetailsNew(mkey: string, emp_mkey: string, status: string, jwtToken:string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const actionable_body = {
      TASK_MKEY: mkey,
      CURRENT_EMP_MKEY: emp_mkey,
      CURR_ACTION: status
    }


    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/GET-ACTIONS`, actionable_body, {headers});

  }



  getTreeListNew(mkey:string, jwtToken:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const tree_body = {
      TASK_MKEY: mkey
    }

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/GET-TASK_TREE`, tree_body , {headers})
  }


  /**DASHBOARD INTEGRATION**/
  getHomeDetailsNew(mkey:string, jwtToken:string):Observable<any>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const home_body = {
      CURRENT_EMP_MKEY: mkey,
      CURR_ACTION: "%22%22"
    }

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/TASK-DASHBOARD_DETAILS`, home_body , {headers})

  }


  //Table
  getTeamTaskNew(mkey:string, jwtToken:string){
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const team_task_body = {
      CURRENT_EMP_MKEY: mkey
    }

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/TeamTask`, team_task_body , {headers})
  }



  departmentTodayDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const body_1 =  {
      CURRENT_EMP_MKEY:current_mkey,
      TASKTYPE: "DEPERTMENT",
      TASKTYPE_DESC: "DEPT-TODAY",
      mKEY: mkey
    }

    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_1 , {headers})

    
  }

  //http://192.168.19.188:8045/api/CommonApi/Task-Management/Team_Task_Details


  departmentOverdueDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const body_2 =  {
      CURRENT_EMP_MKEY:current_mkey,
      TASKTYPE: "DEPERTMENT",
      TASKTYPE_DESC: "DEPT-OVERDUE",
      mKEY: mkey
    }
    
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_2 , {headers})

  }


  departmentFutureDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const body_3 =  {
      CURRENT_EMP_MKEY:current_mkey,
      TASKTYPE: "DEPERTMENT",
      TASKTYPE_DESC: "DEPT-FUTURE",
      mKEY: mkey
    }
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_3 , {headers})

  }


  interDepartmentTodayDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const body_4 =  {
      CURRENT_EMP_MKEY:current_mkey,
      TASKTYPE: "INTER-DEPERTMENT",
      TASKTYPE_DESC: "INTERDEPT-TODAY",
      mKEY: mkey
    }
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_4 , {headers})

  }


  interDepartmentOverdueDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
      const headers = new HttpHeaders({
      'Authorization': `Bearer ${jwtToken}`,
      'Content-Type': 'application/json',
    });

    const body_5 =  {
      CURRENT_EMP_MKEY:current_mkey,
      TASKTYPE: "INTER-DEPERTMENT",
      TASKTYPE_DESC: "INTERDEPT-OVERDUE",
      mKEY: mkey
    }
    return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_5 , {headers})

  }


  interDepartmentFutureDetailsNew(current_mkey:string, mkey:string, jwtToken:string){
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  });

 const body_6 =  {
    CURRENT_EMP_MKEY: current_mkey,
    TASKTYPE: "INTER-DEPERTMENT",
    TASKTYPE_DESC: "INTERDEPT-FUTURE",
    mKEY: mkey
  }
  return this.http.post<any[]>(`${this._apiUrl_1}api/CommonApi/Task-Management/Team_Task_Details`, body_6 , {headers})

}


  //Add action details
  // postActionData(data: any): Observable<any> {
  //   return this.http.post<any>(this._apiUrl + 'CommonApi/Task-Management/TASK-ACTION-TRL-Insert-Update', data);
  // }


  // postActionDataNew(data: any, jwtToken:string): Observable<any>{
  //   const headers = new HttpHeaders({
  //     'Authorization': `Bearer ${jwtToken}`,
  //     'Content-Type': 'application/json',
  //   });

  //   const 
  // }


  postActionDataNew(file: any, additionalAttributes: any, token: string): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    Object.keys(additionalAttributes).forEach(key => {
      formData.append(key, additionalAttributes[key]);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this._apiUrl_1}api/CommonApi/Task-Management/TASK-ACTION-TRL-Insert-Update`, formData, { headers });
  }


  addRemarkBody(remarkData:any ,token: string){

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    return this.http.post(`${this._apiUrl_1}api/CommonApi/Task-Management/TASK-ACTION-TRL-Update`, remarkData, {headers})
  }

  //http://192.168.19.188:8045/api/CommonApi/Task-Management/TASK-ACTION-TRL-Insert-Update


  //File
  // uploadFile(formData: FormData) {
  //   return this.http.post<string[]>(this._apiUrl + 'CommonApi/Task-Management/FileUpload', formData);
  // }



  
  uploadFileNew(file: File, additionalAttributes: any, token: string): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    Object.keys(additionalAttributes).forEach(key => {
      formData.append(key, additionalAttributes[key]);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this._apiUrl_1}api/CommonApi/Task-Management/FileUpload`, formData, { headers });
  }
  
  //http://192.168.19.188:8045/api/CommonApi/Task-Management/FileUpload




  /**RECURSIVE TASK INTEGRATION**/


  //login
  login(loginName: string, loginPassword: string): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });

    const params: any = {
      LOGIN_NAME: loginName,
      LOGIN_PASSWORD: loginPassword,
      ClientId: '099153c2625149bc8ecb3e85e03f0022',
      Base64Secret: 'IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw',
      name: 'res'
    };


    localStorage.setItem('recursiveLogin', JSON.stringify([params]));

    return this.http.post<any>(`${this._apiUrl_1}api/Authentication/Login`, null, { headers, params }).pipe(
      tap(response => {

        if (response.jwtToken) {
          localStorage.setItem('jwtToken', response.jwtToken);
        }
      })
    );
  }



  //Recursive task management
  getRecursiveTaskManagement(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/TaskManagement`, { headers });
  }


  addRecursiveTask(task: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/TaskManagement`, task, { headers })
  }


  updateRecursiveTask(mkey: number, task: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/TaskManagement/${mkey}`, task, { headers })
  }


  getRecursiveUser(): any {
    const storedUser = localStorage.getItem('jwtToken'); // Retrieve the token
    return storedUser
  }

  recursiveFileUploader(file: File, additionalAttributes: any, token: string): Observable<any> {
    const formData = new FormData();

    formData.append('file', file, file.name);

    Object.keys(additionalAttributes).forEach(key => {
      formData.append(key, additionalAttributes[key]);
    });

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.post(`${this._apiUrl_1}api/RecursiveUploader`, formData, { headers });
  }

  //Document Tempelate
  getDocumentTempelate(loggedInMkey: number, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/DocumentTemplate?LoggedIN=${loggedInMkey}`, { headers });
  }

  postDocumentTempelate(tempDocData: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/DocumentTemplate`, tempDocData, { headers });
  }


  putDocumentTempelate(tempDocData:any, docMkey:number ,jwtToken:string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` })
    return this.http.put<any>(`${this._apiUrl_1}api/DocumentTemplate/${docMkey}`,tempDocData, {headers})
  }

//  http://192.168.19.188:8045/api/DocumentTemplate/12


  //Approval Tempelate
  getApprovalTemp(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` }); // Ensure there's a space after 'Bearer'
    
    return this.http.get<any>(`${this._apiUrl_1}api/ApprovalTemplate`, { headers }).pipe(
      catchError((error) => {
        console.error('Error fetching approval templates', error);
        // Return an observable with a user-friendly error message if needed
        return throwError('Failed to fetch approval templates');
      })
    );
  }
  

  postApprovalTemp(approvalTemp: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/ApprovalTemplate`, approvalTemp, { headers });
  }


  putApprovalTemp(apprlTempData:any, docMkey:number, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/ApprovalTemplate/ApprovalTemplate/Update-ApprovalTemplate?MKEY=${docMkey}`, apprlTempData ,{headers})

  }

//http://192.168.19.188:8045/api/ApprovalTemplate/ApprovalTemplate/Update-ApprovalTemplate?MKEY=2693

  //Project Defination

  putProjectDefination(projDef: any, headerMkey:number, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/ProjectDefination/ProjectDefination/Update-Project-Defination?MKEY=${headerMkey}`, projDef, { headers });
  }

  postProjectDefination(projDef: any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/ProjectDefination`, projDef, { headers });
  }

  getProjectDefination(jwtToken: string, user_mkey:number): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ProjectDefination?LoggedIN=${user_mkey}&FormName=asdkj&MethodName=aaskjd`, {headers})
  }

  //Document Depository

  getDocumentryList(jwtToken: string, user_mkey:number): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ProjectDocumentDepository/Get-Project-Document-Depsitory?ATTRIBUTE1=${user_mkey}`, {headers})

  }

  //http://192.168.19.188:8045/api/ProjectDocumentDepository/Get-Project-Document-Depsitory?ATTRIBUTE1=2693



  
  //Dropdown of approvals
  getBuildingClassificationDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/building-classification`, { headers })
  }

  getStandardDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/Standard-Type`, { headers })
  }

  getStatutoryAuthorityDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/Statutory-type`, { headers })
  }

  getDocTypeDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/doc-type`, { headers })
  }


  getDocCategory(jwtToken:any):Observable<any>{
    const headers = new HttpHeaders({Authorization: `Bearer ${jwtToken}`});
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/Document-Category`, {headers})
  }

  getJobRoleDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/JOB-ROLE-type`, { headers })
  }

  getDepartmentDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/DEPARTMENT`, { headers })
  }

  getSanctoningAuthDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/Sanctioning-Authority`, { headers })
  }

  getSanctoningDeptDP(jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ViewClassification/Sanctioning-Department`, { headers })
  }


  //Abbrivation 
  getAbbrivationCheck(strABBR: string, jwtToken: string) {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ApprovalTemplate/GetCheckABBR?strABBR=${strABBR}`, { headers })
  }

  projectDefinationOption(userMkey: number, jwtToken: string, building: number, Standard: number, Authority: number): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });    
    const url = `${this._apiUrl_1}api/ProjectDefination/ProjectDefination/Get-Approval-Details?LoggedInID=${userMkey}&BUILDING_TYPE=${building}&BUILDING_STANDARD=${Standard}&STATUTORY_AUTHORITY=${Authority}`;    
    return this.http.get<any>(url, { headers });
  }

  GetAbbrAndShortAbbr(Building:string,Standard:string,Authority:string,jwtToken: string){
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ApprovalTemplate/GetAbbrAndShortAbbr?Building=${Building}&Standard=${Standard}&Authority=${Authority}`, { headers })
  }



getProjDocDepositoryFeilds(jwtToken:string, mkey:any, user_mkey:any): Observable<any> {
  const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
  return this.http.get<any>(`${this._apiUrl_1}api/ProjectDocumentDepository/Get-Document-Details?MKEY=${mkey}&ATTRIBUTE1=${user_mkey}&ATTRIBUTE2=GET_LIST&ATTRIBUTE3=GET`, {headers})
}

postProjectDocument(jwtToken:string, data: any): Observable<any> {
  const url = `${this._apiUrl_1}api/ProjectDocumentDepository/Post-Project-Document-Depsitory`;  
  const headers = new HttpHeaders({ 'Authorization': `Bearer ${jwtToken}`});
  return this.http.post(url, data, { headers });
}


  
//Approval Initiation
getApprovalInitiation(jwtToken: string, mkey: string, approval_mkey: string): Observable<any> {
  const headers = new HttpHeaders({ 
    Authorization: `Bearer ${jwtToken}` 
  });

  return this.http.get<any>(`${this._apiUrl_1}api/ApprovalTaskInitiation/GetApprovalTemplate?MKEY=${mkey}&APPROVAL_MKEY=${approval_mkey}`, { headers });
}


  postApprovalInitiation(apprlInitionData:any, jwtToken: string): Observable<any>{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${jwtToken}` 
  })

  return this.http.post<any>(`${this._apiUrl_1}api/ApprovalTaskInitiation`,apprlInitionData,{headers})
}



subTaskPutApprovalInitiation(headerMkey:number, subTaskData:any ,jwtToken:string): Observable<any>{
  const headers = new HttpHeaders({
    Authorization: `Bearer ${jwtToken}` 
  })
  return this.http.put<any>(`${this._apiUrl_1}api/ApprovalTaskInitiation/Put-Approval-Template-Subtask?HEADER_MKEY=${headerMkey}`,subTaskData,{headers})
}


deleteProjectDefinationTask(lastUpdatedBy:number,headerMkey:number,jwtToken:string){
  const headers = new HttpHeaders({
    Authorization: `Bearer ${jwtToken}` 
  });
  return this.http.delete<any>(`${this._apiUrl_1}api/ProjectDefination/ProjectDefination/Delete-TASK?id=${headerMkey}&LastUpatedBy=${lastUpdatedBy}`,{headers})
}

//http://192.168.19.188:8045/api/ApprovalTaskInitiation/Put-Approval-Template-Subtask



//Token service
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  recursiveTasklogout() {
    localStorage.removeItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
