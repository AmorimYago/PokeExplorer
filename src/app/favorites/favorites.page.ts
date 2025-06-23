import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../services/favorite.service';
import { Observable, Subscription } from 'rxjs';
import { IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonImg,
  IonButtons,
  IonBackButton,
  IonIcon 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heart } from 'ionicons/icons';



@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
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
    IonImg,
    IonButtons,
    IonBackButton,
    IonIcon,
    CommonModule,
    RouterLink
  ],
})
export class FavoritesPage implements OnInit, OnDestroy {
  favoritePokemons: any[] = [];
  private favoritesSubscription: Subscription | null = null;

  constructor(private favoriteService: FavoriteService) {
    addIcons({ heart });
  }

  ngOnInit() {
    this.favoritesSubscription = this.favoriteService.favorites$.subscribe(favs => {
      this.favoritePokemons = favs;
      console.log('Favorites loaded: ', this.favoritePokemons);
    });
  }

  ngOnDestroy() {
      if (this.favoritesSubscription) {
        this.favoritesSubscription.unsubscribe();
      }
  }

}
