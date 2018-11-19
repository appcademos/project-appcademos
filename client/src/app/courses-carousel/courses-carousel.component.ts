import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-courses-carousel',
  templateUrl: './courses-carousel.component.html',
  styleUrls: ['./courses-carousel.component.scss']
})
export class CoursesCarouselComponent implements OnInit
{
    @Input() slickElementSelector: string;
    @Input() courses: any;

    constructor() { }

    ngOnInit() {}

    onLoopFinished(last: boolean)
    {
        if (last)
        {
            let coursesCarousel = $('.courses-carousel');

            if (!coursesCarousel.hasClass('slick-initialized'))
            {
                coursesCarousel.on('init', () =>
                {
                    $('.courses-carousel .slick-list').css('overflow', 'visible');
                });
                coursesCarousel.on('breakpoint', () =>
                {
                    $('.courses-carousel .slick-list').css('overflow', 'visible');
                });

                coursesCarousel.slick(
                {
                    infinite: false,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    prevArrow: $('.courses-carousel-container .prev-button'),
                    nextArrow: $('.courses-carousel-container .next-button'),
                    responsive:
                    [
                        {
                            breakpoint: 1180,
                            settings:
                            {
                                slidesToShow: 3
                            }
                        },
                        {
                            breakpoint: 880,
                            settings:
                            {
                                slidesToShow: 2
                            }
                        },
                        {
                            breakpoint: 580,
                            settings:
                            {
                                slidesToShow: 1
                            }
                        }
                    ]
                });
            }
        }
    }
}
