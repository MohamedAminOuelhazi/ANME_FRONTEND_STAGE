import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { ReunionService } from '../../service/reunion.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creation',
  templateUrl: './creation.component.html',
  styleUrls: ['./creation.component.css']
})
export class CreationComponent implements OnInit {
  forminput: FormGroup;

  validateurs: any[] = [];
  participants: any[] = [];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private reunionService: ReunionService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.forminput = this.fb.group({
      sujet: [''],
      description: [''],
      dateProposee: [this.formatDate(new Date())], // formaté
      validateurIds: this.fb.array([]),
      participantIds: this.fb.array([])
    });
  }
  private formatDate(date: Date): string {
    const pad = (n: number) => n < 10 ? '0' + n : n;
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  ngOnInit() {
    this.userService.getUsers("Direction_technique").subscribe(users => {
      this.validateurs = users;
      console.log('Validateurs reçus:', this.validateurs);
      this.addCheckboxes('validateurIds', this.validateurs.length);
    });

    this.userService.getUsers("Commission_techniques").subscribe(users => {
      this.participants = users;
      console.log('Participants reçus:', this.participants);
      this.addCheckboxes('participantIds', this.participants.length);
    });
  }

  private addCheckboxes(controlName: 'validateurIds' | 'participantIds', length: number) {
    const formArray = this.forminput.get(controlName) as FormArray;
    for (let i = 0; i < length; i++) {
      formArray.push(new FormControl(false));
    }
  }

  createReunion(): void {
    const selectedValidateurIds = this.forminput.value.validateurIds
      .map((checked: boolean, i: number) => checked ? this.validateurs[i].id : null)
      .filter((v: any) => v !== null);

    const selectedParticipantIds = this.forminput.value.participantIds
      .map((checked: boolean, i: number) => checked ? this.participants[i].id : null)
      .filter((v: any) => v !== null);

    const payload = {
      sujet: this.forminput.value.sujet,
      description: this.forminput.value.description,
      dateProposee: this.forminput.value.dateProposee,
      validateurIds: selectedValidateurIds,
      participantIds: selectedParticipantIds
    };

    this.reunionService.createReunion(payload).subscribe({
      next: () => {
        this.toastr.success('Réunion créée avec succès');
        this.router.navigate(['/Dashboard_fte/consulterReunion']);
      },
      error: err => {
        this.toastr.error('Erreur lors de la création de la réunion');
        console.error('Erreur création réunion', err);
      }
    });
  }
}
