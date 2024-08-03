import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[letras-somente]',
  standalone: true,
})
export class LetrasSomenteDirective {
  constructor() {}

  @HostListener('keyup', ['$event'])
  onKeyUp($event: any) {
    let valor = $event.target.value;
    valor = valor.replace(/[^a-zA-Z]/g, '');
    $event.target.value = valor;
  }
}
