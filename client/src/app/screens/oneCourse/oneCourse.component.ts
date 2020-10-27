/// <reference types="@types/googlemaps" />
import { Component, ViewChild, HostListener, OnInit, OnDestroy } from "@angular/core";
import { CoursesService } from "../../../services/courses.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UtilsService } from '../../../services/utils.service';
import { UserSessionService } from '../../../services/userSession.service';
import { Router, Event, NavigationEnd } from '@angular/router';
declare var $: any;
import { MessageService } from '../../../services/message.service';
import { AcademySessionService } from '../../../services/academySession.service';
import { MetaService } from '@ngx-meta/core';
import * as moment from 'moment';
import { Subscription } from 'rxjs'
import { NzMessageService } from 'ng-zorro-antd'

@Component({
  selector: "app-oneCourse",
  templateUrl: "./oneCourse.component.html",
  styleUrls: ["./oneCourse.component.scss"]
})
export class OneCourseComponent implements OnInit, OnDestroy
{
    @ViewChild('map') mapDiv: any;

    routeCourseId: number;
    courseObj: any;
    reviewsAverage: number;
    reviews: any = [];
    reviewsCarouselReady: boolean = false;
    map: google.maps.Map;
    similarCourses: any = [];
    courseImages: any = [];
    currentGalleryImage: any;
    activatedRouteSubscription: any;
    showWarningbox: boolean = false;
    comment: string = '';
    commentGrade: number = 0;
    goToLastPublishedComment: boolean = false;
    publishingComment: boolean = false;
    commentPublished: boolean = false;
    updateReviews: boolean = false;
    
    reviewsFilterGrade: number;
    filteringReviews: boolean = false;
    
    checkoutRouterParams = null
    pedirInfoRouterParams = null
    
    heartAnimation = null
    heartAnimationMobile = null
    isSending: boolean = false
    isFavorite: boolean = null
    lottieConfig =
    {
       path: '../../../assets/public/lottie/heart_red.json',
       autoplay: false,
       loop: false
   }
   
   loginSubscription: Subscription

    constructor(private courseService: CoursesService,
                private academyService: AcademySessionService,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private utils: UtilsService,
                private usersService: UserSessionService,
                private router: Router,
                private messageService: MessageService,
                private readonly meta: MetaService,
                private notificationMessages: NzMessageService)
    {
        
    }
    ngOnInit()
    {
        this.scrollToHash();

        this.setMetaData();
        this.activatedRouteSubscription = this.activatedRoute.params.subscribe(params =>
        {
            this.init(params.id);
        });
        
        this.listenToLoginEvents()
    }
    ngOnDestroy()
    {
        this.removeMetaData();
        
        if (this.activatedRouteSubscription != null)
            this.activatedRouteSubscription.unsubscribe();
            
        if (this.loginSubscription != null)
            this.loginSubscription.unsubscribe()
    }
    init(courseId)
    {
        this.courseObj = undefined;
        this.reviewsAverage = undefined;
        this.reviews = undefined;
        this.map = undefined;
        this.similarCourses = [];
        this.courseImages = [];
        this.currentGalleryImage = undefined;
        this.showWarningbox = false;

        this.routeCourseId = courseId;
        
        this.isFavorite = this.usersService.hasFavorite(this.routeCourseId)
        
        this.getCourse();
    }

    ngAfterViewInit()
    {
        this.scrollToHash();
        
        if (this.isFavorite)
            this.playHeartAnimation()
    }

    scrollToHash()
    {
        let interval = setTimeout(()=>
        {
            if (this.router.url.indexOf('#reviews') > -1)
            {
               this.utils.scrollToElement('#reviews', undefined, 32);
            }
        }, 1000);
    }

