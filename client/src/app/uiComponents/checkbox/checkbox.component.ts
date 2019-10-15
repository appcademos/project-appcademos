import { Component, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss']
})
export class CheckboxComponent
{
    @Input() red: boolean;
    @Input() checked: boolean;
    @Input() disabled: boolean;
    @Output() onChange: EventEmitter<any> = new EventEmitter();
    
    isChecked: boolean;

    constructor() { }
    
    onCheck()
    {
        this.onChange.emit(this.isChecked);
    }
    
    ngOnChanges(changes)
    {    
        if (changes.checked && changes.checked.currentValue != this.isChecked)
        {
            this.isChecked = changes.checked.currentValue;
        }
    }
}
