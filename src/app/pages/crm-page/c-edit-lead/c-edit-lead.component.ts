import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { FileUploadModule } from '@iplab/ngx-file-upload';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';

@Component({
	selector: 'app-c-edit-lead',
	standalone: true,
    imports: [MatCardModule, MatMenuModule, MatButtonModule, RouterLink, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, FileUploadModule, NgxEditorModule],
	templateUrl: './c-edit-lead.component.html',
	styleUrl: './c-edit-lead.component.scss'
})
export class CEditLeadComponent {

    editor!: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['code', 'blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link', 'image'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    // File Uploader
    public multiple: boolean = false;

    // Select Value
    leadSourceSelected = 'option1';
    statusSelected = 'option1';

    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: any) {
      this.isBrowser = isPlatformBrowser(this.platformId);
    }

    ngOnInit(): void {
      if (this.isBrowser) {
        this.editor = new Editor();
      }
    }

    // make sure to destory the editor
    ngOnDestroy(): void {
      if (this.editor) {
        this.editor.destroy();
      }
    }

}
