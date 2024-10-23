import { Component, OnInit, ViewChild } from '@angular/core';
import { IgxComboComponent } from 'igniteui-angular';
import { CITIES, ICity } from './cities';

@Component({
  selector: 'app-add-approval-tempelate',
  templateUrl: './add-approval-tempelate.component.html',
  styleUrls: ['./add-approval-tempelate.component.css'],
})
export class AddApprovalTempelateComponent implements OnInit {
  public cities: ICity[] = CITIES;
  public selectedCities: ICity[] = [];
  public filteredCities: ICity[] = [];
  public searchTerm: string = '';

  @ViewChild('noValueKey', { read: IgxComboComponent })
  public comboNoValueKey: IgxComboComponent | any;

  public selectedNoValueKey: ICity[] = [this.cities[4], this.cities[0]];



  receivedUser: string | any;
  public activeIndices: number[] = []; // Change here

  public accordionItems = [
    { title: 'Classification', content: 'Some placeholder content for the first accordion panel.' },
    { title: 'Approval', content: 'Some placeholder content for the second accordion panel.' },
    { title: 'End Result', content: 'And lastly, the placeholder content for the third and final accordion panel.' },
    { title: 'Checklist', content: 'And lastly, the placeholder content for the third and final accordion panel.' },
    { title: 'Subtask', content: 'And lastly, the placeholder content for the third and final accordion panel.' }

  ];

  constructor() {}

  ngOnInit(): void {
    this.filteredCities = this.cities;
    this.activeIndices = this.accordionItems.map((_, index) => index); // Set all indices to open
  }

  receiveLoggedInUser(user: any): void {
    this.receivedUser = user;
  }

  toggle(index: number): void {
    const idx = this.activeIndices.indexOf(index);
    if (idx === -1) {
      this.activeIndices.push(index); // Add index if not present
    } else {
      this.activeIndices.splice(idx, 1); // Remove index if present
    }
  }

  filterCities() {
    const term = this.searchTerm.toLowerCase();
    this.filteredCities = this.cities.filter(city =>
      city.name.toLowerCase().includes(term)
    );
  }

  toggleSelection(city: ICity) {
    const index = this.selectedCities.findIndex(selected => selected.id === city.id);
    if (index === -1) {
      this.selectedCities.push(city); // Add city if not selected
    } else {
      this.selectedCities.splice(index, 1); // Remove city if already selected
    }
  }

  isSelected(city: ICity): boolean {
    return this.selectedCities.some(selected => selected.id === city.id);
  }


  getGroupedAndSortedCities() {
    const groupedCities:any = {};

    // Group cities by country
    this.filteredCities.forEach(city => {
        const country = city.country;
        if (!groupedCities[country]) {
            groupedCities[country] = [];
        }
        groupedCities[country].push(city);
    });

    // Sort cities within each country
    for (const country in groupedCities) {
        groupedCities[country].sort((a:any, b:any) => a.name.localeCompare(b.name));
    }

    return groupedCities;
}

  public selectFavorites() {
    const favoriteIds = ['UK01', 'BG01', 'JP01', 'DE01'];
    this.selectedCities = this.cities.filter(city => favoriteIds.includes(city.id));
  }

  getUniqueCountries(): string[] {
    return Array.from(new Set(this.cities.map(city => city.country)));
  }
}
