import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { user } from '../modules/user.model';
import { ToastrService } from 'ngx-toastr'
import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})

export class AuthComponent implements OnInit {
  forminput!: FormGroup;
  loginError: string | null = null;

  constructor(
    private toastr: ToastrService,
    private fb: FormBuilder,
    private userserv: UserService,
    private router: Router,
    private authservice: AuthService
  ) {
    sessionStorage.clear();
  }

  ngOnInit(): void {
    if (this.authservice.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    this.forminput = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.forminput.valid) {
      const username = this.forminput.get('username')?.value;
      const password = this.forminput.get('password')?.value;

      this.userserv.connect(username, password).subscribe({
        next: (authr) => {
          this.authservice.setToken(authr.accessToken);
          this.authservice.setRole(authr.role);
          localStorage.setItem("username", this.getAllFromToken()?.sub || '');

          this.toastr.success('Connexion réussie');

          switch (authr.role) {
            case "Fte":
              this.router.navigate(['/Dashboard_fte/consulterReunion']);
              break;
            case "Direction_technique":
              this.router.navigate(['/Dashboard_directionTechnique/consulterReunion']);
              break;
            case "Commission_techniques":
              this.router.navigate(['/Dashboard_commissionTechniques/consulterReunion']);
              break;
            default:
              this.toastr.error("Rôle inconnu, connexion annulée");
              this.router.navigate(['/login']);
          }
        },
        error: (error) => {
          this.loginError = "Erreur lors de la connexion. Veuillez vérifier vos identifiants.";
          this.toastr.error(this.loginError);
          console.error("error: ", error);
        }
      });
    } else {
      this.toastr.warning("Veuillez saisir le nom d'utilisateur et le mot de passe");
    }
  }

  getAllFromToken(): any {
    try {
      const token = this.authservice.getToken();
      if (!token) return undefined;

      const parts = token.split('.');
      if (parts.length !== 3) return undefined;

      return JSON.parse(atob(parts[1]));
    } catch (error) {
      console.error("Erreur lors du décodage du token :", error);
      return undefined;
    }
  }
}
