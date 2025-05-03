import './app/shared/extensions/string-extensions';
import './app/shared/extensions/date-extensions';
import './app/shared/extensions/number-extensions';
import './app/shared/extensions/array-extensions';
import './app/shared/extensions/boolean-extensions';
import './app/shared/extensions/object-extensions';
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
