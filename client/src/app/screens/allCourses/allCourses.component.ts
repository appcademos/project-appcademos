import { Component, ViewChild, HostListener, Inject } from "@angular/core";
import { CoursesService } from "../../../services/courses.service";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { Location, DOCUMENT } from '@angular/common';
import { UtilsService, NEIGHBORHOODS } from '../../../services/utils.service';
import { MetaService } from '@ngx-meta/core';
import { AcademySessionService } from '../../../services/academySession.service'

const ORDER_RELEVANCE = 1;
const ORDER_PRICE_ASCENDING = 2;

@Component({
  selector: "app-allCourses",
  templateUrl: "./allCourses.component.html",
  styleUrls: ["./allCourses.component.scss"]
})
export class AllCoursesComponent
{
    @ViewChild('orderbox') orderbox;

    cities = []
    neighborhoods = []
    allCourses = []
    courses = []
    orders =
    [
        { id: ORDER_RELEVANCE, name: 'Mejor valorados' },
        { id: ORDER_PRICE_ASCENDING, name: 'Precio (más bajo arriba)' }
    ]
    
    selectedCity: any = null
    appliedCity: any = null
    
    selectedNeighborhoods = []
    appliedNeighborhoods = []
    
    selectedOrder: any = this.orders[0].id;
    appliedOrder: any = this.orders[0].id;
    
    selectedModality: string = null
    appliedModality: string = null
    
    searching: boolean = false;
    searchbarOffsetTop: number = undefined;
    searchCategory: string = null;
    commonCategoryFullName: string = null;
    
    showNeighborhoodFilters: boolean = false;
    showModalityFilters: boolean = false;
    showOrderFilters: boolean = false;
    
    showMobileFilters: boolean = false;
    
    fixedFilters: boolean = false;
    showFixedFilters: boolean = false;
    searchviewOffsetTop: number = undefined;
    lastScrollOffsetTop: number = 0;
    
    justUpdatedQueryParams: boolean = false


    constructor(private courseService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private router: Router,
                private location: Location,
                private utils: UtilsService,
                private readonly meta: MetaService,
                private academyService: AcademySessionService,
                @Inject(DOCUMENT) private document: Document)
    {
        this.courseService.searching = true;
    }
    ngOnInit()
    {
        this.getCities().then(() =>
        {
            this.initCoursesSearch()

            this.router.events.subscribe((val) =>
            {
                if (val instanceof NavigationEnd)
                {                
                    if (!this.justUpdatedQueryParams)
                        this.initCoursesSearch()
                    else
                        this.justUpdatedQueryParams = false
                }
            });
        })
    }
    ngAfterViewInit()
    {
        let theSearchView = <HTMLElement>this.document.getElementsByClassName('search-view')[0];
        this.searchbarOffsetTop = theSearchView.offsetTop + theSearchView.offsetHeight;
        this.searchviewOffsetTop = theSearchView.offsetTop;
    }
    ngOnDestroy()
    {
        this.removeMetaData();
    }

