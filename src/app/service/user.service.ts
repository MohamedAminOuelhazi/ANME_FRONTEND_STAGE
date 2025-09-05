import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { authres } from 'src/app/modules/authres';
import { user } from 'src/app/modules/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {


  host!: "http://localhost:8080";


  constructor(private httpclt: HttpClient) { }

  connect(username: string, password: string): Observable<authres> {
    return this.httpclt.post<authres>("http://localhost:8080/api/auth/login", { username: username, password: password })
  }

  register(url: string, userData: any): Observable<any> {
    return this.httpclt.post(url, userData);
  }


  getUsers(role: string): Observable<user[]> {
    return this.httpclt.get<user[]>("http://localhost:8080/api/auth/byRole", {
      params: { role: role }
    });
  }

  // Méthode spécifique pour les membres de commission
  getCommissionMembers(): Observable<user[]> {
    return this.getUsers('Commission_techniques');
  }

  // Méthodes supplémentaires utiles
  getDirectionTechniqueMembers(): Observable<user[]> {
    return this.getUsers('Direction_technique');
  }

  getFteMembers(): Observable<user[]> {
    return this.getUsers('Fte');
  }





}
