import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Hero } from '../interfaces/hero.interface';
import { Observable, catchError, of } from 'rxjs';
import { environments } from '../../../environments/enviroments';

@Injectable({ providedIn: 'root' })
export class HeroesService {
  private readonly url: string = environments.baseUrl + '/heroes';
  constructor(private http: HttpClient) {}

  public getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.url);
  }

  public getHeroById(id: string): Observable<Hero | undefined> {
    return this.http
      .get<Hero>(`${this.url}/${id}`)
      .pipe(catchError(() => of(undefined)));
  }

  public getSuggestions(query: string): Observable<Hero[]> {
    return this.http.get<Hero[]>(`${this.url}?=q${query}&_limit=6`);
  }

  public createHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.url, hero);
  }

  public updateHero(hero: Hero): Observable<Hero> {
    return this.http.put<Hero>(`${this.url}/${hero.id}`, hero);
  }

  public deleteHero(id: string): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
