import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { ProjectsAnalysisService } from './projects-analysis.service';

@Component({
    selector: 'app-projects-analysis',
    standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink],
    templateUrl: './projects-analysis.component.html',
    styleUrl: './projects-analysis.component.scss'
})
export class ProjectsAnalysisComponent {

    constructor(
        private projectsAnalysisService: ProjectsAnalysisService
    ) {}

    ngOnInit(): void {
        this.projectsAnalysisService.loadChart();
    }

}