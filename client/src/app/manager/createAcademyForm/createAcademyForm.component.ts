import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AcademySessionService } from '../../../services/academySession.service';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd';
import { NEIGHBORHOODS } from '../../../services/utils.service';

@Component({
  selector: 'app-createAcademyForm',
  templateUrl: './createAcademyForm.component.html',
  styleUrls: ['./createAcademyForm.component.scss']
})
export class CreateAcademyFormComponent implements OnInit
{    
    @Input() academy: any;
    @Input() createMode: boolean;
    
    @Output() onAcademyError: EventEmitter<any> = new EventEmitter();
    @Output() onAcademyCreated: EventEmitter<any> = new EventEmitter();
    @Output() onAcademyUpdated: EventEmitter<any> = new EventEmitter();

    name: string;
    address: string;
    latitude: string;
    longitude: string;
    district: string;
    city: string;
    isVerified: boolean = false;
    whyChooseMe: string;
    neighborhoods = []
    
    allNeighborhoods = [...NEIGHBORHOODS]
    loading = false

    constructor(public router: Router,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService) { }

    ngOnInit()
    {
        if (this.academy != null)
        {            
            this.name = this.academy.name;
            this.address = this.academy.address;
            this.latitude = '' + this.academy.location.coordinates[0];
            this.longitude = '' + this.academy.location.coordinates[1];
            this.district = this.academy.district;
            this.city = this.academy.city;
            this.isVerified = this.academy.isVerified;
            this.whyChooseMe = this.academy.whyChooseMe;
            this.neighborhoods = this.academy.neighborhoods;
        }
    }
    
    onPressMainButton()
    {
        if (this.createMode)
        {
            this.createAcademy();
        }
        else
        {
            this.updateAcademy();
        }
    }

    validateAcademy()
    {
        var allOk = true;

        if (this.name == null || this.name.trim().length == 0)
        {
            allOk = false;
        }
        if (this.address == null || this.address.trim().length == 0)
        {
            allOk = false;
        }
        if (this.latitude == null || this.latitude.trim().length == 0)
        {
            allOk = false;
        }
        if (this.longitude == null || this.longitude.trim().length == 0)
        {
            allOk = false;
        }
        if (this.district == null || this.district.trim().length == 0)
        {
            allOk = false;
        }
        if (this.city == null || this.city.trim().length == 0)
        {
            allOk = false;
        }
        

        if (!allOk)
        {
            this.notifications.create(
              'error',
              'Error',
               `Rellena correctamente todos los datos`
            );
        }

        return allOk;
    }
    updateAcademy()
    {
        if (this.validateAcademy())
        {
            this.loading = true
            
            var academyToUpdate =
            {
                name: this.name.trim(),
                address: this.address.trim(),
                location: { coordinates: [ parseFloat(this.latitude.trim()), parseFloat(this.longitude.trim()) ] },
                district: this.district.trim(),
                city: this.city.trim(),
                isVerified: this.isVerified,
                
                neighborhoods: (this.neighborhoods != null && this.neighborhoods.length > 0) ?
                                this.neighborhoods : null,
                whyChooseMe: (this.whyChooseMe != null && this.whyChooseMe.trim().length > 0) ?
                             this.whyChooseMe : null
            }

            this.academyService.updateAcademy(this.academy._id, academyToUpdate)
            .subscribe(res =>
            {
                this.loading = false
                
                this.notifications.create(
                  'success',
                  'Info Academia',
                  'La información de academia se ha guardado'
                );
                
                this.onAcademyUpdated.emit();
            },
            error =>
            {
                this.loading = false
                
                this.notifications.create(
                  'error',
                  'Error',
                  'No se ha podido guardar la información de academia'
                );
                
                console.log(error);
            });
        }
    }
    createAcademy()
    {
        if (this.validateAcademy())
        {
            var academyToCreate =
            {
                name: this.name.trim(),
                address: this.address.trim(),
                location:
                {
                    coordinates: [ parseFloat(this.latitude.trim()), parseFloat(this.longitude.trim()) ]
                },
                district: this.district.trim(),
                city: this.city.trim(),
                isVerified: this.isVerified,
                
                neighborhoods: (this.neighborhoods != null && this.neighborhoods.length > 0) ?
                                this.neighborhoods : null,
                whyChooseMe: (this.whyChooseMe != null && this.whyChooseMe.trim().length > 0) ?
                             this.whyChooseMe : null
            }

            this.loading = true

            this.academyService.createAcademy(academyToCreate)
            .subscribe(res =>
            {
                this.loading = false
                
                this.onAcademyCreated.emit();
                this.showAcademyCreatedSuccessNotification();
            },
            error =>
            {
                this.loading = false

                this.showAcademyCreatedErrorNotification();
                
                console.log(error);
            });
        }
    }
    
    showAcademyCreatedSuccessNotification()
    {
        this.notifications.create(
          'success',
          'Curso creado',
          `La academia "${this.name}" ha sido creada`
        );
    }
    showAcademyCreatedErrorNotification()
    {        
        this.notifications.create(
          'error',
          'Error',
           `La academia "${this.name}" no ha podido crearse`
        );
    }
}