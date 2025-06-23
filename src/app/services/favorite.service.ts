import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
    // Key to store bookmarks in localStorage
    private readonly FAVORITES_KEY = 'pokemon_favorites';
    // BehaviorSubject to notify of changes in the favorites list
    private _favorites: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(this.getFavoritesFromStorage());
    public readonly favorites$:  Observable<any[]> = this._favorites.asObservable();

  constructor() { }

  /**
   * Retrives the list of favorite Pokemons from localStorage.
   * @Returns An array of favorite Pokemon IDs.
   */
  private getFavoritesFromStorage(): any[] {
    const favorites = localStorage.getItem(this.FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  }

  /**
   * Saves the current list of favorites to localStorage.
   * @param favorites The array of favorite Pokemon objects.
   */
  private saveFavoritesToStorage(favorites: any[]) : void {
    localStorage.setItem(this.FAVORITES_KEY, JSON.stringify(favorites));
    this._favorites.next(favorites);
  }

  /**
   * Checks if a Pokemon is in the favorite list.
   * @param pokemonId the ID of the Pokemon to check.
   * @returns True if the Pokemon is a favorite, false otherwise.
   */
  isPokemonFavorite(pokemonId: number): boolean {
    const favorites = this.getFavoritesFromStorage();
    return favorites.some(fav => fav.id === pokemonId);
  }

  /**
   * Adds a Pokemon to the favorite list.
   * @param pokemon the Pokemon objeto to add.
   */
  addFavoritePokemon(pokemon: any): void {
    const favorites = this.getFavoritesFromStorage();
    if(!this.isPokemonFavorite(pokemon.id)) {
      favorites.push(pokemon);
      this.saveFavoritesToStorage(favorites);
    }
  }

  /**
   * Removes a Pokemon from the favorite list.
   * @param pokemonId the ID of the POkemon to remove
   */
  removeFavoritePokemon(pokemonId: number): void {
    let favorites = this.getFavoritesFromStorage();
    favorites = favorites.filter(fav => fav.id !== pokemonId);
    this.saveFavoritesToStorage(favorites);
  }

  /**
   * Toggles the favorite status of a Pokemon.
   * @param pokemon the Pokemon object to toggle.
   * @returns true if the Pokemon is now a favorite, false otherwise. 
   */
  toggleFavorite(pokemon: any): boolean {
    if(this.isPokemonFavorite(pokemon.id)) {
      this.removeFavoritePokemon(pokemon.id);
      return false;
    } else {
      this.addFavoritePokemon(pokemon);
      return true;
    }
  }
}
