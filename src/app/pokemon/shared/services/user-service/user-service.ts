import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CognitoService } from '../cognito.service';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public userIdSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public usernameSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public emailSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  public userId$: Observable<string | null> = this.userIdSubject.asObservable();
  public username$: Observable<string | null> = this.usernameSubject.asObservable();
  public email$: Observable<string | null> = this.emailSubject.asObservable();

  constructor(private cognitoService: CognitoService) {
    this.assignBehaviorSubjectsOnInit();
  }

  public setUserId(userId: string): void {
    this.userIdSubject.next(userId);
    sessionStorage.setItem('user_id', userId);
  }

  public setUsername(username: string): void {
    this.usernameSubject.next(username);
    sessionStorage.setItem('user_username', username);
  }

  public setEmail(email: string): void {
    this.emailSubject.next(email);
    sessionStorage.setItem('user_email', email);
  }

  public assignBehaviorSubjectsOnInit(): void {
    const userId = sessionStorage.getItem('user_id');
    const username = sessionStorage.getItem('user_username');
    const email = sessionStorage.getItem('user_email');

    if (userId) this.setUserId(userId);
    if (username) this.setUsername(username);
    if (email) this.setEmail(email);
  }

  /**
   * Asigna los valores del usuario después de una autenticación exitosa
   * @param email Email del usuario que se autenticó
   */
  public async assignUserValues(email: string): Promise<void> {
    try {
      // Ya que no tenemos acceso directo a los métodos de obtención de información
      // del usuario en CognitoService, usaremos los datos disponibles
      
      // Guardar el email
      this.setEmail(email);
      
      // Generamos ID si no existe (o usamos uno existente en sessionStorage)
      const userId = sessionStorage.getItem('user_id') || 'user_' + Math.random().toString(36).substring(2, 15);
      this.setUserId(userId);
      
      // Usar el valor del nombre de usuario del formulario o extraerlo del email
      const usernameFromStorage = sessionStorage.getItem('user_username');
      const username = usernameFromStorage || email.split('@')[0];
      this.setUsername(username);
      
      // Guardar un token de sesión genérico
      if (!sessionStorage.getItem('session_token')) {
        sessionStorage.setItem('session_token', 'active_session_' + Date.now());
      }
    } catch (error) {
      console.error('Error obteniendo información del usuario:', error);
      throw error;
    }
  }

  public clearUserData(): void {
    sessionStorage.removeItem('session_token');
    sessionStorage.removeItem('user_id');
    sessionStorage.removeItem('user_username');
    sessionStorage.removeItem('user_email');
    
    this.userIdSubject.next(null);
    this.usernameSubject.next(null);
    this.emailSubject.next(null);
  }
}