    getCourse()
    {
        if (this.routeCourseId)
        {
            this.courseService.getCourse(this.routeCourseId)
            .subscribe(() =>
            {
                if (this.courseService.viewCourse.course.hidden)
                {
                    this.router.navigate(["/404"], { skipLocationChange: true });
                    return
                }
                
                this.courseObj = this.courseService.viewCourse;
                this.setMetaData();
                this.setCheckoutRouterParams();
                this.setPedirInfoRouterParams();
                
                this.courseObj.course.academyCategory = this.courseObj.course.academy.categories
                                                        .find(academyCategory =>
                                                        {
                                                            return academyCategory.category == this.courseObj.course.category._id
                                                        });

                if (!this.updateReviews)
                {
                    this.setCourseImages();
                    this.setMap();
                    this.getSimilarCourses();
                    this.setShowWarningbox();
                }

                this.updateReviews = false;

                this.calcReviewGrade(this.courseObj.course.academy.reviews);
                this.separateReviews();

                // Expand first item
                setTimeout(() => { this.expandItem('expandible-item-1'); });
                
                this.isFavorite = this.usersService.hasFavorite(this.courseObj.course._id)
                if (this.isFavorite)
                    setTimeout(() => { this.playHeartAnimation() })
            },
            (error) =>
            {
                if (error.status === 404)
                    this.router.navigate(["/404"], { skipLocationChange: true });
            });
        }
    }
    
    setCheckoutRouterParams()
    {
        let params = []
        let i = 0
        
        params[i++] = '/cursos-ingles';
        params[i++] = this.utils.queryCategoryToUrl(this.courseObj.course.category.name.toLowerCase());
        params[i++] = 'academia-' + this.courseObj.course.academy.name.replace(/ /g, '-').toLowerCase() + '-madrid';
        params[i++] = this.courseObj.course._id;
        params[i++] = 'checkout';
        
        this.checkoutRouterParams = params;
    }
    setPedirInfoRouterParams()
    {
        let params = []
        let i = 0
        
        params[i++] = '/cursos-ingles';
        params[i++] = this.utils.queryCategoryToUrl(this.courseObj.course.category.name.toLowerCase());
        params[i++] = 'academia-' + this.courseObj.course.academy.name.replace(/ /g, '-').toLowerCase() + '-madrid';
        params[i++] = this.courseObj.course._id;
        params[i++] = 'pedir-informacion';
        
        this.pedirInfoRouterParams = params;
    }
    
