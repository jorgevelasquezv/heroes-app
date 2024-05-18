import { Component } from '@angular/core';
import { HeroesService } from '../../services/heroes.services';
import { FormControl } from '@angular/forms';
import { Hero } from '../../interfaces/hero.interface';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styles: ``,
})
export class SearchPageComponent {
  public searchInput = new FormControl('');

  public heroes: Hero[] = [];

  public selectedHero: Hero | undefined;

  constructor(private readonly herosService: HeroesService) {}

  public searchHero(): void {
    const query: string = this.searchInput.value ?? '';
    this.herosService.getSuggestions(query).subscribe((heroes) => {
      this.heroes = heroes;
    });
  }

  public onSelectedOption(event: MatAutocompleteSelectedEvent): void {
    if (!event.option.value) {
      this.selectedHero = undefined;
      return;
    }
    const hero: Hero = event.option.value;
    this.searchInput.setValue(hero.superhero);
    this.selectedHero = hero;
  }
}
