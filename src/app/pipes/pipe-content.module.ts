import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskFilterPipe } from './task-management-filter/task-filter.pipe';
import { MemberSearchPipe } from './member-search/member-search.pipe';
import { RecursivePipePipe } from './recursive-pipe/recursive-pipe.pipe';
import { FilterDocsPipePipe } from './filter-docs-pipe/filter-docs-pipe.pipe';
import { FilterCategoryPipePipe } from './filter-category-pipe/filter-category-pipe.pipe';



@NgModule({
  declarations: [
    TaskFilterPipe,
    RecursivePipePipe,
    FilterDocsPipePipe,
    FilterCategoryPipePipe
    // MemberSearchPipe
  ],
  imports: [
    CommonModule
  ],
  exports:[
    TaskFilterPipe,
    FilterDocsPipePipe,
    FilterCategoryPipePipe
    // MemberSearchPipe
  ]
})
export class PipeContentModule { }
