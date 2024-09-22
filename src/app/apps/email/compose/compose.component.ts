import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { CustomizerSettingsService } from '../../../customizer-settings/customizer-settings.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-compose',
  standalone: true,
  imports: [
    RouterLink,
    SidebarComponent,
    MatMenuModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxEditorModule,
  ],
  templateUrl: './compose.component.html',
  styleUrl: './compose.component.scss',
})
export class ComposeComponent {
  // Text Editor
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

  // Select Emails
  emails = new FormControl('');
  emailList: string[] = [
    'hello@james.com',
    'hello@andy.com',
    'hello@mateo.com',
    'hello@luca.com',
    'hello@sausage.com',
    'hello@tomato.com',
  ];

  // isToggled
  isToggled = false;

  private isBrowser: boolean;

  constructor(public themeService: CustomizerSettingsService,
    @Inject(PLATFORM_ID) private platformId: any) {
    this.themeService.isToggled$.subscribe((isToggled) => {
      this.isToggled = isToggled;
    });
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
