import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  forminput!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.forminput = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  register(): void {
    if (this.forminput.valid) {
      const userData = this.forminput.value;

      let apiUrl = '';
      switch (userData.role) {
        case 'Fte':
          apiUrl = 'http://localhost:8080/api/auth/Fte/register';
          break;
        case 'Direction_technique':
          apiUrl = 'http://localhost:8080/api/auth/Direction_technique/register';
          break;
        case 'Commission_techniques':
          apiUrl = 'http://localhost:8080/api/auth/Commission_techniques/register';
          break;
      }

      this.userService.register(apiUrl, userData).subscribe({
        next: () => {
          this.toastr.success('Inscription réussie !');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.toastr.error('Erreur lors de l\'inscription');
          console.error(err);
        }
      });
    } else {
      this.toastr.warning('Veuillez remplir tous les champs correctement.');
    }
  }
}
