import { CommonModule, NgIf } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MaterialModule } from '../../../material.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { BaseListComponent } from '../../../shared/formulario/baseList';
import { FrequenciaService } from '../frequencia.service';


@Component({
  selector: 'app-frequencia-checkin-dia',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MaterialModule
  ],
  templateUrl: './frequencia-checkin-dia.component.html',
  styleUrl: './frequencia-checkin-dia.component.scss'
})
export class FrequenciaCheckinDiaComponent extends BaseListComponent implements OnInit {

  // alternado
  isToggled = false;

  displayedColumns: string[] = [
    'nomeTurma',
    'quantidade',
    'limiteMaximo',
    'quantidadeRestante'
  ];
  dataSource = new MatTableDataSource<any>([]);

  constructor(
    public themeService: CustomizerSettingsService,
    private frequenciaService: FrequenciaService,
    public override router: Router,
    public override activatedRoute: ActivatedRoute
  ) {
    super(router, activatedRoute);
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
  }

  override ngOnInit() {

  }

  override preencheFiltro(): void {
    throw new Error('Method not implemented.');
  }
}
