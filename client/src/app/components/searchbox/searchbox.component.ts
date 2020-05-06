import { Component, ViewChild, Input, Output, ElementRef, EventEmitter } from '@angular/core';
import { UtilsService } from '../../../services/utils.service';

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
    @Input() isHome: boolean;
    @Input() shorter: boolean;
    @Input() useTags: boolean;
    @Input() hideSearchButton: boolean = false;
    @Output() onSearch = new EventEmitter();
    @Output() onFocus = new EventEmitter();

    @ViewChild('searchbox') searchbox: ElementRef;
    @ViewChild('searchInput') searchInput: ElementRef;

    query: String;
    showSearchPanel: boolean;
    selectedTab: number = TAB_CERTIFICATES;

    constructor(private utils: UtilsService)
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
    
    onClickInput()
    {        
        if (this.useTags && !this.showSearchPanel)
        {
            this.doShowSearchPanel();
            this.onFocus.emit();
        }
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
    
    onCloseTag()
    {
        this.query = null;
        setTimeout(() =>
        {
            this.focus();
            this.doShowSearchPanel();
        });
    }
    
    getCategoryTagTitle(category)
    {
        let cat = category.replace(/-/g, ' ');
        return (cat.length > 5) ? cat.charAt(0).toUpperCase() + cat.slice(1) : cat.toUpperCase();
    }
}
