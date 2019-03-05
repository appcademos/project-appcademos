import { Component, ViewChild, HostListener } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UtilsService } from '../../services/utils.service';
import { UserSessionService } from '../../services/userSession.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { } from '@types/googlemaps';
declare var $: any;
import { MessageService } from '../../services/message.service';
import { AcademySessionService } from '../../services/academySession.service';

const MOBILE_WIDTH = 870;

@Component({
  selector: "app-oneCourse",
  templateUrl: "./oneCourse.component.html",
  styleUrls: ["./oneCourse.component.scss"]
})
export class OneCourseComponent
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
    goToLastComment: boolean = false;
    publishingComment: boolean = false;
    commentPublished: boolean = false;
    updateReviews: boolean = false;

    constructor(private courseService: CoursesService,
                private academyService: AcademySessionService,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private utils: UtilsService,
                private usersService: UserSessionService,
                private router: Router,
                private messageService: MessageService)
    {

    }
    ngOnInit()
    {
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params =>
        {
            this.courseObj = undefined;
            this.reviewsAverage = undefined;
            this.reviews = undefined;
            this.map = undefined;
            this.similarCourses = [];
            this.courseImages = [];
            this.currentGalleryImage = undefined;
            this.showWarningbox = false;

            this.routeCourseId = params.id;
            this.getCourse();
        });
    }
    ngOnDestroy()
    {
        if (this.activatedRouteSubscription != null)
            this.activatedRouteSubscription.unsubscribe();
    }

    getCourse()
    {
        if (this.routeCourseId)
        {
            this.courseService.getCourse(this.routeCourseId).subscribe(() =>
            {
                this.courseObj = this.courseService.viewCourse;

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
            });
        }
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
                coursesCarousel.on('init', () =>
                {
                    this.reviewsCarouselReady = true;
                    $('#reviews .carousel .slick-list').css('overflow', 'visible');

                    if (this.goToLastComment)
                    {
                        setTimeout(() => { coursesCarousel.slick('slickGoTo', this.reviews.length); });

                        this.goToLastComment = false;
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
    separateReviews()
    {
        let allAcademies = this.courseObj.course.academy.reviews;
        let reviews = [];
        //const NUMBER_OF_ROWS = (allAcademies.length > 4) ? 3 : 2;
        const NUMBER_OF_ROWS = 2;

        for (let i = 0; i < allAcademies.length; i=i+NUMBER_OF_ROWS)
        {
            let divisionArr = allAcademies.slice(i,i+NUMBER_OF_ROWS);
            reviews.push(divisionArr);
        }

        let coursesCarousel = $('#reviews .carousel');
        coursesCarousel.slick('unslick');

        this.reviews = reviews;
    }
    setMap()
    {
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
        this.courseService.findCourses(this.courseObj.course.tags[0])
        .subscribe(() =>
        {
            this.similarCourses = this.courseService.foundCourses.filter(course => { return course._id != this.courseObj.course._id; });
        });
    }
    setCourseImages()
    {
        this.courseImages = [...this.courseObj.course.images, ...this.courseObj.course.academy.images];
        this.courseImages = this.courseImages.filter(courseImage => courseImage.imagePath != null);
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
        const coursesToShowWarningbox = ['5b98fc7383a7d478967eead0', '5b98fde083a7d478967eead3', '5b99045483a7d478967eead7', '5b99059283a7d478967eeada', '5b990b7183a7d478967eeadd'];

        if (coursesToShowWarningbox.includes(this.courseObj.course._id))
            this.showWarningbox = true;
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
                        this.goToLastComment = true;
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

    @HostListener('window:scroll')
    onScroll()
    {
        // Hide fixed bottom if footer reached
        if (window.innerWidth <= MOBILE_WIDTH)
        {
            if (window.pageYOffset + window.innerHeight - $('.fixed-button').outerHeight() >= $('footer').offset().top)
                $('.fixed-button').hide();
            else
                $('.fixed-button').show();
        }
    }
}
