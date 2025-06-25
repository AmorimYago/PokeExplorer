import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PokemonService } from '../services/pokemon.service';
import { FavoriteService } from '../services/favorite.service';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonLabel,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonList, IonItem, IonText,
  IonButtons, IonBackButton, IonSpinner, IonProgressBar, IonChip
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { heartOutline, heartSharp, alertCircleOutline  } from 'ionicons/icons';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, map, switchMap, forkJoin } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonIcon, IonLabel,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonImg, IonList, IonItem, IonText,
    IonButtons, IonBackButton, IonSpinner, IonProgressBar, IonChip, CommonModule, RouterLink
  ],
})
export class DetailsPage implements OnInit {
  pokemonId: string | null = null;
  pokemonDetails: any = null;
  pokemonSpecies: any = null;
  pokemonWeaknesses: any[] = [];
  pokemonEvolutionChain: any[] = [];
  isLoading: boolean = true;
  isFavorite: boolean = false;
  errorLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private pokemonService: PokemonService,
    private favoriteService: FavoriteService
  ) { 
    addIcons({ heartOutline, heartSharp, alertCircleOutline });
  }

  ngOnInit() {
    this.pokemonId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.pokemonId) {
      this.loadPokemonDetails(this.pokemonId);
    }
  }

  loadPokemonDetails(id: string) {
    this.isLoading = true;
    this.errorLoading = false;
    this.errorMessage = '';
    this.pokemonDetails = null;
    this.pokemonSpecies = null;
    this.pokemonWeaknesses = [];
    this.pokemonEvolutionChain = [];

    this.pokemonService.getPokemonDetails(id).pipe(
      switchMap((pokemonData: any) => {
        this.pokemonDetails = pokemonData;

        this.pokemonDetails.sprites.front_default =
          pokemonData.sprites.other?.['official-artwork']?.front_default ||
          pokemonData.sprites.front_default ||
          'assets/placeholder.png'; // Fallback final

        // Fetch Species data for description, category, gender
        const speciesRequest = this.pokemonService.getPokemonSpecies(pokemonData.species.name);

        // Fetch Type details for weaknesses
        const typeRequests = pokemonData.types.map((typeInfo: any) =>
          this.pokemonService.getPokemonTypeDetails(typeInfo.type.name)
        );

        return forkJoin([speciesRequest, ...typeRequests]);
      })
    ).subscribe(
      ([speciesData, ...typeDetails]: [any, ...any[]]) => {
        this.pokemonSpecies = speciesData;

        // Extract Category (Genus)
        this.pokemonDetails.category = speciesData.genera.find((g: any) => g.language.name === 'en')?.genus || 'Unknown';

        // Extract Description (Flavor Text)
        this.pokemonDetails.description = speciesData.flavor_text_entries.find((ft: any) => ft.language.name === 'en')?.flavor_text.replace(/\n/g, ' ') || 'No description available.';

        // Calculate Gender Ratio
        if (speciesData.gender_rate === -1) {
          this.pokemonDetails.gender_ratio = 'Genderless';
        } else if (speciesData.gender_rate === 8) {
          this.pokemonDetails.gender_ratio = '100% Female';
        } else if (speciesData.gender_rate === 0) {
          this.pokemonDetails.gender_ratio = '100% Male';
        } else {
          const malePercentage = (8 - speciesData.gender_rate) * 12.5;
          const femalePercentage = speciesData.gender_rate * 12.5;
          this.pokemonDetails.gender_ratio = `${malePercentage}% Male, ${femalePercentage}% Female`;
        }

        // Calculate Weaknesses
        const damageMultipliers: { [key: string]: number } = {};

        typeDetails.forEach(typeData => {
          typeData.damage_relations.double_damage_from.forEach((weaknessType: any) => {
            damageMultipliers[weaknessType.name] = (damageMultipliers[weaknessType.name] || 1) * 2;
          });
          typeData.damage_relations.half_damage_from.forEach((resistanceType: any) => {
            damageMultipliers[resistanceType.name] = (damageMultipliers[resistanceType.name] || 1) * 0.5;
          });
          typeData.damage_relations.no_damage_from.forEach((immunityType: any) => {
            damageMultipliers[immunityType.name] = 0; 
          });
        });

        this.pokemonWeaknesses = Object.keys(damageMultipliers)
          .filter(type => damageMultipliers[type] > 1)
          .sort((a, b) => damageMultipliers[b] - damageMultipliers[a])
          .map(type => ({ name: type, multiplier: damageMultipliers[type] }));


        if (speciesData.evolution_chain?.url) {
          this.pokemonService.getEvolutionChain(speciesData.evolution_chain.url).subscribe(
            (evoChainData: any) => {
              this.pokemonEvolutionChain = this.parseAllEvolutionBranches(evoChainData.chain);

              const evoDetailRequests: Observable<any>[] = this.pokemonEvolutionChain.map(evo =>
                this.pokemonService.getPokemonDetails(evo.name).pipe(
                  map(detail => {
                    return {
                      name: evo.name,
                      id: evo.id,
                      image: detail.sprites.other?.['official-artwork']?.front_default ||
                             detail.sprites.front_default ||
                             'assets/placeholder.png',
                      types: detail.types
                    };
                  })
                )
              );
              forkJoin(evoDetailRequests).subscribe(
                (updatedEvoChain: any[]) => {
                  this.pokemonEvolutionChain = updatedEvoChain;
                },
                (error) => console.error('Error loading evolution Pokemon details:', error)
              );
            },
            (error) => console.error('Error loading evolution chain:', error)
          );
        }

        this.isFavorite = this.favoriteService.isPokemonFavorite(this.pokemonDetails.id);
        this.isLoading = false;
      },
      (error: HttpErrorResponse) => {
        console.error('Error loading additional Pokemon details or species data:', error);
        this.isLoading = false;
        this.errorLoading = true;
        if (error.status === 404) {
          const baseName = id.split('-')[0];
          if (baseName !== id) {
            this.errorMessage = `Pokemon variant "${id}" not found. Attempting to load base form: ${baseName}.`;
            this.pokemonService.getPokemonDetails(baseName).subscribe(
              (baseData: any) => {
                this.pokemonDetails = baseData;
                this.pokemonDetails.sprites.front_default =
                  baseData.sprites.other?.['official-artwork']?.front_default ||
                  baseData.sprites.front_default ||
                  'assets/placeholder.png';
                this.isFavorite = this.favoriteService.isPokemonFavorite(this.pokemonDetails.id);
                this.errorLoading = false;
                this.errorMessage = '';
              },
              (baseError) => {
                this.errorMessage = `Failed to load details for "${id}" and its base form "${baseName}". Please try again.`;
                this.pokemonDetails = {
                  id: 0, name: id, sprites: { front_default: 'assets/placeholder.png' },
                  height: 'N/A', weight: 'N/A', types: [], abilities: [], stats: [],
                  category: 'N/A', gender_ratio: 'N/A', description: 'N/A',
                };
              }
            );
          } else {
            this.errorMessage = `Pokemon "${id}" not found.`;
            this.pokemonDetails = {
              id: 0, name: id, sprites: { front_default: 'assets/placeholder.png' },
              height: 'N/A', weight: 'N/A', types: [], abilities: [], stats: [],
              category: 'N/A', gender_ratio: 'N/A', description: 'N/A',
            };
          }
        } else {
          this.errorMessage = `An error occurred while loading Pokemon details: ${error.message}`;
          this.pokemonDetails = {
            id: 0, name: id, sprites: { front_default: 'assets/placeholder.png' },
            height: 'N/A', weight: 'N/A', types: [], abilities: [], stats: [],
            category: 'N/A', gender_ratio: 'N/A', description: 'N/A',
          };
        }
      }
    );
  }

  // Helper function to get stat color (from the image you provided)
  getStatColor(value: number): string {
    if (value < 50) return 'danger'; // Red for low
    if (value < 90) return 'warning'; // Yellow for mid
    return 'success'; // Green for high
  }

  private parseAllEvolutionBranches(chain: any): any[] {
    const evolutions: any[] = [];
    const queue = [chain]

    while (queue.length > 0) {
      const currentEvo = queue.shift();

      if (currentEvo && currentEvo.species) {
        const speciesUrlParts = currentEvo.species.url.split('/');
        const id = speciesUrlParts[speciesUrlParts.length - 2];

        evolutions.push({
          name: currentEvo.species.name,
          id: id,
          image: '',
          types: []
        });

        currentEvo.evolves_to.forEach((nextEvo: any) => {
          queue.push(nextEvo);
        });
      }
    }
    return evolutions;
  }

  toggleFavorite() {
    if (this.pokemonDetails) {
      const pokemonToSave = {
        id: this.pokemonDetails.id,
        name: this.pokemonDetails.name,
        image: this.pokemonDetails.sprites.front_default,
        category: this.pokemonDetails.category,
      };
      this.isFavorite = this.favoriteService.toggleFavorite(pokemonToSave);
      console.log(`Pokemon ${pokemonToSave.name} favorite status toggled to: ${this.isFavorite}`);
    }
  }
}