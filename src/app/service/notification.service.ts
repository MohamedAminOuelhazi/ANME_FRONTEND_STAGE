import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<AppNotification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadNotifications(): void {
    this.http.get<AppNotification[]>('http://localhost:8080/api/notifications').subscribe(notifs => {
      this.notificationsSubject.next(notifs);
    });
  }

  markAsRead(notificationId: number): Observable<void> {
    return this.http.post<void>(`http://localhost:8080/api/notifications/${notificationId}/read`, {});
  }
}