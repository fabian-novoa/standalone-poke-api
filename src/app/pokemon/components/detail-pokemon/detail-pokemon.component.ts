import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'app-detail-pokemon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="p-4">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-2xl font-bold capitalize">{{ pokemon.name }}</h2>
          <span class="text-gray-500">#{{ pokemon.id.toString().padStart(3, '0') }}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="flex justify-center">
            <img 
              [src]="getPokemonImage()"
              [alt]="pokemon.name"
              class="w-48 h-48 object-contain"
            >
          </div>

          <div class="space-y-4">
            <div>
              <h3 class="font-semibold mb-2">Tipos:</h3>
              <div class="flex gap-2">
                @for (type of pokemon.types; track type.type.name) {
                  <span class="px-3 py-1 rounded-full text-sm" 
                        [ngClass]="getTypeColor(type.type.name)">
                    {{ type.type.name }}
                  </span>
                }
              </div>
            </div>

            <div>
              <h3 class="font-semibold mb-2">Estadísticas:</h3>
              @for (stat of pokemon.stats; track stat.stat.name) {
                <div class="mb-2">
                  <div class="flex justify-between mb-1">
                    <span class="text-sm capitalize">{{ stat.stat.name }}</span>
                    <span class="text-sm font-semibold">{{ stat.base_stat }}</span>
                  </div>
                  <div class="w-full bg-gray-200 rounded-full h-2">
                    <div class="bg-blue-500 rounded-full h-2" 
                         [style.width.%]="(stat.base_stat / 255) * 100">
                    </div>
                  </div>
                </div>
              }
            </div>

            <div>
              <h3 class="font-semibold mb-2">Dimensiones:</h3>
              <p>Altura: {{ pokemon.height / 10 }} m</p>
              <p>Peso: {{ pokemon.weight / 10 }} kg</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DetailPokemonComponent {
  @Input({ required: true }) pokemon!: Pokemon;

  getPokemonImage(): string {
    return this.pokemon.sprites.other?.['official-artwork']?.front_default || 
           this.pokemon.sprites.front_default ||
           'assets/pokemon-placeholder.png';
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      normal: 'bg-gray-400 text-white',
      fire: 'bg-red-500 text-white',
      water: 'bg-blue-500 text-white',
      electric: 'bg-yellow-400 text-white',
      grass: 'bg-green-500 text-white',
      ice: 'bg-blue-200 text-gray-800',
      fighting: 'bg-red-700 text-white',
      poison: 'bg-purple-500 text-white',
      ground: 'bg-yellow-600 text-white',
      flying: 'bg-indigo-400 text-white',
      psychic: 'bg-pink-500 text-white',
      bug: 'bg-green-600 text-white',
      rock: 'bg-yellow-800 text-white',
      ghost: 'bg-purple-700 text-white',
      dragon: 'bg-indigo-700 text-white',
      dark: 'bg-gray-800 text-white',
      steel: 'bg-gray-500 text-white',
      fairy: 'bg-pink-300 text-white'
    };

    return typeColors[type] || 'bg-gray-400 text-white';
  }
}