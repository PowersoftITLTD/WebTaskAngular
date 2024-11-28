import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // apiUrl = 'http://127.0.0.1:5500/';

  _apiUrl = environment.apiUrl;
  _apiUrl_1 = environment.apiUrl_1;

  constructor(private http: HttpClient) { }

  /**LOGIN**/

  //Login user
  getEmpDetails(): Observable<any[]> {
    return this.http.get<any[]>(this._apiUrl + 'CommonApi/Task-Management/Get-Emp?CURRENT_EMP_MKEY=0&FILTER=DEFAULT').pipe(
      map(employees => {
        return employees.map(employee => {
          return {
            ...employee,
            LOGIN_PASSWORD: atob(employee.LOGIN_PASSWORD)
          };
        });
      })
    );
  }

  getLoginDetails(user_id: string, password: string): Observable<any[]> {
    return this.http.get<any[]>(this._apiUrl + `CommonApi/Task-Management/Login?Login_ID=${user_id}&Login_Password=${password}`)
  }

  getChangePassword(LoginName: any, old_pass: any, new_pass: any): Observable<any> {
    return this.http.get<any>(`${this._apiUrl}CommonApi/Task-Management/Change_Password?LoginName=${LoginName}&Old_Password=${old_pass}&New_Password=${new_pass}`);
  }


  /**TASK MANAGEMENT INTEGRATION**/

  // Option
  getCategory(): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Get-Option?Type_Code=Category&Master_mkey=0`);
  }

  // Project
  getProjectDetails(): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Get-Option?Type_Code=PROJECT&Master_mkey=0`);
  }

  //Sub-project
  getSubProjectDetails(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Get-Sub_Project?Project_Mkey=${mkey}`);
  }

  // Tags
  getTagDetailss(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/EMP_TAGS?EMP_TAGS=${mkey}`);
  }

  //Task Management
  getTaskManagementDetails(mkey: string, option: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/TASK-DASHBOARD?CURRENT_EMP_MKEY=${mkey}&FILTER=${option}`);
  }

  //Selected task details
  getSelectedTaskDetails(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/TASK-DETAILS_BY_MKEY?Mkey=${mkey}`);
  }

  // actionable
  getActionableDetails(mkey: string, emp_mkey: string, status: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/GET-ACTIONS?TASK_MKEY=${mkey}&CURRENT_EMP_MKEY=${emp_mkey}&CURR_ACTION=${status}`);
  }

  //tree-list
  getTreeList(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/GET-TASK_TREE?TASK_MKEY=${mkey}`)
  }



  /**DASHBOARD INTEGRATION**/

  //Home & Graph
  getHomeDetails(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/TASK-DASHBOARD_DETAILS?CURRENT_EMP_MKEY=${mkey}&CURR_ACTION=%22%22`)
  }

  //Table
  getTableDetails(mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/TeamTask?CURRENT_EMP_MKEY=${mkey}`)
  }



  //Dashoard department and interdepartment task
  departmentTodayDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=DEPERTMENT&TASKTYPE_DESC=DEPT-TODAY&mKEY=${mkey}`)
  }

  departmentOverdueDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=DEPERTMENT&TASKTYPE_DESC=DEPT-OVERDUE&mKEY=${mkey}`)
  }

  departmentFutureDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=DEPERTMENT&TASKTYPE_DESC=DEPT-FUTURE&mKEY=${mkey}`)
  }

  interDepartmentTodayDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=INTER-DEPERTMENT&TASKTYPE_DESC=INTERDEPT-TODAY&mKEY=${mkey}`)
  }

  interDepartmentOverdueDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=INTER-DEPERTMENT&TASKTYPE_DESC=INTERDEPT-OVERDUE&mKEY=${mkey}`)
  }

  interDepartmentFutureDetails(current_meky: string, mkey: string): Observable<any> {
    return this.http.get<any[]>(`${this._apiUrl}CommonApi/Task-Management/Team_Task_Details?CURRENT_EMP_MKEY=${current_meky}&TASKTYPE=INTER-DEPERTMENT&TASKTYPE_DESC=INTERDEPT-FUTURE&mKEY=${mkey}`)
  }


  //Add action details
  postActionData(data: any): Observable<any> {
    return this.http.post<any>(this._apiUrl + 'CommonApi/Task-Management/TASK-ACTION-TRL-Insert-Update', data);
  }


  //File
  uploadFile(formData: FormData) {
    return this.http.post<string[]>(this._apiUrl + 'CommonApi/Task-Management/FileUpload', formData);
  }





  /**RECURSIVE TASK INTEGRATION**/


  //login
  login(loginName: string, loginPassword: string): Observable<any> {

    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });
<<<<<<< HEAD

    const params: any = {
      LOGIN_NAME: loginName,
      LOGIN_PASSWORD: loginPassword,
      ClientId: '099153c2625149bc8ecb3e85e03f0022',
      Base64Secret: 'IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw',
      name: 'res'
    };

=======
    
    const params:any = {
      LOGIN_NAME: loginName,
      LOGIN_PASSWORD: loginPassword,   
      ClientId:'099153c2625149bc8ecb3e85e03f0022',
      Base64Secret:'IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw',
      name:'res'
    };
 
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)

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

<<<<<<< HEAD

  addRecursiveTask(task: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/TaskManagement`, task, { headers })
  }


  updateRecursiveTask(mkey: number, task: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/TaskManagement/${mkey}`, task, { headers })
=======
  
  addRecursiveTask(task:any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/TaskManagement`, task , {headers})
  }


  updateRecursiveTask(mkey:number, task:any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/TaskManagement/${mkey}`, task , {headers})
>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  }


  getRecursiveUser(): any {
    const storedUser = localStorage.getItem('jwtToken'); // Retrieve the token
<<<<<<< HEAD
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
    return this.http.get<any>(`${this._apiUrl_1}api/DocumentTemplate?${loggedInMkey}`, { headers });
  }

  postDocumentTempelate(tempDocData: any, jwtToken: string): Observable<any> {
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/DocumentTemplate`, tempDocData, { headers });
  }


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


  //Project Defination
  postProjectDefination(projDef: any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/ProjectDefination`, projDef, { headers });
  }

  getProjectDefination(jwtToken: string, user_mkey:number): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.get<any>(`${this._apiUrl_1}api/ProjectDefination?LoggedIN=${user_mkey}&FormName=asdkj&MethodName=aaskjd`, {headers})
  }


  
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


  
//Token service
=======
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


>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  recursiveTasklogout() {
    localStorage.removeItem('jwtToken');
  }
<<<<<<< HEAD

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
=======
 

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  } 

>>>>>>> parent of cb45e19 (Adding Updated Packages 27-11-2024)
}
