import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) { }

  getPokemonById(id: number): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  getPokemonByName(name: string): Observable<Pokemon | undefined> {
    return this.http.get<Pokemon>(`${this.baseUrl}/${name.toLowerCase()}`).pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  getPokemons(limit: number = 20, offset: number = 0): Observable<any> {
    return this.http.get(`${this.baseUrl}?limit=${limit}&offset=${offset}`).pipe(
      catchError((error) => {
        console.log(error);
        return of(undefined);
      })
    );
  }
}