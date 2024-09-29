import { Component } from '@angular/core';
import { MaterialModule } from '../../material.module';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',

})
export class LoadingComponent {
  constructor(public loadingService: LoadingService) {}
}
