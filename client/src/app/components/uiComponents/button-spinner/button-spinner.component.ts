import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button-spinner',
  templateUrl: './button-spinner.component.html',
  styleUrls: ['./button-spinner.component.scss']
})
export class ButtonSpinnerComponent
{
    @Input() label: string;
    @Input() classes: string;
    @Input() showspinner: boolean;
    @Output() onClick = new EventEmitter<any>();

    constructor() { }

    onButtonClick()
    {
        this.showspinner = true;
        this.onClick.emit();
    }
}
