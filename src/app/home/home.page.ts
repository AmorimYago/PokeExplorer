import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Imports of standalone Ionic components that you will use in HTML
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg } from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonLabel, 
    IonCard, 
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg, 
    CommonModule
  ],
})
export class HomePage implements OnInit {
  pokemons: any [] = [];
  offset: number = 0;
  limit: number = 51;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
      this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe(
      (data: any) => {
        // PokeAPI returns an object with ‘results’ which is an array of { name: string, url: string }
        const pokemonRequests = data.results.map((pokemon: any) =>
          this.pokemonService.getPokemonDetails(pokemon.name)
      );

      // Uses forkJoin to wait for all detail requests to finish
      forkJoin<any[]>(pokemonRequests).subscribe(
        (pokemonDetails: any[]) => {
          // Combines the original data (name, url) with the full details
          const completePokemons = data.results.map((pokemon: any, index: number) => {
            const details = pokemonDetails[index];
            return {
              name: pokemon.name,
              url: pokemon.url,
              image: details.sprites.front_default,
              // TODO Add other details here in the future 
              id: details.id
            };
          });
          this.pokemons = [...this.pokemons, ...completePokemons];
          console.log('Pokemons loaded: ', this.pokemons);
        },
        (error) => {
          console.error('Error loading Pokemon details: ', error);
        }
      );
      },
      (error) => {
        console.error('Error loading Pokemons: ', error);
        // TODO Implement more user-friendly error handling
      }
    );
  }
}
