import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegionService } from '../../layout/service/region/region.service';
import { MessageService } from 'primeng/api';
import { Region } from '../../../Model/region';
import { ToastModule } from 'primeng/toast';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-region-form',
  imports: [ToastModule, TextareaModule, ButtonModule, ReactiveFormsModule, InputTextModule],
  templateUrl: './region-form.component.html',
  styleUrl: './region-form.component.scss',
  providers: [MessageService]
})
export class RegionFormComponent {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private regionService = inject(RegionService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  form!: FormGroup;
  isEdit = false;
  loading = false;
  regionId?: number;


  ngOnInit(): void {
    this.initializeForm();
    this.checkEditMode();
  }

  private initializeForm(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', [Validators.required]],
      code: ['', [Validators.required]],

    });
  }

  private checkEditMode(): void {
    const regionId = this.route.snapshot.params['id'];
    if (regionId) {
      this.isEdit = true;
      this.regionId = regionId;
      this.loadRegionData(regionId);
    }
  }

  private loadRegionData(regionId: number): void {
    this.loading = true;
    this.regionService.getRegionById(regionId).subscribe({
      next: (region) => {
        this.form.patchValue({
          name: region.name,
          description: region.description,
          code: region.code,

        });
        this.loading = false;
      },
      error: () => {
        this.showErrorViaToast("error", "Error", "deletion failed ! ", 3000);
        this.router.navigate(['/pages/app-regions']);
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;
    const region: Region = {
      ...this.form.value,
    }
    if (this.isEdit && this.regionId) {
      region.id = this.regionId;
    }


    const operation = this.isEdit && this.regionId
      ? this.regionService.updateRegion(region)
      : this.regionService.createRegion(region);

    operation.subscribe({
      next: () => {

        this.showSuccessViaToast("success", "success", this.isEdit ? "Region updated ! " : "Region created ! ", 3000);
        this.router.navigate(['/pages/app-region']);
      },
      error: (err) => {
        this.showSuccessViaToast("error", "erroe", err.error?.message, 3000);
        this.loading = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/pages/app-region']);
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

