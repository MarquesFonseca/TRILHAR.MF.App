import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loagingSubject = new BehaviorSubject<boolean>(false);

  loading$: Observable<boolean> = this.loagingSubject.asObservable();

  hide(): void {
    this.loagingSubject.next(false);
  }

  show(): void {
    this.loagingSubject.next(true);
  }
}
