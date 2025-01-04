import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterDocsPipe'
})
export class FilterDocsPipePipe implements PipeTransform {

  transform(groupedDocs: any, searchQuery: string): any {

    if (!groupedDocs || !searchQuery.trim()) {
      return groupedDocs; 
    }

    const query = searchQuery.trim().toUpperCase(); 

    const filteredGroupedDocs: any = {};

    for (const category in groupedDocs) {
      const filteredCategoryDocs = groupedDocs[category].filter((doc: any) =>
        doc.typE_DESC.toUpperCase().includes(query) || category.toUpperCase().includes(query)
      );

      if (filteredCategoryDocs.length > 0) {
        filteredGroupedDocs[category] = filteredCategoryDocs;
      }
    }

    return filteredGroupedDocs;
  }
}
