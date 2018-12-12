import { Component, ViewChild } from "@angular/core";
import { CoursesService } from "../../services/courses.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { UtilsService } from '../../services/utils.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { } from '@types/googlemaps';
declare var $: any;

@Component({
  selector: "app-oneCourse",
  templateUrl: "./oneCourse.component.html",
  styleUrls: ["./oneCourse.component.scss"],
  providers: [UtilsService]
})
export class OneCourseComponent
{
    @ViewChild('map') mapDiv: any;

    routeCourseId: number;
    courseObj: any;
    reviewsAverage: number;
    expandedItemId: any;
    reviews: any = [];
    reviewsCarouselReady: boolean = false;
    map: google.maps.Map;
    similarCourses: any = [];
    courseImages: any = [];
    currentGalleryImage: any;
    activatedRouteSubscription: any;

    constructor(private courseService: CoursesService,
                private activatedRoute: ActivatedRoute,
                private location: Location,
                private utils: UtilsService,
                private router: Router)
    {

    }
    ngOnInit()
    {
        this.activatedRouteSubscription = this.activatedRoute.queryParams.subscribe(params =>
        {
            this.courseObj = undefined;
            this.reviewsAverage = undefined;
            this.expandedItemId = undefined;
            this.reviews = undefined;
            this.map = undefined;
            this.similarCourses = [];
            this.courseImages = [];
            this.currentGalleryImage = undefined;

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
                this.setCourseImages();
                this.calcReviewGrade(this.courseObj.course.academy.reviews);
                this.separateReviews();
                this.setMap();
                this.getSimilarCourses();
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
        if (this.expandedItemId != id)
        {
            $('.expandible-item .content').slideUp(200);
            $('.expandible-item').removeClass('expanded');

            $('#' + id + ' .content').slideDown(200);
            $('#' + id).addClass('expanded');
        }
        else
        {
            $('#' + id + ' .content').slideToggle(200);
            $('#' + id).toggleClass('expanded');
        }

        this.expandedItemId = id;
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
        const NUMBER_OF_ROWS = (allAcademies.length > 4) ? 3 : 2;

        for (let i = 0; i < allAcademies.length; i=i+NUMBER_OF_ROWS)
        {
            let divisionArr = allAcademies.slice(i,i+NUMBER_OF_ROWS);
            reviews.push(divisionArr);
        }

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
}