    initCoursesSearch()
    {
        let params = this.activatedRoute.snapshot.params
        let queryParams = this.activatedRoute.snapshot.queryParams
        
        let category = this.utils.urlCategoryToQuery(params.category);
        this.setMetaData(false, category);
        
        if (category != null && category.length !== 0)
        {
            this.searchCategory = category;
            
            this.appliedModality = (queryParams.modalidad == null ||
                                    queryParams.modalidad === 'todos') ?
                                    null : queryParams.modalidad
            this.selectedModality = this.appliedModality
            
            this.appliedNeighborhoods = (queryParams.ubicaciones != null) ?
                                         JSON.parse(queryParams.ubicaciones) : []
            this.selectedNeighborhoods = (this.appliedNeighborhoods != null) ? [...this.appliedNeighborhoods] : []
            
            if (this.appliedNeighborhoods != null &&
                this.appliedNeighborhoods.length > 0)
            {
                this.selectedCity = this.cities.find(c => c.neighborhoods.some(n => n._id === this.appliedNeighborhoods[0]))
                this.onClickCity(this.selectedCity)
            }
            else if (queryParams.ciudad != null)
            {                
                this.selectedCity = this.cities.find(c => c._id === JSON.parse(queryParams.ciudad))
                this.appliedCity = this.selectedCity
                this.onClickCity(this.selectedCity)
            }
            
            if (queryParams.orden != null)
            {
                this.appliedOrder = parseInt(queryParams.orden)
                this.selectedOrder = this.appliedOrder
            }
            
            this.findCourses(category, null, this.appliedModality);
        }
    }
    findCourses(query, all = false, modality = null)
    {
        if (!all)
        {
            if (query != null && query.trim().length > 0)
            {
                this.searching = true;
                
                let queryParams = this.activatedRoute.snapshot.queryParams
                
                let city = (this.selectedNeighborhoods.length == 0 &&
                            this.selectedCity != null) ?
                            this.selectedCity._id : null
                
                this.courseService.findCourses(query, this.selectedNeighborhoods, city, modality)
                .subscribe(() =>
                {                    
                    this.allCourses = [...this.courseService.foundCourses];
                    this.courses = [...this.courseService.foundCourses];
                    this.orderBy(this.appliedOrder);
                    this.searching = false;
                    this.commonCategoryFullName = this.findCommonCategoryFullName(this.courseService.foundCourses);
                    
                    this.appliedCity = this.selectedCity
                    this.appliedNeighborhoods = [...this.selectedNeighborhoods]
                    this.appliedModality = this.selectedModality
                    
                    this.updateQueryParams()
                });
            }
        }
        else
        {
            this.searching = true;
            
            this.courseService.getAll()
            .subscribe(() =>
            {
                this.allCourses = [...this.courseService.foundCourses];
                this.courses = [...this.courseService.foundCourses];
                this.orderBy(this.appliedOrder);
                this.searching = false;
            });
        }
    }
    orderBy(orderId)
    {
        this.appliedOrder = orderId;

        switch (this.appliedOrder)
        {
            case ORDER_RELEVANCE:
            this.courses = this.courses.sort((courseA, courseB) =>
            {
                if (courseA.academy.averageRating > courseB.academy.averageRating)
                    return -1;
                else if (courseA.academy.averageRating < courseB.academy.averageRating)
                    return 1;
                else
                {
                    if (courseA.academy.reviews.length > courseB.academy.reviews.length)
                        return -1;
                    else if (courseA.academy.reviews.length < courseB.academy.reviews.length)
                        return 1;
                    else
                    {
                        if (courseA.impressions > courseB.impressions)
                            return -1;
                        else if (courseA.impressions < courseB.impressions)
                            return 1;
                        else
                            return 0;
                    }
                }
            });
            break;

            case ORDER_PRICE_ASCENDING:
            this.courses = this.courses.sort((courseA, courseB) =>
            {
                if (courseA.price > courseB.price)
                    return 1;
                else if (courseA.price < courseB.price)
                    return -1;
                else
                    return 0;
            });
            break;
        }
        
        this.updateQueryParams()
    }
    findCommonCategoryFullName(coursesArray)
    {
        if (coursesArray == null || coursesArray.length === 0)
            return null;
        
        let commonCatFullName = coursesArray[0].category.fullName;
        let i = 0;
        
        while (i < coursesArray.length && commonCatFullName != null)
        {
            if (commonCatFullName != coursesArray[i].category.fullName)
                commonCatFullName = null;
                
            i++;
        }
        
        return commonCatFullName;
    }
    
