import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent
{
    @Output() onChange: EventEmitter<any> = new EventEmitter();

    constructor() { }
}
