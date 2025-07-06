import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { Bank } from '../../../Model/bank';
import { BankService } from '../../layout/service/bank/bank.service';

@Component({
  selector: 'app-bank',
  imports: [ToastModule, TableModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './bank.component.html',
  styleUrl: './bank.component.scss',
  providers: [MessageService]
})
export class BankComponent implements OnInit {
  addBank() {
    throw new Error('Method not implemented.');
  }

  private bankService = inject(BankService);
  private messageService = inject(MessageService);

  banks: Bank[] = [];
  loading: boolean = true;
  displayConfirmation: boolean = false;
  selectedBank: Bank | null = null;
  ngOnInit(): void {

    this.loadBanks();
  }
  openConfirmation(bank: Bank) {
    this.selectedBank = bank;
    this.displayConfirmation = true;
  }
  closeConfirmation() {
    this.displayConfirmation = false;
    this.selectedBank = null;
  }
  loadBanks(): void {
    this.loading = true;
    this.bankService.getBanks().subscribe({
      next: (response) => {
        this.banks = response;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 401) {
          this.showErrorViaToast("error", "Error", 'Session expired ! ', 3000);
        } else {
          this.showErrorViaToast("error", "Error", 'Error while loading Banks! ', 3000);

        }
      }
    })
  }

  confirmDelete(): void {
    if (!this.selectedBank) return;
    this.bankService.deleteBank(this.selectedBank.id!).subscribe({
      next: () => {
        this.showSuccessViaToast("success", "Success deletion", "bank deleted successfully", 3000);
        this.loadBanks();
        this.closeConfirmation()
      },
      error: () => {
        this.displayConfirmation = false;
        this.showErrorViaToast("error", "Error", "deletion failed ! ", 3000);
        this.closeConfirmation
      }
    })
  }
  showSuccessViaToast(sev: string, sum: string, det: string, lf: number) {
    this.messageService.add({ severity: sev, summary: sum, detail: det, life: lf });
  }
  showErrorViaToast(sev: string, sum: string, det: string, lf: number) {
    this.messageService.add({ severity: sev, summary: sum, detail: det, life: lf });
  }
}

