import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCategoryPipe'
})
export class FilterCategoryPipePipe implements PipeTransform {

  transform(items: any[], searchTerm: string, fields: string[] = []): any[] {
    if (!items || !searchTerm) {
      return items;
    }

    searchTerm = searchTerm.toLowerCase();

    if (fields.length === 0) {
      return items.filter(item => JSON.stringify(item).toLowerCase().includes(searchTerm));
    }

    return items.filter(item => {
      return fields.some(field => {
        const value = item[field]?.toString().toLowerCase();
        return value && value.includes(searchTerm);
      });
    });
  }
}
