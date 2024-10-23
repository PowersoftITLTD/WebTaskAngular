import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-multi-select-dropdown',
    templateUrl: './multi-select-dropdown.component.html',
    styleUrls: ['./multi-select-dropdown.component.css']
})
export class MultiSelectDropdownComponent implements OnInit {

    @Input() list: any;
    @Input() taskData: any;

    @Output() shareCheckedList = new EventEmitter();
    @Output() passDefaultMonth = new EventEmitter();
    @Output() shareIndividualCheckedList = new EventEmitter();

    selectedMonthDays: Set<string> = new Set<string>();

    checkedList: any[];
    currentSelected: any[] | any;
    showDropDown: boolean = false;

    constructor() {

        this.checkedList = [];


    }

    @HostListener('document:click', ['$event'])
    onDocumentClick(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const dropdown = document.querySelector('.dropdown-container') as HTMLElement;
  
      if (this.showDropDown && dropdown && !dropdown.contains(target)) {
        this.showDropDown = false;
      }
    }

    ngOnInit(): void {

        const monthMapping: { [key: string]: number } = {
            January: 1,
            February: 2,
            March: 3,
            April: 4,
            May: 5,
            June: 6,
            July: 7,
            August: 8,
            September: 9,
            October: 10,
            November: 11,
            December: 12,
        };
        

        if (this.taskData && this.taskData.mkey) {
            const selectedMonths = [
                this.taskData.attributE2,
                this.taskData.attributE3,
                this.taskData.attributE4,
                this.taskData.attributE5,
                this.taskData.attributE6,
                this.taskData.attributE7,
                this.taskData.attributE8,
                this.taskData.attributE9,
                this.taskData.attributE10,
                this.taskData.attributE11,
                this.taskData.attributE12,
                this.taskData.attributE13
            ].filter(attr => attr); // Filter out any empty strings

    
            // Set the checked state of months based on selected months
            selectedMonths.forEach(monthNum => {
                const monthName = Object.keys(monthMapping).find(key => monthMapping[key] === parseInt(monthNum));
                if (monthName) {
                    this.selectedMonthDays.add(monthName);
                    const monthItem = this.list.find((d:any) => d.name === monthName);
                    if (monthItem) {

                        monthItem.checked = true;
                        if(monthItem.checked = true){

                            console.log(this.list.name)
                            this.toggleMonthDaySelection(this.list.name , true);

                        }
                    }
                }
            });
        }

        if (!this.taskData || !this.taskData.mkey){

            this.checkedList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

            this.toggleMonthDaySelection(this.list.name = 'All', true);

        }

        // if (this.taskData && (this.taskData.term !== 'Month')) {
        //     this.toggleMonthDaySelection(this.list.name = 'All', true);
        // }

    }


    toggleMonthDaySelection(day: string, checkbox: boolean): void {

        if (day === 'All') {
            if (checkbox) {
                this.list?.forEach((d: any) => {
                    if (d.name !== 'All') {
                        this.selectedMonthDays.add(d.name);
                        d.checked = true;
                    }
                });
            } else {
                this.selectedMonthDays.clear();
                this.list?.forEach((d: any) => {
                    d.checked = false;
                });
            }
        } else {
            if (this.selectedMonthDays.has(day)) {
                this.selectedMonthDays.delete(day);
            } else {
                this.selectedMonthDays.add(day);
            }

            const allMonthsChecked = this.list?.every((d: any) =>
                d.name === 'All' || this.selectedMonthDays.has(d.name)
            );

            const allIndex = this.list?.findIndex((d: any) => d.name === 'All');
            if (allIndex !== -1) {
                this.list[allIndex].checked = allMonthsChecked;
            }
        }

        const selectedDates = Array.from(this.selectedMonthDays);
        this.checkedList = selectedDates;
        this.shareCheckedList.emit(selectedDates);
    }


}




