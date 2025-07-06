import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { RoleService } from '../../layout/service/role.service';
import { UserService } from '../../layout/service/user/user.service';
import { MessageService } from 'primeng/api';
import { User } from '../../../Model/user';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'user-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    ToastModule,
    SelectModule
  ],
  providers: [MessageService],
  template: `
    <div class="flex flex-col md:flex-row gap-8">
            <div class="card flex flex-col gap-6 w-full">
      <div class="card flex flex-col gap-4">
         <p-toast />
         <div class="font-semibold text-xl">
            {{ isEdit ? 'Edit' : 'Create' }} user
         </div>
         <form [formGroup]="form" (ngSubmit)="onSubmit()" class="grid gap-4">
         <!-- Username Field -->
         <div class="flex flex-col gap-1">
            <label for="username">Username</label>
            <input pInputText id="username" formControlName="username"
               [class]="{ 'ng-invalid ng-dirty': form.get('username')?.invalid && (form.get('username')?.touched ) }" 
               autocomplete="username"/>
            @if (form.get('username')?.invalid && (form.get('username')?.touched )) {
            <small class="p-error">Le nom d'utilisateur est requis</small>
            }
         </div>
         <div class="flex flex-col gap-1">
            <label for="email">Email</label>
            <input pInputText id="email" formControlName="email"
               [class]="{ 'ng-invalid ng-dirty': form.get('email')?.invalid && form.get('email')?.touched }" autocomplete="email"/>
            @if (form.get('email')?.invalid && form.get('email')?.touched) {
            <small class="p-error">
            {{ form.get('email')?.errors?.['required'] ? 'Email requis' : 'Format email invalide' }}
            </small>
            }
         </div>
         <div class="flex flex-col gap-1">
            <label for="firstName">Prénom</label>
            <input pInputText id="firstName" formControlName="firstName" autocomplete="firstname"/>
         </div>
         <div class="flex flex-col gap-1">
            <label for="lastName">Nom</label>
            <input pInputText id="lastName" formControlName="lastName" autocomplete="lastname" />
         </div>
         <!-- Champ Mot de passe -->
         @if (!isEdit) {
         <div class="flex flex-col gap-1">
            <label for="password">Mot de passe</label>
            <p-password id="password" formControlName="password" [feedback]="true" [toggleMask]="true"
            [class]="{ 'ng-invalid ng-dirty': form.get('password')?.invalid && form.get('password')?.touched }" autocomplete="password" />
            @if (form.get('password')?.invalid && form.get('password')?.touched) {
            <small class="p-error">
            Minimum 8 caractères requis
            </small>
            }
         </div>
         }
            <div class="flex flex-col gap-1">
          <label for="role" class="mb-1">Rôle</label>
          <p-select 
            id="role" 
            formControlName="role" 
            [options]="roles" 
            optionLabel="label"
            placeholder="Sélectionnez un rôle"
            [showClear]="true"
            [class]="{ 'ng-invalid ng-dirty': form.get('role')?.invalid && form.get('role')?.touched }"
            required
            >
          </p-select>
          @if (form.get('role')?.invalid && form.get('role')?.touched) {
            <small class="p-error mt-1">Un rôle est requis</small>
          }
        </div>
         <div class="flex flex-wrap gap-1">
            <p-button  label="Save"
            (click)="onSubmit()" [disabled]="form.invalid"  [raised]="true" severity="primary" />
            <p-button label="Cancel" severity="secondary" (click)="onCancel()"></p-button>
         </div>
         </form>
      </div>
   </div>
</div>
  `
})
export class UserFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private userService = inject(UserService);
  private messageService = inject(MessageService);
  private roleService = inject(RoleService);

  form!: FormGroup;
  isEdit = false;
  loading = false;
  userId?: number;
  roles: any[] = [];
  selectedRole: string = '';

  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
    this.loadRoles();
  }
  loadRoles() {
    this.roleService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles.map((role: any) => ({
          label: role.name,
          value: role.name
        }))
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'failed to load roles'
        })

      }
    })
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: [''],
      lastName: [''],
      password: ['', [Validators.minLength(8)]],
      role: [Validators.required]
    });
  }



  private checkEditMode(): void {
    const userId = this.route.snapshot.params['id'];
    if (userId) {
      this.isEdit = true;
      this.userId = userId;
      this.loadUserData(userId);
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  private loadUserData(userId: number): void {
    this.loading = true;
    this.userService.getUserByUserId(userId).subscribe({
      next: (user) => {
        this.form.patchValue({
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: this.roles.find(r => r.value === user.role)

        });
        this.loading = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Échec du chargement des données utilisateur'
        });
        this.router.navigate(['/pages/user-list']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const user: User = {
      ...this.form.value,
      role: this.form.value.role.value
    }
    if (this.isEdit && this.userId) {
      user.id = this.userId;

    }

    const operation = this.isEdit && this.userId
      ? this.userService.updateUser(user)
      : this.userService.createUser(user);

    operation.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Succès',
          detail: this.isEdit
            ? 'User updated successfully'
            : 'User created successfully'
        });
        this.router.navigate(['/pages/user-list']);
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: err.error?.message || 'Une erreur est survenue'
        });
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/pages/user-list']);
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }
}