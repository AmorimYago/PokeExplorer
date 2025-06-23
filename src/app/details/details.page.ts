import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { FavoriteService } from '../services/favorite.service';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonList, IonItem, IonText, IonButtons, IonBackButton, IonSpinner } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heartSharp } from 'ionicons/icons'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonIcon,
    IonLabel,
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonCardContent,
    IonImg,
    IonList,
    IonItem,
    IonText,
    CommonModule,
    IonButtons,
    IonBackButton,
    IonSpinner
  ],
})
export class DetailsPage implements OnInit {
  pokemonId: string | null = null;
  pokemonDetails: any = null;
  isLoading: boolean = true;
  isFavorite: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService
  ) { 
    addIcons({ heartOutline, heartSharp});
  }

  ngOnInit() {
    this.pokemonId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.pokemonId) {
      this.loadPokemonDetails(this.pokemonId);
    }
  }

  loadPokemonDetails(id: string) {
    this.isLoading = true;
    this.pokemonService.getPokemonDetails(id).subscribe(
      (data: any) => {
        this.pokemonDetails = data;
        console.log('POkemon Details: ', this.pokemonDetails);
        this.isFavorite = this.favoriteService.isPokemonFavorite(this.pokemonDetails.id);
        this.isLoading = false;
        // TODO: In future, check if is a favorite here
      },
      (error) => {
        console.error('Error loading POkemon details: ', error);
        this.isLoading = false;
        // TODO: Implement user feedback in the event of an error
      }
    );
  }

    toggleFavorite() {
      if(this.pokemonDetails) {
        this.isFavorite = this.favoriteService.toggleFavorite(this.pokemonDetails);
      }
      console.log(`Pokemon ${this.pokemonDetails.name} favorite status toggled to: ${this.isFavorite}`);
    }

}