    backClicked()
    {
        this.location.back();
    }
    calcReviewGrade(reviews)
    {
        let average = 0;

        reviews.forEach(review =>
        {
            average += review.grade;
        });

        this.reviewsAverage = average / reviews.length;
    }
    expandItem(id: any)
    {
        $('#' + id + ' .content').slideToggle(200);
        $('#' + id).toggleClass('expanded');
    }
    onReviewsLoopFinished(last: boolean)
    {
        if (last)
        {
            let coursesCarousel = $('#reviews .carousel');

            if (!coursesCarousel.hasClass('slick-initialized'))
            {
                coursesCarousel.off('init', '**');
                coursesCarousel.off('breakpoint', '**');
                
                coursesCarousel.on('init', () =>
                {                    
                    this.reviewsCarouselReady = true;
                    $('#reviews .carousel .slick-list').css('overflow', 'visible');

                    if (this.goToLastPublishedComment)
                    {
                        this.utils.scrollToElement('#reviews');
                        setTimeout(() => { coursesCarousel.slick('slickGoTo', 0); }, 600);

                        this.goToLastPublishedComment = false;
                    }
                });
                coursesCarousel.on('breakpoint', () =>
                {
                    $('#reviews .carousel .slick-list').css('overflow', 'visible');
                });

                coursesCarousel.slick(
                {
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 300,
                    prevArrow: $('#reviews .carousel-container .prev-button'),
                    nextArrow: $('#reviews .carousel-container .next-button')
                });
            }
        }
    }
    setMap()
    {
        if (this.courseObj.course.academy.location == null ||
            this.courseObj.course.academy.location.coordinates == null ||
            this.courseObj.course.academy.location.coordinates[0] == null ||
            this.courseObj.course.academy.location.coordinates[1] == null)
            return
        
        const coordinates = this.courseObj.course.academy.location.coordinates;
        var mapProp =
        {
            center: new google.maps.LatLng(coordinates[0], coordinates[1]),
            zoom: 15,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            disableDefaultUI: true,
            zoomControl: false
        }

        setTimeout(() =>
        {
            this.map = new google.maps.Map(this.mapDiv.nativeElement, mapProp);

            var marker = new google.maps.Marker({ position: mapProp.center });
            marker.setMap(this.map);
        });
    }
    getSimilarCourses()
    {
        this.courseService.findCourses(this.courseObj.course.category.name, null, null, 11)
        .subscribe(() =>
        {
            this.similarCourses = this.courseService.foundCourses.filter(course => { return course._id != this.courseObj.course._id; });
        });
    }
    setCourseImages()
    {
        this.courseImages = [...this.courseObj.course.images];
        this.currentGalleryImage = this.courseImages[0];
    }
    onGalleryLoopFinished(last: boolean)
    {
        if (last)
        {
            let galleryCarousel = $('#gallery .gallery-items');

            if (!galleryCarousel.hasClass('slick-initialized'))
            {
                galleryCarousel.on('beforeChange', (event, slick, currentSlide, nextSlide) =>
                {
                    this.currentGalleryImage = this.courseImages[nextSlide];
                });

                galleryCarousel.slick(
                {
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 300,
                    prevArrow: $('#gallery .left-area'),
                    nextArrow: $('#gallery .right-area')
                });
            }
        }
    }
    setShowWarningbox()
    {
        const warningTags = ['b1', 'b2', 'c1']
        const courseCategoryName = this.courseObj.course.category.name.toLowerCase()

        if (this.courseObj.course.academy.isVerified &&
            warningTags.some(element => courseCategoryName.includes(element)))
        {
            this.showWarningbox = true;
        }
    }

    separateReviews(filterGrade?)
    {
        let allReviews = this.courseObj.course.academy.reviews;
        if (filterGrade != null)
        {
            allReviews = this.courseObj.course.academy.reviews
                        .filter((review) =>
                        {
                            return review.grade == filterGrade;
                        });
        }
        else
        {
            this.reviewsFilterGrade = null;
        }
        
        let reviews = []
        //const NUMBER_OF_ROWS = (allReviews.length > 4) ? 3 : 2;
        const NUMBER_OF_ROWS = 2;

        for (let i = 0; i < allReviews.length; i=i+NUMBER_OF_ROWS)
        {
            let divisionArr = allReviews.slice(i,i+NUMBER_OF_ROWS);
            reviews.push(divisionArr);
        }

        let coursesCarousel = $('#reviews .carousel');
        coursesCarousel.slick('unslick');
        
        setTimeout(() =>
        {
            this.reviews = reviews;
            setTimeout(() =>
            {
                this.onReviewsLoopFinished(true);
            }, 10);
        }, 10);
    }
    validateComment()
    {
        var allOk = true;
        var message = 'Rellena tu puntuación y escribe tu opinión.';

        if (this.comment == null || this.comment.trim().length == 0)
        {
            allOk = false;
        }

        if (this.commentGrade == null || this.commentGrade == 0)
        {
            allOk = false;
        }

        if (!allOk)
            alert(message);

        return allOk;
    }
    publishComment()
    {
        if (this.usersService.user != null)
        {
            if (this.validateComment())
            {
                var data =
                {
                    author: this.usersService.user._id,
                    description: this.comment.trim(),
                    grade: this.commentGrade
                }

                this.publishingComment = true;

                this.courseService.createReview(data).subscribe((review) =>
                {
                    let academyData = {...this.courseObj.course.academy}
                    academyData.reviews.push(review._id);

                    this.academyService.updateAcademy(academyData._id, academyData).subscribe(() =>
                    {
                        this.publishingComment = false;
                        this.commentPublished = true;
                        this.goToLastPublishedComment = true;
                        this.updateReviews = true;
                        this.getCourse();
                    },
                    (error) =>
                    {
                        this.publishingComment = false;
                        alert((error.json != null) ? error.json().message : error);
                    });
                },
                (error) =>
                {
                    this.publishingComment = false;
                    alert((error.json != null) ? error.json().message : error);
                });
            }
        }
        else
        {
            this.messageService.sendMessage({ showLogin: true });
        }
    }
    onClickReviewFilter(grade, event)
    {
        this.reviewsFilterGrade = (this.reviewsFilterGrade != grade) ? grade : null;
        event.preventDefault();
        
        this.filteringReviews = true;
        
        setTimeout(() =>
        {
            if (this.reviewsFilterGrade == null)
            {
                this.separateReviews();
            }
            else
            {
                this.separateReviews(this.reviewsFilterGrade);
            }
            
            this.filteringReviews = false;
            
        }, 600);
    }
    getTotalReviews(grade)
    {
        let total = 0;
        
        if (grade != null)
        {
            let filteredReviews = this.courseObj.course.academy.reviews
                                    .filter((review) =>
                                    {
                                        return review.grade == grade;
                                    });
                                    
            total = filteredReviews.length;
        }
        
        return total;
    }
    
