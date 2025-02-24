import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { Pokemon } from '../../interfaces/pokemon.interface';

@Component({
  selector: 'search-pokemon',
  standalone: true,
  imports: [],
  templateUrl: './search-pokemon.component.html',
  styleUrl: './search-pokemon.component.css'
})
export class SearchPokemonComponent implements OnInit {

  constructor(private pokemonService: PokemonService) { }

  pokemon?: Pokemon;
  ngOnInit(): void {
      this.pokemonService.getPokemon().subscribe(
        {
          next: (poke: Pokemon | undefined) => {
            console.log(poke);
            this.pokemon = poke
          },
          error: (error) => {
            console.log(error);
          }

        }
      )
    }
  }


