import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, AppNotification } from '../service/notification.service';
import { LucideAngularModule, Bell } from 'lucide-angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  notifications: AppNotification[] = [];
  unreadCount = 0;
  role: string = '';

  constructor(private router: Router, private notifService: NotificationService) { }

  ngOnInit(): void {
    this.loadNotifications();
    this.role = localStorage.getItem('role') || '';

  }

  loadNotifications() {
    this.notifService.loadNotifications();
    this.notifService.notifications$.subscribe(notifs => {
      this.notifications = notifs;
      this.updateUnreadCount();
    });
  }

  // Retourne uniquement les notifications non lues
  get filteredNotifications(): AppNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  updateUnreadCount() {
    this.unreadCount = this.filteredNotifications.length;
  }

  onNotificationClick(notif: AppNotification) {
    if (!notif.read) {
      this.notifService.markAsRead(notif.id).subscribe(() => {
        notif.read = true;
        this.updateUnreadCount();
      });
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
    localStorage.clear();

  }
}
