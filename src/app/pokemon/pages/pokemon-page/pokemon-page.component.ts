import { Component, NgZone } from '@angular/core';
import { SearchPokemonComponent } from '../../components/search-pokemon/search-pokemon.component';
import { CognitoService } from '../../shared/services/cognito.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pokemon-page',
  standalone: true,
  imports: [SearchPokemonComponent],
  template: `
<div class="min-h-screen bg-gray-100">
  <header class="bg-red-600 text-white py-6 mb-8">
    <div class="container mx-auto px-4 relative">
      <h1 class="text-3xl font-bold text-center">Pokédex</h1>
      <button 
        (click)="logout()" 
        class="absolute right-4 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-gray-100 transition-colors font-medium">
        Logout
      </button>
    </div>
  </header>

  <main class="container mx-auto px-4">
    <search-pokemon></search-pokemon>
  </main>
</div>
  `
})
export class PokemonPageComponent {

  constructor(private cognitoService: CognitoService, private router: Router, private ngZone: NgZone) {
    this.navigateToLogin();
  }

  navigateToLogin(): void {
    if (!sessionStorage.getItem('session_token')) this.ngZone.run(() => {this.router.navigate(['login'])});
  }

  async logout(): Promise<void> {
    try {
      await this.cognitoService.handleSignOut();
      sessionStorage.removeItem('session_token');
      sessionStorage.removeItem('user_id');
      sessionStorage.removeItem('user_username');
      
      this.ngZone.run(() => {
        this.router.navigate(['login']);
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }


}