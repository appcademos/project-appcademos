import { Component, OnInit, Input } from '@angular/core';
import { WindowRefService } from '../../../services/windowRef.service'

@Component({
  selector: 'app-image-carrousel',
  templateUrl: './image-carrousel.component.html',
  styleUrls: ['./image-carrousel.component.scss']
})
export class ImageCarrouselComponent
{
    @Input() images: any = [];
    currentGalleryImage: any;
    
    constructor(private windowRefService: WindowRefService) {}

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
        let canUseJquery = (this.windowRefService.nativeWindow != null &&
                            (this.windowRefService.nativeWindow as any).$ != null)
        
        if (last && canUseJquery)
        {
            let galleryCarousel = (this.windowRefService.nativeWindow as any).$('.gallery .gallery-items');

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
                    prevArrow: (this.windowRefService.nativeWindow as any).$('.gallery .left-area'),
                    nextArrow: (this.windowRefService.nativeWindow as any).$('.gallery .right-area')
                });
            }
        }
    }
}
