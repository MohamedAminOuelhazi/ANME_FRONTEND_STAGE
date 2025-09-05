import { Component, OnInit, ViewChild } from '@angular/core';
import { ReunionService } from '../../service/reunion.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { UserService } from '../../service/user.service'; // Ajout de l'import
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

declare var bootstrap: any;

@Component({
  selector: 'app-consulter',
  templateUrl: './consulter.component.html',
  styleUrls: ['./consulter.component.css']
})

export class ConsulterComponent implements OnInit {


  BASE_URL = 'http://localhost:8080';

  reunions: any[] = [];
  displayedColumns: string[] = ['sujet', 'dateProposee', 'status', 'actions'];
  role: string = '';
  commissionsMembers: any[] = []; // Pour sélectionner les participants
  isLoadingMembers: boolean = false; // Ajout d'un flag de chargement

  // Variables pour les modals
  currentReunion: any = null;
  selectedParticipants: number[] = [];
  selectedFiles: File[] = [];
  validationComment: string = '';
  rejectionReason: string = '';


  //pv
  pvLoading = false;
  pvInfo: any = null;
  showRejectPv = false;
  pvRejectReason = '';
  pdfUrl?: SafeResourceUrl;

  // Fichiers
  filesLoading = false;
  files: any[] = [];


  // Pour la signature
  showSignatureModal = false;
  currentPvId: number | null = null;
  isDrawing = false;
  signatureImage: string | null = null;


  // Variables pour la nouvelle version du PV
  selectedNewPvVersion: File | null = null;
  newPvVersionComment: string = '';

  constructor(
    private reunionService: ReunionService,
    private toastr: ToastrService,
    private router: Router,
    private userService: UserService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('role') || '';
    this.loadReunions();
    this.loadCommissionsMembers(); // Charger les membres de commission
  }

  // Méthodes pour la signature
  openSignatureModal(pvId: number) {
    this.currentPvId = pvId;
    this.showSignatureModal = true;
    // Réinitialiser le canvas
    setTimeout(() => this.clearSignature(), 100);
  }

  closeSignatureModal() {
    this.showSignatureModal = false;
    this.currentPvId = null;
    document.body.classList.remove('modal-open');
    document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
  }

