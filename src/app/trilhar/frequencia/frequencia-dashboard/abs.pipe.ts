import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abs',
  standalone: true // Torna o Pipe standalone
})
export class AbsPipe implements PipeTransform {
  transform(value: number): number {
    return Math.abs(value);
  }
}
