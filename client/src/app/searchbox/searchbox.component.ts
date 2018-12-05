import { Component, ViewChild, Input, Output, ElementRef, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent
{
    @Input() small: boolean;
    @Output() onSearch = new EventEmitter();

    @ViewChild('searchbox') searchbox: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;

    query: String;
    showSearchPanel: boolean;

    constructor()
    {

    }

    focus()
    {
        this.searchInput.nativeElement.focus();
    }
    blur()
    {
        this.searchInput.nativeElement.blur();
    }

    doShowSearchPanel()
    {
        this.showSearchPanel = true;
    }
    doHideSearchPanel()
    {
        this.showSearchPanel = false;
    }

    setInputValue(value)
    {
        this.query = value;
    }

    onInputPressEsc()
    {
        this.doHideSearchPanel();
        this.blur();
    }
    doOnSearch()
    {
        this.onSearch.emit(this.query);
        this.doHideSearchPanel();
    }
}
