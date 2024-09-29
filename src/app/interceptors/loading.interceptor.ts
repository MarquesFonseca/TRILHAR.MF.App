import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from "@angular/common/http";
import { finalize, Observable } from "rxjs";
import { LoadingService } from "../services/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRquests = 0;

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if(this.activeRquests === 0) {
      this.loadingService.show();
    }

    this.activeRquests++;

    return next.handle(request).pipe(
      finalize(() => {
        this.activeRquests--;

        if(this.activeRquests === 0) {
          this.loadingService.hide()
        }
      })
    );
  }
}