    setMetaData()
    {
        if (this.courseObj != null && this.courseObj.course != null)
        {            
            let courseTitleNoDuration = this.courseObj.course.title.split(' - ')[0];
            let neighborhoods = 'Madrid';
            if (this.courseObj.course.academy.neighborhoods != null && this.courseObj.course.academy.neighborhoods.length > 0)
                neighborhoods = this.courseObj.course.academy.neighborhoods.join(', ');
            
            this.meta.setTitle(`${courseTitleNoDuration} | ${neighborhoods} | yinius`);
            this.meta.setTag('description', `${courseTitleNoDuration} en ${neighborhoods}. Horarios, precio, temario, opiniones verificadas... Toda la información de este curso de la academia ${this.courseObj.course.academy.name}.`);
            
            // Canonical
            if (window.location.href.indexOf('/curso/') > -1)
                this.setCanonicalTag();
        }        
    }
    removeMetaData()
    {
        this.meta.setTitle(null);
        this.meta.removeTag('name="description"');
        this.meta.removeTag('property="og:title"');
        this.meta.removeTag('property="og:description"');
    }
    setCanonicalTag()
    {
        let uri = this.getCanonicalUri()
        
        if (uri != null)
        {
            let link = !!document.querySelector("link[rel='canonical']") ? document.querySelector("link[rel='canonical']") : document.createElement('link');
            link.setAttribute('rel', 'canonical');
            link.setAttribute('href', location.protocol + '//' + location.host + uri);
            document.head.appendChild(link);
        }
    }
    getCanonicalUri()
    {
        let uri = null

        if (this.courseObj.course.category != null && this.courseObj.course.category.name.length > 0 &&
            this.courseObj.course.academy != null && this.courseObj.course.academy.name.length > 0)
        {
            uri = `/cursos-ingles/${this.utils.queryCategoryToUrl(this.courseObj.course.category.name.toLowerCase())}/academia-${this.courseObj.course.academy.name.replace(/ /g, '-').toLowerCase()}-madrid/${this.courseObj.course._id}`
        }

        return uri
    }
    
    getNameInitials(name, review)
    {
        if (review != null)
        {
            name = (review.author != null) ?
                    (review.author.lastName != null && review.author.lastName.length > 0) ?
                        `${review.author.name} ${review.author.lastName}`
                        :
                        review.author.name
                    :
                    review.guestName;
        }
        
        return this.utils.getNameInitials(name);
    }
    getUpdatedDate(date)
    {
        let formattedDate = '';
        
        if (date != null)
        {
            formattedDate = moment(date).locale("es").format("HH:mm DD/MM/YYYY")
        }
        
        return formattedDate;
    }
    getReviewDate(date)
    {
        let formattedDate = '';
        
        if (date != null)
        {
            formattedDate = moment(date).locale("es").format("MMMM [de] YYYY")
        }
        
        return formattedDate;
    }
    