  startDrawing(event: MouseEvent) {
    this.isDrawing = true;
    const canvas = event.target as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(event.offsetX, event.offsetY);
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#000';
    }
  }

  draw(event: MouseEvent) {
    if (!this.isDrawing) return;
    const canvas = event.target as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.lineTo(event.offsetX, event.offsetY);
      ctx.stroke();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearSignature() {
    const canvas = document.getElementById('signatureCanvas') as HTMLCanvasElement;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    this.signatureImage = null;
  }

  confirmSignature() {
    const canvas = document.getElementById('signatureCanvas') as HTMLCanvasElement;
    if (!canvas) return;

    // Vérifier si le canvas est vide
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const pixelData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      const isEmpty = pixelData.every(value => value === 0);

      if (isEmpty) {
        this.toastr.error('Veuillez signer avant de confirmer');
        return;
      }
    }

    this.signatureImage = canvas.toDataURL('image/png');
    const blob = this.dataURItoBlob(this.signatureImage);
    const file = new File([blob], 'signature.png', { type: 'image/png' });

    console.log('this.currentPvId:', this.currentPvId);
    if (this.currentPvId) {
      this.reunionService.signPv(this.currentPvId, file).subscribe({
        next: () => {
          this.toastr.success('PV signé avec succès !');
          this.closeSignatureModal();
          if (this.pvInfo) this.pvInfo.alreadySignedByMe = true;
        },
        error: (err) => {
          console.error(err);
          this.toastr.error('Erreur lors de la signature du PV');
        }
      });
    }
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  // Réunions
  loadReunions() {
    this.reunionService.getMesReunions().subscribe({
      next: (data) => {
        this.reunions = data;
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors du chargement des réunions');
      }
    });
  }

  loadCommissionsMembers() {
    this.isLoadingMembers = true;
    this.userService.getCommissionMembers().subscribe({
      next: (data) => {
        this.commissionsMembers = data;
        this.isLoadingMembers = false;
        console.log('Membres de commission chargés:', this.commissionsMembers);
        console.log('Nombre de membres:', data.length);

        // Log détaillé pour debug
        data.forEach((member, index) => {
          console.log(`Membre ${index + 1}:`, {
            id: member.id,
            nom: member.firstname + ' ' + member.lastname,
            username: member.username,
            email: member.email
          });
        });

        // Forcer la détection des changements
        setTimeout(() => {
          console.log('Template devrait être mis à jour avec:', this.commissionsMembers);
        }, 100);
      },
      error: (err) => {
        console.error('Erreur lors du chargement des membres de commission:', err);
        this.toastr.error('Erreur lors du chargement des membres de commission');
        this.isLoadingMembers = false;

        // Fallback avec des données simulées en cas d'erreur
        this.commissionsMembers = [
          { id: 1, firstname: 'Jean', lastname: 'Dupont', username: 'j.dupont', email: 'jean.dupont@example.com', usertype: 'Commission_techniques' },
          { id: 2, firstname: 'Marie', lastname: 'Martin', username: 'm.martin', email: 'marie.martin@example.com', usertype: 'Commission_techniques' }
        ];
      }
    });
  }

  statusClass(status: string) {
    return {
      'badge bg-warning': status === 'PENDING',
      'badge bg-success': status === 'VALIDATED' || status === 'SCHEDULED',
      'badge bg-danger': status === 'REJECTED' || status === 'CANCELLED',
      'badge bg-info': status === 'CONFIRMED'
    };
  }

  // Méthodes pour les modals
  openValidationModal(reunion: any) {
    this.currentReunion = reunion;
    this.selectedParticipants = [];
    this.selectedFiles = [];
    this.validationComment = '';

    // Recharger les membres si nécessaire
    if (this.commissionsMembers.length === 0) {
      this.loadCommissionsMembers();
    }

    // Ouvrir le modal programmatiquement
    setTimeout(() => {
      const modalElement = document.getElementById('validationModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  // Fonction de tracking pour ngFor
  trackByMemberId(index: number, member: any): any {
    return member.id;
  }

  openRejectionModal(reunion: any) {
    this.currentReunion = reunion;
    this.rejectionReason = '';

    // Ouvrir le modal programmatiquement
    setTimeout(() => {
      const modalElement = document.getElementById('rejectionModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  onModalParticipantChange(event: any, participantId: number) {
    if (event.target.checked) {
      this.selectedParticipants.push(participantId);
    } else {
      this.selectedParticipants = this.selectedParticipants.filter(id => id !== participantId);
    }
  }

  onModalFilesSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  confirmerValidation() {
    if (this.selectedParticipants.length === 0) {
      this.toastr.error('Vous devez sélectionner au moins un participant');
      return;
    }

    if (this.selectedFiles.length === 0) {
      this.toastr.error('Vous devez uploader au moins un fichier');
      return;
    }

    const formData = new FormData();

    // CORRECTION 1: Ajouter le champ "valide" comme dans Postman
    formData.append('valide', 'true');

    // CORRECTION 2: Utiliser "motifRejet" au lieu de "commentaire" (même pour validation)
    formData.append('motifRejet', this.validationComment || 'Réunion approuvée');

    // CORRECTION 3: Ajouter les participants un par un (pas en tant qu'array)
    this.selectedParticipants.forEach(participantId => {
      formData.append('participantIds', participantId.toString());
    });

    // CORRECTION 4: Utiliser "fichiers" comme dans Postman
    this.selectedFiles.forEach(file => {
      formData.append('fichiers', file);
    });

    // Debug: Afficher le contenu du FormData
    console.log('FormData envoyé pour validation:');
    console.log('- valide: true');
    console.log('- motifRejet:', this.validationComment || 'Réunion approuvée');
    console.log('- participantIds:', this.selectedParticipants);
    console.log('- fichiers:', this.selectedFiles.map(f => f.name));

    this.reunionService.validerReunion(this.currentReunion.id, formData).subscribe({
      next: () => {
        this.toastr.success('Réunion validée avec succès');
        this.loadReunions();
        this.closeModal('validationModal');
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la validation');
        console.error('Erreur validation:', err);
      }
    });

  }

  private closeModal(modalId: string) {
    const modalElement = document.getElementById(modalId);
    if (modalElement) {
      const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
      if (modal) {
        modal.hide();
      }
    }
  }

  confirmerRejet() {
    if (!this.rejectionReason || this.rejectionReason.trim().length < 10) {
      this.toastr.error('Le motif de rejet doit contenir au moins 10 caractères');
      return;
    }

    const payload = { motifRejet: this.rejectionReason.trim() };

    this.reunionService.rejeterReunion(this.currentReunion.id, payload).subscribe({
      next: () => {
        this.toastr.success('Réunion rejetée avec succès');
        this.loadReunions();
        // Fermer le modal programmatiquement
        const modalElement = document.getElementById('rejectionModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) {
            modal.hide();
          }
        }
      },
      error: (err) => {
        this.toastr.error('Erreur lors du rejet');
        console.error(err);
      }
    });
  }

  confirmerReunion(id: number) {
    this.reunionService.confirmerReunion(id).subscribe({
      next: () => {
        this.toastr.success('Réunion confirmée');
        this.loadReunions();
      },
      error: (err) => {
        this.toastr.error('Erreur lors de la confirmation');
        console.error(err);
      }
    });
  }

  annulerReunion(id: number) {
    this.reunionService.annulerReunion(id).subscribe({
      next: () => {
        this.toastr.success('Réunion annulée avec succès');
        this.loadReunions();
        this.closeModal('cancellationModal');
      },
      error: (err) => {
        this.toastr.error('Erreur lors de l\'annulation');
        console.error('Erreur annulation:', err);
      }
    });
  }


  statusColor(status: string): 'primary' | 'warn' | 'accent' {
    switch (status.toUpperCase()) {
      case 'SCHEDULED': return 'primary';
      case 'PENDING': return 'accent';
      case 'CANCELLED': return 'warn';
      case 'CONFIRMED': return 'primary';
      default: return 'accent';
    }
  }

  openCancellationModal(reunion: any) {
    this.currentReunion = reunion;

    setTimeout(() => {
      const modalElement = document.getElementById('cancellationModal');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }


  openPvModal(reunion: any) {
    this.currentReunion = reunion;
    this.pvInfo = null;
    this.pvLoading = true;

    // Récupérer le PV
    this.reunionService.getPvByReunionId(reunion.id).subscribe({
      next: (pv: any) => {
        this.pvInfo = {
          ...pv,
          view: () => this.viewPv(pv),
          download: () => this.downloadPv(pv)
        };
        this.pvLoading = false;
        console.log('PV récupéré:', this.pvInfo);
      },
      error: (erreur) => {
        this.pvLoading = false;
        this.toastr.error("le PV n'est pas encore uploadé");
      }
    });

    setTimeout(() => {
      const el = document.getElementById('pvModal');
      if (el) new (window as any).bootstrap.Modal(el).show();
    }, 50);
  }

  // Méthode pour visualiser le PV dans une nouvelle fenêtre
  /*viewPv(pv: any) {
    window.open(pv.viewUrl || `${this.BASE_URL}/api/pv/${pv.id}/view`, '_blank');
  }*/

  // Méthode pour télécharger le PV
  downloadPv(pv: any) {
    this.reunionService.downloadPv(pv.id).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = pv.title || `PV-${pv.id}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toastr.error('Impossible de télécharger le PV')
    });
  }
  toggleRejectPv() {
    this.showRejectPv = !this.showRejectPv;
  }

  signPv(pvId: number) {
    // Ouvrir un sélecteur de fichier pour la signature
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png';
    input.onchange = () => {
      if (input.files && input.files.length > 0) {
        const file = input.files[0];

        this.reunionService.signPv(pvId, file).subscribe({
          next: () => {
            this.toastr.success('PV signé avec succès !');
            // Mettre à jour l'état du PV pour l'UI
            if (this.pvInfo) this.pvInfo.alreadySignedByMe = true;
          },
          error: (err) => {
            console.error(err);
            this.toastr.error('Erreur lors de la signature du PV');
          }
        });
      }
    };
    input.click();
  }


  rejectPv(pvId: number) {
    const motif = this.pvRejectReason?.trim();
    if (!motif || motif.length < 5) {
      this.toastr.error('Motif trop court');
      return;
    }

    this.reunionService.rejectPv(pvId, motif).subscribe({
      next: () => {
        this.toastr.success('PV rejeté');
        this.showRejectPv = false;
        // Rafraîchir les infos PV
        this.openPvModal(this.currentReunion);
      },
      error: (erreur) => {
        console.error('Erreur lors du rejet', erreur);
        this.toastr.error('Erreur lors du rejet');
      }
    });
  }

  openFilesModal(reunion: any) {
    this.currentReunion = reunion;
    this.files = [];
    this.filesLoading = true;

    // Récupérer la liste des fichiers
    this.reunionService.getFichiers(reunion.id).subscribe({
      next: (files: any[]) => {
        // Ajouter l'URL de téléchargement pour chaque fichier
        this.files = files.map((f: any) => ({
          ...f,
          download: () => this.downloadFile(f) // méthode pour télécharger
        }));
        this.filesLoading = false;
      },
      error: () => {
        this.filesLoading = false;
        this.toastr.error('Impossible de charger les fichiers');
      }
    });

    setTimeout(() => {
      const el = document.getElementById('filesModal');
      if (el) new (window as any).bootstrap.Modal(el).show();
    }, 50);
  }

  // Méthode pour télécharger un fichier spécifique
  downloadFile(file: any) {
    this.reunionService.downloadFile(file.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.nomFichier;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Impossible de télécharger le fichier');
      }
    });
  }


  viewPv(id: number) {
    this.reunionService.viewPv(id).subscribe({
      next: (data: Blob) => {
        const fileURL = URL.createObjectURL(data);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fileURL);
      },
      error: (err) => {
        console.error('Erreur lors du chargement du PV', err);
      }
    });
  }



  //upload new PV version

  // Méthode pour gérer la sélection du fichier
  onNewPvVersionSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedNewPvVersion = input.files[0];
    }
  }

  openNewPvVersionModal(pvId: number) {
    this.currentPvId = pvId;
    this.selectedNewPvVersion = null;
    this.newPvVersionComment = '';
    setTimeout(() => {
      const el = document.getElementById('newPvVersionModal');
      if (el) new (window as any).bootstrap.Modal(el).show();
    }, 50);
  }

  // Méthode pour uploader la nouvelle version
  uploadNewPvVersion() {
    if (!this.selectedNewPvVersion || !this.currentPvId) {
      return;
    }

    // Vérifier que c'est un PDF
    if (this.selectedNewPvVersion.type !== 'application/pdf') {
      this.toastr.error('Veuillez sélectionner un fichier PDF');
      return;
    }

    // Vérifier la taille (max 10MB)
    if (this.selectedNewPvVersion.size > 10 * 1024 * 1024) {
      this.toastr.error('Le fichier ne doit pas dépasser 10MB');
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedNewPvVersion);

    // Utiliser l'ID du PV au lieu de l'ID de la réunion
    this.reunionService.uploadNewPvVersion(this.currentPvId, formData).subscribe({
      next: () => {
        this.toastr.success('Nouvelle version du PV uploadée avec succès');
        // Fermer le modal
        const modalElement = document.getElementById('newPvVersionModal');
        if (modalElement) {
          const modal = (window as any).bootstrap.Modal.getInstance(modalElement);
          if (modal) modal.hide();
        }
        // Fermer le modal PV
        const pvModalElement = document.getElementById('pvModal');
        if (pvModalElement) {
          const pvModal = (window as any).bootstrap.Modal.getInstance(pvModalElement);
          if (pvModal) pvModal.hide();
        }
        // Recharger les réunions
        this.loadReunions();
      },
      error: (err) => {
        console.error(err);
        this.toastr.error('Erreur lors de l\'upload de la nouvelle version');
      }
    });
  }


}