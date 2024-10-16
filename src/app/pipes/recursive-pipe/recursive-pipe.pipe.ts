import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recursivePipe'
})
export class RecursivePipePipe implements PipeTransform {

  transform(repeat_type: any[], ...args: unknown[]): unknown {

    console.log(repeat_type)
    return null;
  }

}
