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

    console.log(`come to me ${loginName} and ${loginPassword}`)
    const headers = new HttpHeaders({
      'accept': 'text/plain'
    });
    
    const params:any = {
      LOGIN_NAME: loginName,
      LOGIN_PASSWORD: loginPassword,   
      ClientId:'099153c2625149bc8ecb3e85e03f0022',
      Base64Secret:'IxrAjDoa2FqElO7IhrSrUJELhUckePEPVpaePlS_Xaw',
      name:'res'
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

  
  addRecursiveTask(task:any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.post<any>(`${this._apiUrl_1}api/TaskManagement`, task , {headers})
  }


  updateRecursiveTask(mkey:number, task:any, jwtToken: string): Observable<any>{
    const headers = new HttpHeaders({ Authorization: `Bearer ${jwtToken}` });
    return this.http.put<any>(`${this._apiUrl_1}api/TaskManagement/${mkey}`, task , {headers})
  }


  getRecursiveUser(): any {
    const storedUser = localStorage.getItem('jwtToken'); // Retrieve the token
    return storedUser 
  }
  

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
