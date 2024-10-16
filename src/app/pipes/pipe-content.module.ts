import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterPipe } from './task-management-filter/task-filter.pipe';
import { MemberSearchPipe } from './member-search/member-search.pipe';
import { RecursivePipePipe } from './recursive-pipe/recursive-pipe.pipe';



@NgModule({
  declarations: [
    TaskFilterPipe,
    RecursivePipePipe,
    // MemberSearchPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TaskFilterPipe,
    // MemberSearchPipe
  ]
})
export class PipeContentModule { }
