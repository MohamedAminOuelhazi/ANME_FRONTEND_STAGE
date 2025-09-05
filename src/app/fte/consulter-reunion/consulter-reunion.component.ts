import { Component, OnInit } from '@angular/core';
import { ReunionService } from '../../service/reunion.service';
import { ReunionResponseDTO } from '../../modules/ReunionResponseDTO';

@Component({
  selector: 'app-consulter-reunion',
  templateUrl: './consulter-reunion.component.html',
  styleUrls: ['./consulter-reunion.component.css']
})
export class ConsulterReunionComponent implements OnInit {
  reunions: ReunionResponseDTO[] = [];
  token: string | null = null;
  errorMessage: string | null = null;

  constructor(private reunionService: ReunionService) { }

  ngOnInit(): void {
    this.loadReunions();
  }

  loadReunions(): void {
    this.token = localStorage.getItem("token");

    if (!this.token) {
      this.errorMessage = 'Token d\'authentification non trouvé. Veuillez vous connecter.';
      console.error(this.errorMessage);
      return;
    }

    this.reunionService.getMesReunions().subscribe({
      next: (data) => {
        this.reunions = data;
        console.log(this.reunions);
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la récupération des réunions.';
        console.error('Erreur API : ', err);
      }
    });
  }
}
