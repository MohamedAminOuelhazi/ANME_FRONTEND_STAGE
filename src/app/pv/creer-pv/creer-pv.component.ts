import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReunionService } from '../../service/reunion.service';
import { PvService } from '../../service/pv.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-creer-pv',
  templateUrl: './creer-pv.component.html',
  styleUrls: ['./creer-pv.component.css']
})
export class CreerPvComponent implements OnInit {

  pvForm: FormGroup;
  selectedFile: File | null = null;
  reunions: any[] = [];

  constructor(
    private fb: FormBuilder,
    private pvService: PvService,
    private reunionService: ReunionService,
    private toastr: ToastrService
  ) {
    this.pvForm = this.fb.group({
      reunionId: [null, Validators.required],
      titre: ['', Validators.required],
      contenu: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadReunions();
  }

  loadReunions() {
    this.reunionService.getMesReunions().subscribe({
      next: (res) => this.reunions = res,
      error: () => this.toastr.error('Impossible de charger les réunions')
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.selectedFile = file;
    } else {
      this.toastr.error('Veuillez sélectionner un fichier PDF valide');
      this.selectedFile = null;
    }
  }

  createPV() {
    if (!this.selectedFile) {
      this.toastr.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    const formData = new FormData();
    const meta = {
      reunionId: this.pvForm.value.reunionId,
      titre: this.pvForm.value.titre,
      contenu: this.pvForm.value.contenu
    };
    formData.append('meta', JSON.stringify(meta));
    formData.append('file', this.selectedFile);

    this.pvService.createPV(formData).subscribe({
      next: (res) => this.toastr.success('PV créé avec succès'),
      error: (err) => this.toastr.error('Erreur lors de la création du PV')
    });
  }
}