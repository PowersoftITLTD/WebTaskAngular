import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'memberSearch'
})
export class MemberSearchPipe implements PipeTransform {

  transform(value: any[], searchTerm: string): any[] {
    if (!value || !searchTerm) return value;

    searchTerm = searchTerm.toLowerCase();
    
    const filterMembers = (members: any[]): any[] => {
      return members.reduce((result, member) => {
        if (member.MEMBER_NAME.toLowerCase().includes(searchTerm)) {
          result.push(member);

          // console.log('member',member);
          // console.log('result', result)
        }else if (member.subordinates && member.subordinates.length > 0) {
          const filteredSubordinates = filterMembers(member.subordinates);
          const memberName = member.MEMBER_NAME.trim().replace(/\s+/g,' ')
          if (filteredSubordinates.length > 0 || memberName.toLowerCase().includes(searchTerm)) {
            result.push({
              ...member,
              subordinates: filteredSubordinates
            });
          }
        }

        return result;
      }, []);
    };


    return filterMembers(value);
  }
}
