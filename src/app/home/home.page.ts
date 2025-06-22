import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
// Imports of standalone Ionic components that you will use in HTML
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, CommonModule],
})
export class HomePage implements OnInit {
  pokemons: any [] = [];
  offset: number = 0;
  limit: number = 20;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
      this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonService.getPokemonList(this.offset, this.limit).subscribe(
      (data: any) => {
        // PokeAPI returns an object with ‘results’ which is an array of { name: string, url: string }
        this.pokemons = [...this.pokemons, ...data.results];
        console.log('Pokemons loaded: ', this.pokemons);
      },
      (error) => {
        console.error('Error loading Pokemons: ', error);
        // TODO Implement more user-friendly error handling
      }
    )
  }
}
