import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { AreaService } from '../../layout/service/area/area.service';
import { MessageService } from 'primeng/api';
import { Area } from '../../../Model/area';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-area-form',
  imports: [ToastModule, TextareaModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './area-form.component.html',
  styleUrl: './area-form.component.scss',
  providers: [MessageService]
})
export class AreaFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private areaService = inject(AreaService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  loading = false;
  areaId?: number;
  roles: any[] = [];
  selectedRole: string = '';


  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],

    });
  }

  private checkEditMode(): void {
    const areaId = this.route.snapshot.params['id'];
    if (areaId) {
      this.isEdit = true;
      this.areaId = areaId;
      this.loadAreaData(areaId);
    }
  }

  private loadAreaData(areaId: number): void {
    this.loading = true;
    this.areaService.getAreaById(areaId).subscribe({
      next: (area) => {
        this.form.patchValue({
          name: area.name,
          description: area.description,
        });
        this.loading = false;
      },
      error: () => {
        this.showErrorViaToast("error", "Error", "deletion failed ! ", 3000);
        this.router.navigate(['/app-areas']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const area: Area = {
      ...this.form.value,
    }
    if (this.isEdit && this.areaId) {
      area.id = this.areaId;
    }
    const operation = this.isEdit && this.areaId
      ? this.areaService.updateArea(area)
      : this.areaService.createArea(area);

    operation.subscribe({
      next: () => {

        this.showSuccessViaToast("success", "success", this.isEdit ? "Area updated ! " : "Area created ! ", 3000);
        this.router.navigate(['/pages/app-area']);
      },
      error: (err) => {
        this.showSuccessViaToast("error", "erroe", err.error?.message, 3000);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/pages/app-area']);
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
