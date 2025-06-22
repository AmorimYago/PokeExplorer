import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private baseUrl = 'https://pokeapi.co/api/v2';

  constructor(private http: HttpClient) { }

  // Method that obtains the list of Pokémon
  getPokemonList(offset: number = 0, limit: number = 20): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon?offset=${offset}&limit=${limit}`);
  }

  // Method that obtains the details of specific Pokémon by name or ID
  getPokemonDetails(nameOrId: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/pokemon/${nameOrId}`)
  }

  // Methods to add in the future: types, skills, etc.
}
