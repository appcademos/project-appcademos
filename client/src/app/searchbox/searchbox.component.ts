import { Component, ViewChild, Input, Output, ElementRef, EventEmitter } from '@angular/core';

const TAB_CERTIFICATES  = 1;
const TAB_LEVELS        = 2;

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.scss']
})
export class SearchboxComponent
{
    @Input() small: boolean;
    @Input() fixed: boolean;
    @Output() onSearch = new EventEmitter();
    @Output() onFocus = new EventEmitter();

    @ViewChild('searchbox') searchbox: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;

    query: String;
    showSearchPanel: boolean;
    selectedTab: number = TAB_CERTIFICATES;

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
