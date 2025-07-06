import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { BankService } from '../../layout/service/bank/bank.service';
import { Bank } from '../../../Model/bank';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-bank-form',
  imports: [ToastModule, TextareaModule, ButtonModule, ReactiveFormsModule, InputTextModule, InputNumberModule],
  templateUrl: './bank-form.component.html',
  styleUrl: './bank-form.component.scss',
  providers: [MessageService]
})
export class BankFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private bankService = inject(BankService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  loading = false;
  bankId?: number;


  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', [Validators.required]],
      address: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],

    });
  }

  private checkEditMode(): void {
    const bankId = this.route.snapshot.params['id'];
    if (bankId) {
      this.isEdit = true;
      this.bankId = bankId;
      this.loadBankData(bankId);
    }
  }

  private loadBankData(bankId: number): void {
    this.loading = true;
    this.bankService.getBankById(bankId).subscribe({
      next: (bank) => {
        this.form.patchValue({
          name: bank.name,
          code: bank.code,
          address: bank.address,
          email: bank.email,
          phone: bank.phone,

        });
        this.loading = false;
      },
      error: () => {
        this.showErrorViaToast("error", "Error", "deletion failed ! ", 3000);
        this.router.navigate(['/pages/app-bank']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const bank: Bank = {
      ...this.form.value,
    }
    if (this.isEdit && this.bankId) {
      bank.id = this.bankId;
    }


    const operation = this.isEdit && this.bankId
      ? this.bankService.updateBank(bank)
      : this.bankService.createBank(bank);

    operation.subscribe({
      next: () => {

        this.showSuccessViaToast("success", "success", this.isEdit ? "Bank updated ! " : "Bank created ! ", 3000);
        this.router.navigate(['/pages/app-bank']);
      },
      error: (err) => {
        this.showSuccessViaToast("error", "erroe", err.error?.message, 3000);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/pages/app-bank']);
  }

  private markAllAsTouched(): void {
    Object.values(this.form.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  showErrorViaToast(sev: string, sum: string, det: string, lf: number) {
    this.messageService.add({ severity: sev, summary: sum, detail: det, life: lf });
  }
  showSuccessViaToast(sev: string, sum: string, det: string, lf: number) {
    this.messageService.add({ severity: sev, summary: sum, detail: det, life: lf });
  }
}

