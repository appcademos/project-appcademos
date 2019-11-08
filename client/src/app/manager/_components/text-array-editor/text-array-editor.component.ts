import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-text-array-editor',
  templateUrl: './text-array-editor.component.html',
  styleUrls: ['./text-array-editor.component.scss']
})
export class TextArrayEditorComponent implements OnInit
{
    @Input() array: string[];
    @Output() arrayChange = new EventEmitter();
    
    expanded: boolean = false;
    
    constructor()
    {
    
    }

    ngOnInit()
    {
    
    }
    
    trackByIndex(index, item)
    {
        if (item != null)
            return null;
        else
            return index;
    }
    
    removeArrayItem(index)
    {
        this.array.splice(index, 1);
    }
    addInput()
    {
        this.array.push("");
    }
}
