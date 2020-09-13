import { Component, OnInit, Input } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-image-carrousel',
  templateUrl: './image-carrousel.component.html',
  styleUrls: ['./image-carrousel.component.scss']
})
export class ImageCarrouselComponent
{
    @Input() images: any = [];
    currentGalleryImage: any;
    
    constructor() {}

    ngOnChanges()
    {
        if (this.currentGalleryImage == null &&
            this.images != null &&
            this.images.length > 0)
        {
            this.currentGalleryImage = this.images[0]
        }
    }
    
    onGalleryLoopFinished(last: boolean)
    {
        if (last)
        {
            let galleryCarousel = $('.gallery .gallery-items');

            if (!galleryCarousel.hasClass('slick-initialized'))
            {
                galleryCarousel.on('beforeChange', (event, slick, currentSlide, nextSlide) =>
                {
                    this.currentGalleryImage = this.images[nextSlide];
                });

                galleryCarousel.slick(
                {
                    infinite: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    speed: 300,
                    prevArrow: $('.gallery .left-area'),
                    nextArrow: $('.gallery .right-area')
                });
            }
        }
    }
}
