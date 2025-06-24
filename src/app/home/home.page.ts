import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg,
  IonInfiniteScroll, IonInfiniteScrollContent,
  IonButtons, IonButton, IonIcon  } from '@ionic/angular/standalone';
import { PokemonService } from '../services/pokemon.service';
import { forkJoin, Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';

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
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonButtons,
    IonButton,
    IonIcon,
    CommonModule,
    RouterLink
  ],
})
export class HomePage implements OnInit {
  pokemons: any [] = [];
  offset: number = 0;
  limit: number = 56;
  canLoadMore: boolean = true;

  constructor(private pokemonService: PokemonService) {
    addIcons({ heart });
  }

  ngOnInit() {
      this.loadPokemons();
  }

  loadPokemons(event?: any) {
    this.pokemonService.getPokemons(this.offset, this.limit).subscribe(
      (data: any) => {
        const pokemonRequests: Observable<any>[] = data.results.map((pokemon: any) =>
          this.pokemonService.getPokemonDetails(pokemon.name)
      );

      // Uses forkJoin to wait for all detail requests to finish
      forkJoin<any[]>(pokemonRequests).subscribe(
        (pokemonDetails: any[]) => {
          // Combines the original data (name, url) with the full details
          const completePokemons = data.results.map((pokemon: any, index: number) => {
            const details = pokemonDetails[index];
            const imageUrl = details.sprites.other?.['official-artwork']?.front_default || details.sprites.front_default || 'assets/placeholder.png';
            return {
              name: pokemon.name,
              url: pokemon.url,
              image: imageUrl,
              // TODO Add other details here in the future 
              id: details.id
            };
          });

          this.pokemons = [...this.pokemons, ...completePokemons];
          this.offset += this.limit;

          if (data.results.length < this.limit) {
            this.canLoadMore = false;
          }


          console.log('Pokemons loaded: ', this.pokemons.length);
          if (event) {
            event.target.complete();
            event.target.disabled = !this.canLoadMore;
          }
        },
        (error) => {
          console.error('Error loading Pokemon details: ', error);
          this.canLoadMore = false;
          if (event) {
            event.target.complete();
            event.target.disabled = true;
          }
        }
      );
      },
      (error) => {
        console.error('Error loading Pokemons: ', error);
        this.canLoadMore = false;
        if (event) {
          event.target.complete();
          event.target.disabled = true;
        }
        // TODO Implement more user-friendly error handling
      }
    );
  }
}