    handleHeartAnimation(anim: any, isMobile: boolean)
    {
        if (isMobile)
            this.heartAnimationMobile = anim;
        else
            this.heartAnimation = anim;
    }
    reverseHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.goToAndStop(30, true);
            this.heartAnimation.setSpeed(3);
            this.heartAnimation.setDirection(-1);
            this.heartAnimation.play();
        }
        
        if (this.heartAnimationMobile != null)
        {
            this.heartAnimationMobile.goToAndStop(30, true);
            this.heartAnimationMobile.setSpeed(3);
            this.heartAnimationMobile.setDirection(-1);
            this.heartAnimationMobile.play();
        }
    }
    playHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.setSpeed(2);
            this.heartAnimation.setDirection(1);
            this.heartAnimation.play();
        }
        
        if (this.heartAnimationMobile != null)
        {  
            this.heartAnimationMobile.setSpeed(2);
            this.heartAnimationMobile.setDirection(1);
            this.heartAnimationMobile.play();
        }
    }
    resetHeartAnimation()
    {
        if (this.heartAnimation != null)
        {
            this.heartAnimation.goToAndStop(0, true)
        }
        
        if (this.heartAnimationMobile != null)
        {
            this.heartAnimationMobile.goToAndStop(0, true)
        }
    }
    onClickFavButton()
    {
        if (this.isSending)
            return
        
        if (this.usersService.user == null)
        {
            this.messageService.sendMessage({ showFavoritesLogin: true })
            return
        }
        
        if (this.isFavorite == null || !this.isFavorite)
        {
            this.sendAddFavorite()
            this.playHeartAnimation()
            this.isFavorite = true
        }
        else if (this.isFavorite)
        {
            this.sendRemoveFavorite()
            this.reverseHeartAnimation()
            this.isFavorite = false
        }
    }
    
    sendAddFavorite()
    {
        this.isSending = true

        this.usersService.addFavorite(this.courseObj.course._id)
        .subscribe((res) =>
        {
            this.isSending = false
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('success',
                        'Se ha guardado el curso en tus favoritos')
            }, 500)
        },
        (error) =>
        {
            this.isSending = false
            
            let message = 'No se ha podido añadir el favorito. Inténtalo de nuevo'
            
            if (error.status === 409)
                message = 'Ya tienes este favorito guardado'
            else
            {
                this.reverseHeartAnimation()
                this.isFavorite = false
            }
            
            setTimeout(() =>
            {
                this.notificationMessages.create('error', message)
            }, 500)    
        })
    }
    sendRemoveFavorite()
    {
        this.isSending = true
        
        this.usersService.removeFavorite(this.courseObj.course._id)
        .subscribe((res) =>
        {
            this.isSending = false
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('success',
                        'Se ha eliminado el curso de tus favoritos')
            }, 500)
        },
        (error) =>
        {
            this.isSending = false
            
            this.playHeartAnimation()
            this.isFavorite = true
            
            setTimeout(() =>
            {
                this.notificationMessages
                .create('error',
                        'No se ha podido eliminar el favorito. Inténtalo de nuevo')
            }, 500)
        })
    }
    
    listenToLoginEvents()
    {
        this.loginSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            if (typeof message.user != 'undefined')
            {                
                // Login
                if (message.user != null)
                {
                    this.isFavorite = this.usersService.hasFavorite(this.routeCourseId)
                    if (this.isFavorite)
                        this.playHeartAnimation()
                }
                else // Logout
                {
                    this.isFavorite = false
                    this.resetHeartAnimation()
                }
            }
        });
    }

    @HostListener('window:scroll')
    onScroll()
    {
        // Hide fixed bottom if footer reached
        if (this.utils.isMobileWidth())
        {
            if (window.pageYOffset + window.innerHeight - $('.fixed-button').outerHeight() >= $('footer').offset().top)
                $('.fixed-button').hide();
            else
                $('.fixed-button').show();
        }
    }
}
