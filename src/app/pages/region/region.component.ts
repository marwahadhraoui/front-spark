import { Component } from '@angular/core';
import { inject, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { RegionService } from '../../layout/service/region/region.service';
import { Region } from '../../../Model/region';
@Component({
  selector: 'app-region',
  imports: [ToastModule, TableModule, ButtonModule, DialogModule, RouterLink],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss',
  providers: [MessageService]
})
export class RegionComponent implements OnInit {
  addRegion() {
    throw new Error('Method not implemented.');
  }

  private regionService = inject(RegionService);
  private messageService = inject(MessageService);

  regions: Region[] = [];
  loading: boolean = true;
  displayConfirmation: boolean = false;
  selectedRegion: Region | null = null;
  ngOnInit(): void {

    this.loadRegions();
  }
  openConfirmation(region: Region) {
    this.selectedRegion = region;
    this.displayConfirmation = true;
  }
  closeConfirmation() {
    this.displayConfirmation = false;
    this.selectedRegion = null;
  }
  loadRegions(): void {
    this.loading = true;
    this.regionService.getRegions().subscribe({
      next: (response) => {
        this.regions = response;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        if (error.status === 401) {
          this.showErrorViaToast("error", "Error", 'Session expired ! ', 3000);
        } else {
          this.showErrorViaToast("error", "Error", 'Error while loading Regions! ', 3000);

        }
      }
    })
  }

  confirmDelete(): void {
    if (!this.selectedRegion) return;
    this.regionService.deleteRegion(this.selectedRegion.id!).subscribe({
      next: () => {
        this.showSuccessViaToast("success", "Success deletion", "area deleted successfully", 3000);
        this.loadRegions();
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
