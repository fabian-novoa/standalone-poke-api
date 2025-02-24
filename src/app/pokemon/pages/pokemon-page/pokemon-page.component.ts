import { Component } from '@angular/core';
import { SearchPokemonComponent } from '../../components/search-pokemon/search-pokemon.component';

@Component({
  selector: 'app-pokemon-page',
  standalone: true,
  imports: [SearchPokemonComponent],
  template: `
    <div class="min-h-screen bg-gray-100">
      <header class="bg-red-600 text-white py-6 mb-8">
        <div class="container mx-auto px-4">
          <h1 class="text-3xl font-bold text-center">Pokédex</h1>
        </div>
      </header>

      <main class="container mx-auto px-4">
        <search-pokemon></search-pokemon>
      </main>
    </div>
  `
})
export class PokemonPageComponent {}