import { Routes } from '@angular/router';
import { AuthenticationComponent } from './pokemon/pages/authentication/authentication.component';
import { PokemonPageComponent } from './pokemon/pages/pokemon-page/pokemon-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', title: 'Home', component: PokemonPageComponent },
    { path: 'login', title: 'Login', component: AuthenticationComponent },
    { path: 'register', title: 'Register', component: AuthenticationComponent },
    { path: 'classroom/:id', title: 'Classroom', component: PokemonPageComponent },
  ];