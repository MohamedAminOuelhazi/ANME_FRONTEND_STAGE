import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PvService {

  private baseUrl = 'http://localhost:8080/api/pv';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  createPV(formData: FormData): Observable<any> {
    return this.http.post(this.baseUrl, formData, {
      headers: this.getAuthHeaders()
    });
  }
}
