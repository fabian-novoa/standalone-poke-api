import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { DetailPokemonComponent } from '../detail-pokemon/detail-pokemon.component';

@Component({
  selector: 'search-pokemon',
  standalone: true,
  imports: [CommonModule, FormsModule, DetailPokemonComponent],
  template: `
    <div class="max-w-2xl mx-auto p-4">
      <div class="mb-8">
        <input 
          type="text" 
          [(ngModel)]="searchTerm"
          (keyup.enter)="searchPokemon()"
          placeholder="Buscar Pokémon..." 
          class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <button 
          (click)="searchPokemon()"
          class="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Buscar
        </button>
      </div>

      @if (loading) {
        <div class="flex justify-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      }

      @if (error) {
        <div class="text-red-500 text-center p-4 bg-red-100 rounded-lg">
          {{ error }}
        </div>
      }

      @if (pokemon && !loading) {
        <app-detail-pokemon [pokemon]="pokemon"></app-detail-pokemon>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class SearchPokemonComponent {
  searchTerm: string = '';
  pokemon?: Pokemon;
  loading: boolean = false;
  error: string = '';

  constructor(private pokemonService: PokemonService) {}

  searchPokemon() {
    if (!this.searchTerm.trim()) {
      this.error = 'Por favor ingresa un nombre o número de Pokémon';
      return;
    }

    this.loading = true;
    this.error = '';
    this.pokemon = undefined;

    const searchMethod = isNaN(Number(this.searchTerm)) 
      ? this.pokemonService.getPokemonByName(this.searchTerm)
      : this.pokemonService.getPokemonById(Number(this.searchTerm));

    searchMethod.subscribe({
      next: (pokemon) => {
        if (pokemon) {
          this.pokemon = pokemon;
        } else {
          this.error = 'Pokémon no encontrado';
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al buscar el Pokémon';
        this.loading = false;
      }
    });
  }
}