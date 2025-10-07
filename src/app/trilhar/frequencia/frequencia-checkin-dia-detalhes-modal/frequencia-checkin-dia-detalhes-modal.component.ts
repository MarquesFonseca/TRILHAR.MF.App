import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-frequencia-checkin-dia-detalhes-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './frequencia-checkin-dia-detalhes-modal.component.html',
  styleUrl: './frequencia-checkin-dia-detalhes-modal.component.scss'
})
export class FrequenciaCheckinDiaDetalhesModalComponent {
  dataSelecionada: Date;
  codigoTurmaSelecionada: number;
  descricaoTuramaSelecionda: string;
  frequenciasPresentesTurmaEData: any[];
  frequenciasAusentesTurmaEData: any[];
  frequenciasPresentesTurmaEDataPossueAlergia: any[];
  frequenciasPresentesTurmaEDataPossueRestricaoAlimentar: any[];
  frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais: any[];
  frequenciasPresentesTurmaEDataPossueAniversario: any[];

  constructor(
    private router: Router,
    public dialogRef: MatDialogRef<FrequenciaCheckinDiaDetalhesModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dataSelecionada = data.dataSelecionada;
    this.codigoTurmaSelecionada = data.codigoTurmaSelecionada;
    this.descricaoTuramaSelecionda = data.descricaoTuramaSelecionda;
    this.frequenciasPresentesTurmaEData = data.frequenciasPresentesTurmaEData;
    this.frequenciasAusentesTurmaEData = data.frequenciasAusentesTurmaEData;
    this.frequenciasPresentesTurmaEDataPossueAlergia = data.frequenciasPresentesTurmaEDataPossueAlergia;
    this.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar = data.frequenciasPresentesTurmaEDataPossueRestricaoAlimentar;
    this.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais = data.frequenciasPresentesTurmaEDataPossueNecessidadesEspeciais;
    this.frequenciasPresentesTurmaEDataPossueAniversario = data.frequenciasPresentesTurmaEDataPossueAniversario;
  }

  abrirDetalhe(codigo: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/criancas/detalhar', codigo])
    );
    window.open(url, '_blank');
  }

  retornaDescricaoTooltip(item: any): string {
    if (this.codigoTurmaSelecionada === 0) {
      return `${item.alunoNomeCrianca} - ${item.turmaDescricao} - ${item.turmaAnoLetivo}/${item.turmaSemestreLetivo}`;
    }

    if (this.codigoTurmaSelecionada > 0) {
      return `${item.alunoNomeCrianca}`;
    }

    return '';
  }
}