    setMetaData(isSearchingAllCourses: boolean, searchText?: string)
    {
        if (!isSearchingAllCourses && searchText != null)
        {
            let titleText = searchText;
            switch(searchText)
            {
                case 'first':       titleText = 'First Certificate (FCE) inglés'; break;
                case 'advanced':    titleText = 'Advanced (CAE) inglés'; break;
                case 'proficiency': titleText = 'Proficiency (CPE) inglés'; break;
                case 'nivel b1':    titleText = 'Inglés Nivel B1'; break;
                case 'nivel b2':    titleText = 'Inglés Nivel B2'; break;
                case 'nivel c1':    titleText = 'Inglés Nivel C1'; break;
                case 'toefl':       titleText = 'TOEFL inglés'; break;
                case 'ielts':       titleText = 'IELTS inglés'; break;
                case 'toeic':       titleText = 'TOEIC inglés'; break;
            }
            
            let descriptionText = searchText;
            switch(descriptionText)
            {
                case 'first':       descriptionText = 'First Certificate (FCE)'; break;
                case 'advanced':    descriptionText = 'Advanced (CAE)'; break;
                case 'proficiency': descriptionText = 'Proficiency (CPE)'; break;
                case 'nivel b1':    descriptionText = 'Inglés Nivel B1'; break;
                case 'nivel b2':    descriptionText = 'Inglés Nivel B2'; break;
                case 'nivel c1':    descriptionText = 'Inglés Nivel C1'; break;
                case 'toefl':       descriptionText = 'TOEFL'; break;
                case 'ielts':       descriptionText = 'IELTS'; break;
                case 'toeic':       descriptionText = 'TOEIC'; break;
            }
            
            this.meta.setTitle(`Comparador cursos ${titleText} en Madrid | yinius`);
            this.meta.setTag('description', `Compara los mejores cursos de ${descriptionText} cerca de ti. Horarios, precios, temario, opiniones verificadas... Compara toda la información y reserva.`);
        }
        else
        {
            this.meta.setTitle(`Comparador cursos de Inglés en Madrid | yinius`);
            this.meta.setTag('description', `Compara los cursos de las mejores academias de Inglés en Madrid.`);
        }
    }
    removeMetaData()
    {
        this.meta.setTitle(null);
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:title"');
        this.meta.removeTag('property="og:description"');
    }
    
    updateQueryParams()
    {
        let queryParams =
        {
            modalidad: this.appliedModality,
            orden: this.appliedOrder
        }
        
        if (this.appliedNeighborhoods.length > 0)
            (queryParams as any).ubicaciones = JSON.stringify(this.appliedNeighborhoods)
        else if (this.appliedCity)
            (queryParams as any).ciudad = JSON.stringify(this.appliedCity._id)
        
        this.router.navigate([], 
        {
            relativeTo: this.activatedRoute,
            queryParams: queryParams,
            //queryParamsHandling: 'preserve'
        })
        
        this.justUpdatedQueryParams = true
    }
    
    toggleMobileFilters()
    {
        if (!this.showMobileFilters)
        {
            this.showMobileFilters = true;
            
            if (this.utils.isMobileWidth())
            {
                this.document.body.style.overflow = 'hidden';
                this.document.getElementById("hubspot-messages-iframe-container").classList.add('hidden');
            }
        }
        else
        {
            this.showMobileFilters = false;
            
            if (this.utils.isMobileWidth())
            {
                this.document.body.style.overflow = 'initial';
                setTimeout(() =>
                {
                    this.document.getElementById("hubspot-messages-iframe-container").classList.remove('hidden');
                }, 250);
            }
        }
    }
    toggleModalityFilters()
    {
        this.showModalityFilters = !this.showModalityFilters
        
        if (this.showModalityFilters)
        {
            this.selectedModality = this.appliedModality
            
            this.showNeighborhoodFilters = false
            this.showOrderFilters = false
        }
    }
    toggleNeighborhoodFilters()
    {
        this.showNeighborhoodFilters = !this.showNeighborhoodFilters
        
        if (this.showNeighborhoodFilters)
        {
            this.selectedCity = this.appliedCity
            this.selectedNeighborhoods = [...this.appliedNeighborhoods]
            this.onClickCity(this.selectedCity)
            
            this.showModalityFilters = false
            this.showOrderFilters = false
        }
    }
    toggleOrderFilters()
    {
        this.showOrderFilters = !this.showOrderFilters
        
        if (this.showOrderFilters)
        {
            this.selectedOrder = this.appliedOrder
            
            this.showModalityFilters = false
            this.showNeighborhoodFilters = false
        }
    }
    
