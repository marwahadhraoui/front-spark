import { Component, inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { AreaService } from '../../layout/service/area/area.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Area } from '../../../Model/area';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-area',
  imports: [ToastModule, TableModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './area.component.html',
  styleUrl: './area.component.scss',
  providers: [MessageService]
})
export class AreaComponent implements OnInit {
  addArea() {
    throw new Error('Method not implemented.');
  }

  private areaService = inject(AreaService);
  private messageService = inject(MessageService);

  areas: Area[] = [];
  loading: boolean = true;
  displayConfirmation: boolean = false;
  selectedArea: Area | null = null;
  ngOnInit(): void {

    this.loadAreas();
  }
  openConfirmation(area: Area) {
    this.selectedArea = area;
    this.displayConfirmation = true;
  }
  closeConfirmation() {
    this.displayConfirmation = false;
    this.selectedArea = null;
  }
  loadAreas(): void {
    this.loading = true;
    this.areaService.getAreas().subscribe({
      next: (response) => {
        this.areas = response;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 401) {
          this.showErrorViaToast("error", "Error", 'Session expired ! ', 3000);
        } else {
          this.showErrorViaToast("error", "Error", 'Error while loading Areas! ', 3000);

        }
      }
    })
  }

  confirmDelete(): void {
    if (!this.selectedArea) return;
    this.areaService.deleteArea(this.selectedArea.id!).subscribe({
      next: () => {
        this.showSuccessViaToast("success", "Success deletion", "area deleted successfully", 3000);
        this.loadAreas();
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
