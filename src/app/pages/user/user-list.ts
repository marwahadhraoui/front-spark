import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { UserService } from '../../layout/service/user/user.service';
import { User } from '../../../Model/user';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogModule } from 'primeng/dialog';

@Component({
    selector: 'app-table-demo',
    standalone: true,
    imports: [TableModule, SelectModule, InputTextModule, ToastModule, CommonModule, ButtonModule, RouterLink, DialogModule],
    template: `
        <div class="card">
            <p-toast></p-toast>

            <div class="flex justify-between items-center mb-4">
                <div class="font-semibold text-xl">Users</div>
                <p-button label="Add User" icon="pi pi-plus" [routerLink]="['/pages/user-form']" severity="info" />
            </div>
            <p-table
                #dt1
                [value]="users"
                dataKey="id"
                [rows]="10"
                [loading]="loading"
                [rowHover]="true"
                [showGridlines]="true"
                [paginator]="true"
                [globalFilterFields]="['name', 'users.name', 'representative.name', 'status']"
                responsiveLayout="scroll"
            >
                <ng-template #header>
                    <tr>
                        <th style="min-width: 12rem">Username</th>
                        <th style="min-width: 12rem">Email</th>
                        <th style="min-width: 14rem">Firstname</th>
                        <th style="min-width: 10rem">LastName</th>
                        <th style="min-width: 12rem">Actions</th>
                    </tr>
                </ng-template>

                <ng-template #body let-user>
                    <tr>
                        <td>{{ user.username }}</td>
                        <td>
                            <span>{{ user.email }}</span>
                        </td>
                        <td>
                            <span class="image-text">{{ user.firstName }}</span>
                        </td>
                        <td>{{ user.lastName }}</td>
                        <td class="flex gap-2">
                            <p-button label="Edit" icon="pi pi-pencil" [routerLink]="['/pages/edit', user.id]" [raised]="true" severity="info" />
                            <p-button label="Delete" icon="pi pi-trash" severity="danger" (click)="openConfirmation(user)" />
                        </td>
                    </tr>
                </ng-template>
            </p-table>

            <!-- Confirmation Dialog -->
            <p-dialog header="Confirmation" [(visible)]="displayConfirmation" [style]="{ width: '350px' }" [modal]="true">
                <div class="flex items-center justify-center">
                    <i class="pi pi-exclamation-triangle mr-4" style="font-size: 2rem"></i>
                    <span
                        >Are you sure you want to delete <strong>{{ selectedUser?.username }}</strong
                        >?</span
                    >
                </div>
                <ng-template #footer>
                    <p-button label="No" icon="pi pi-times" (click)="closeConfirmation()" text severity="secondary" />
                    <p-button label="Yes" icon="pi pi-check" (click)="confirmDelete()" severity="danger" outlined />
                </ng-template>
            </p-dialog>
        </div>
    `,
    styles: `
        .p-datatable-frozen-tbody {
            font-weight: bold;
        }

        .p-datatable-scrollable .p-frozen-column {
            font-weight: bold;
        }
    `,
    providers: [MessageService]
})
export class UserListComponent implements OnInit {
    private userService = inject(UserService);
    private messageService = inject(MessageService);

    users: User[] = [];
    errorMessage = '';
    loading = true;
    displayConfirmation: boolean = false;
    selectedUser: any = null;

    openConfirmation(user: User) {
        this.selectedUser = user;
        this.displayConfirmation = true;
    }

    ngOnInit(): void {
        this.loadUsers();
    }
    closeConfirmation() {
        this.displayConfirmation = false;
        this.selectedUser = null;
    }

    loadUsers(): void {
        this.loading = true;
        this.errorMessage = '';

        this.userService.getUsers().subscribe({
            next: (response) => {
                this.users = response;
                this.loading = false;
            },
            error: (error: HttpErrorResponse) => {
                this.loading = false;
                if (error.status === 401) {
                    this.errorMessage = 'Non autorisé - Veuillez vous reconnecter';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: 'Session expirée, veuillez vous reconnecter',
                        life: 5000
                    });
                } else {
                    this.errorMessage = 'Erreur lors du chargement des utilisateurs';
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erreur',
                        detail: this.errorMessage,
                        life: 5000
                    });
                }
            }
        });
    }
    confirmDelete(): void {
        if (!this.selectedUser) return;

        this.userService.deleteUser(this.selectedUser.id).subscribe({
            next: () => {
                this.showSuccessViaToast();
                this.displayConfirmation = false;
                this.loadUsers();
            },
            error: (error) => {
                this.displayConfirmation = false;
                this.showErrorViaToast();
            }
        });
    }
    showSuccessViaToast() {
        this.messageService.add({ severity: 'success', summary: 'Success deletion', detail: 'user deleted successfully', life: 3000 });
    }
    showErrorViaToast() {
        this.messageService.add({ severity: 'error', summary: 'Error ', detail: 'deletion failed', life: 3000 });
    }
}
