import { filter, switchMap } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.services';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl<string>(''),
    first_appearance: new FormControl<string>(''),
    characters: new FormControl<string>(''),
    alt_img: new FormControl<string>(''),
  });

  public id: string = '';

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  constructor(
    private readonly heroesService: HeroesService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly snackbar: MatSnackBar,
    public readonly dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        switchMap(({ id }) => {
          if (id) {
            this.id = id;
            return this.heroesService.getHeroById(id);
          }
          return [];
        })
      )
      .subscribe((hero) => {
        if (!hero) {
          this.router.navigate(['/heroes']);
          return;
        }
        this.heroForm.patchValue(hero);
      });
  }

  get currentHero(): Hero {
    return this.heroForm.value as Hero;
  }

  public onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    if (this.heroForm.value.id) {
      this.heroesService.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackbar(`Hero ${hero.superhero} updated!`);
      });
      return;
    }

    this.heroesService.createHero(this.currentHero).subscribe((hero) => {
      this.showSnackbar(`Hero ${hero.superhero} created!`);
      this.router.navigate(['/heroes/edit', hero.id]);
    });
  }

  public showSnackbar(message: string): void {
    this.snackbar.open(message, 'ok!', {
      duration: 2500,
    });
  }

  public onDeleteHero(): void {
    if (!this.id) throw new Error('Hero id is required');

    const dialog = this.dialog.open(ConfirmDialogComponent, {
      data: this.currentHero,
    });

    dialog
      .afterClosed()
      .pipe(
        filter((result: boolean) => result),
        switchMap(() => this.heroesService.deleteHero(this.id)),
        filter((deleted) => deleted)
      )
      .subscribe(() => {
        this.showSnackbar(`Hero deleted!`);
        this.router.navigate(['/heroes']);
      });
  }
}
