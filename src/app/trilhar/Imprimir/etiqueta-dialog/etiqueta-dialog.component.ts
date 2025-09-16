import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from '../../../material.module';

interface Etiqueta {
  codigo: string;
  nome: string;
  turma: string;
}

@Component({
  selector: 'app-etiqueta-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MaterialModule,
  ],
  templateUrl: './etiqueta-dialog.component.html',
  styleUrls: ['./etiqueta-dialog.component.css']
})
export class EtiquetaDialogComponent {
  etiquetas: Etiqueta[] = [];

  constructor(
    private dialogRef: MatDialogRef<EtiquetaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { etiquetas: Etiqueta[] }
  ) {
    this.etiquetas = data.etiquetas;
  }

  fechar() {
    this.dialogRef.close();
  }

  imprimir() {
    const conteudo = document.getElementById('print-area')?.innerHTML;
    if (!conteudo) return;

    const janela = window.open('', '', 'width=800,height=600');
    if (!janela) return;

    janela.document.write(`
      <html>
        <head>
          <title>Etiquetas</title>
          <style>
            @page {
              /* size: 100mm 20mm landscape; etiqueta fixa em modo paisagem */
              size: 100mm 20mm; /* etiqueta fixa 100x20mm */
              margin: 0;        /* sem margens */
            }
            body {
              margin: 0;
              padding: 0;
              width: 100mm;
              height: 20mm;
              font-family: Arial, sans-serif;
            }
            .print-container {
              display: flex;
              justify-content: space-between;
              width: 100mm;
              height: 20mm;
              margin: 0;
            }
            .label {
              width: 49mm; /* duas etiquetas lado a lado */
              height: 20mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              /* border: 1px solid #000; opcional: retire se a etiqueta já tiver borda */
              box-sizing: border-box;
            }
            .codigo {
              font-size: 20px;
              font-weight: bold;
              letter-spacing: 4px;
            }
            .nome {
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 48mm; /* Ajuste conforme necessário */
            }
            .turma {
              font-size: 14px;
              font-weight: bold;
              text-align: center;
              line-height: 1.2;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 48mm; /* Ajuste conforme necessário */
            }
          </style>
        </head>
        <body>
          ${conteudo}
        </body>
      </html>
    `);

    janela.document.close();
    janela.focus();
    janela.print();
    janela.close();
  }
}
