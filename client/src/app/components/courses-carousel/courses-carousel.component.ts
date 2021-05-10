import { Component, OnInit, Input } from '@angular/core';
import { WindowRefService } from '../../../services/windowRef.service'

@Component({
  selector: 'app-courses-carousel',
  templateUrl: './courses-carousel.component.html',
  styleUrls: ['./courses-carousel.component.scss']
})
export class CoursesCarouselComponent implements OnInit
{
    @Input() slickElementSelector: string;
    @Input() courses: any;

    carouselReady: boolean = false;

    constructor(private windowRefService: WindowRefService) { }

    ngOnInit() {}

    onLoopFinished(last: boolean)
    {
        let canUseJquery = (this.windowRefService.nativeWindow != null &&
                            (this.windowRefService.nativeWindow as any).$ != null)
        
        if (last && canUseJquery)
        {
            let coursesCarousel = (this.windowRefService.nativeWindow as any).$('.courses-carousel');

            if (!coursesCarousel.hasClass('slick-initialized'))
            {
                coursesCarousel.on('init', () =>
                {
                    this.carouselReady = true;
                    (this.windowRefService.nativeWindow as any).$('.courses-carousel .slick-list').css('overflow', 'visible');
                });
                coursesCarousel.on('breakpoint', () =>
                {
                    (this.windowRefService.nativeWindow as any).$('.courses-carousel .slick-list').css('overflow', 'visible');
                });

                coursesCarousel.slick(
                {
                    infinite: false,
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    speed: 300,
                    prevArrow: (this.windowRefService.nativeWindow as any).$('.courses-carousel-container .prev-button'),
                    nextArrow: (this.windowRefService.nativeWindow as any).$('.courses-carousel-container .next-button'),
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
