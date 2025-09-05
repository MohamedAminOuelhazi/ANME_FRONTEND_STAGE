import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReunionRequestDTO } from '../modules/ReunionRequestDTO';
import { ReunionResponseDTO } from '../modules/ReunionResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  private baseUrl = 'http://localhost:8080/api/reunions';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  private getAuthHeadersForFormData(): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
      // Ne pas définir Content-Type pour FormData, Angular le fait automatiquement
    });
  }

  getMesReunions(): Observable<ReunionResponseDTO[]> {
    return this.http.get<ReunionResponseDTO[]>(`${this.baseUrl}/mesReunions`, {
      headers: this.getAuthHeaders()
    });
  }

  createReunion(reunion: ReunionRequestDTO): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/creerReunion`, reunion, {
      headers: this.getAuthHeaders()
    });
  }

  getReunions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Valider une réunion (avec FormData pour les fichiers)
  validerReunion(id: number, formData: FormData): Observable<any> {

    return this.http.post(`${this.baseUrl}/${id}/validation`, formData, {
      headers: this.getAuthHeadersForFormData()
    });
  }

  // Rejeter une réunion
  rejeterReunion(id: number, payload: { motifRejet: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/rejet`, payload, {
      headers: this.getAuthHeaders()
    });
  }

  // Confirmer une réunion (FTE)
  confirmerReunion(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/confirmation`, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Annuler une réunion
  annulerReunion(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/annulation`, {
      headers: this.getAuthHeaders()
    });
  }



  // === PV ===
  // Récupérer un PV par réunion
  getPvByReunionId(reunionId: number): Observable<any> {
    return this.http.get<any>(`http://localhost:8080/api/pv/reunion/${reunionId}`, {
      headers: this.getAuthHeaders()
    });
  }

  // Télécharger un PV
  downloadPv(pvId: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/api/pv/${pvId}/download`, {
      responseType: 'blob', // essentiel pour les fichiers binaires
      headers: this.getAuthHeaders()
    });
  }

  signPv(pvId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('signature', file);

    return this.http.post<void>(`http://localhost:8080/api/pv/${pvId}/sign`, formData);
  }

  rejectPv(pvId: number, motif: string): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.post<void>(`http://localhost:8080/api/pv/${pvId}/reject`, { motif }, { headers });
  }

  uploadNewPvVersion(reunionId: number, formData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();

    return this.http.post(`http://localhost:8080/api/pv/${reunionId}/upload-version`, formData, { headers });
  }

  // === Fichiers réunion ===
  getFichiers(reunionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${reunionId}/getfichiers`, {
      headers: this.getAuthHeaders()
    });
  }


  downloadFile(fileId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/fichiers/${fileId}/download`, {
      responseType: 'blob',  // Très important pour récupérer le PDF ou fichier binaire
      headers: this.getAuthHeaders()
    });
  }

  viewPv(id: number): Observable<Blob> {
    return this.http.get(`http://localhost:8080/api/pv/${id}/view`, { responseType: 'blob' });
  }

}