    getCities()
    {
        return new Promise(resolve =>
        {
            this.academyService.getCities()
            .subscribe(res =>
            {
                this.cities = res
                resolve()
            },
            error =>
            {            
                console.log(error)
                resolve()
            })
        })
    }
    onClickCity(city)
    {
        if (city == null || city.neighborhoods == null)
            return
        
        this.selectedCity = city
        this.neighborhoods = city.neighborhoods
    }
    
    onChangeNeighborhoodFilter(neighborhood, isChecked, reloadCourses = false)
    {
        if (isChecked && !this.selectedNeighborhoods.includes(neighborhood._id))
        {
            this.selectedNeighborhoods.push(neighborhood._id);
        }
        
        if (!isChecked && this.selectedNeighborhoods.includes(neighborhood._id))
        {
            this.selectedNeighborhoods = this.selectedNeighborhoods.filter(n => n !== neighborhood._id);
        }

        if (reloadCourses)
            this.findCourses(this.searchCategory);
    }
    onClickApplyFilters()
    {
        this.toggleMobileFilters();
            
        this.findCourses(this.searchCategory);
    }
    
    onClickApplyModalityFilter()
    {
        this.hideFilterBoxes()
        
        if (this.selectedModality === 'online')
        {
            this.selectedNeighborhoods = []
            this.appliedNeighborhoods = []
        }
        
        this.findCourses(this.searchCategory, false, this.selectedModality)
    }
    onClickApplyFilterNeighborhoods()
    {
        this.hideFilterBoxes()
        
        if (this.selectedModality === 'online')
        {
            this.appliedModality = null
        }
        
        this.selectedModality = this.appliedModality
        this.selectedOrder = this.appliedOrder
        
        this.findCourses(this.searchCategory, false, this.appliedModality)
    }
    onClickApplyOrderFilter()
    {
        this.hideFilterBoxes()
        this.orderBy(this.selectedOrder)
    }
    
    hideFilterBoxes()
    {
        if (this.showModalityFilters)
            this.toggleModalityFilters()
        
        if (this.showNeighborhoodFilters)
            this.toggleNeighborhoodFilters()
            
        if (this.showOrderFilters)
            this.toggleOrderFilters()
    }
    
    isNeighborhoodSelected(neighborhood)
    {
        return this.selectedNeighborhoods.includes(neighborhood._id);
    }
    shouldShowMobileFilterButton()
    {
        return false// (window.innerWidth <= 580 && this.selectedNeighborhoods.length === 0);
    }

    @HostListener("window:scroll", [])
    onScroll()
    {
        let number = window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
        let downScroll = (number > this.lastScrollOffsetTop);
        const minScrollDelta = 28;
        let processEvent = Math.abs(this.lastScrollOffsetTop - number) >= minScrollDelta;
        
        if (processEvent)
        {            
            if (this.searchbarOffsetTop != null)
            {
                if (!downScroll && number >= this.searchviewOffsetTop)
                {
                    if (!this.fixedFilters)
                    {
                        this.fixedFilters = true;
                        setTimeout(() =>
                        {
                            this.showFixedFilters = true;
                        }, 100);
                    }
                }
                else
                {
                    if (this.fixedFilters)
                    {
                        this.showFixedFilters = false;
                        this.fixedFilters = false;
                    }
                }
            }
            
            this.lastScrollOffsetTop = number;
        }
    }
}
