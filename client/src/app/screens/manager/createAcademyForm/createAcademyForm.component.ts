import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AcademySessionService } from '../../../../services/academySession.service';
import { Router } from "@angular/router";
import * as moment from 'moment';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzNotificationService } from 'ng-zorro-antd';
import { NEIGHBORHOODS } from '../../../../services/utils.service';

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
    city: string;
    isVerified: boolean = false;
    whyChooseMe: string;
    cities = []
    neighborhoods = []
    
    allNeighborhoods = []
    loading = false

    constructor(public router: Router,
                private academyService: AcademySessionService,
                private notifications: NzNotificationService) { }

    ngOnInit()
    {
        this.getCities()
        
        if (this.academy != null)
        {
            console.log(this.academy)
            
            this.name = this.academy.name;
            if (this.academy.address)
                this.address = this.academy.address;
            if (this.academy.location != null &&
                this.academy.location.coordinates != null &&
                this.academy.location.coordinates.length === 2 &&
                this.academy.location.coordinates[0] != null &&
                this.academy.location.coordinates[1] != null)
            {
                this.latitude = '' + this.academy.location.coordinates[0];
                this.longitude = '' + this.academy.location.coordinates[1];
            }

            this.isVerified = this.academy.isVerified;
            this.whyChooseMe = this.academy.whyChooseMe;
        }
    }
    
    getCities()
    {
        this.academyService.getCities()
        .subscribe(res =>
        {
            this.cities = res
            
            if (this.academy == null)
            {
                this.city = this.cities[0]._id
                this.allNeighborhoods = this.cities[0].neighborhoods
            }
            else
            {
                this.city = this.academy.neighborhoods[0].city
                
                this.neighborhoods = this.academy.neighborhoods.map(n => n._id)
                
                let academyCityObj = this.cities.find(c => c._id === this.city)
                if (academyCityObj != null)
                    this.allNeighborhoods = academyCityObj.neighborhoods
            }
        },
        error =>
        {            
            this.notifications.create(
              'error',
              'Error',
              'No se han podido obtener las ciudades y barrios. Recarga la página y reinténtalo.'
            )
            
            console.log(error)
        })
    }
    onCitySelectChange()
    {
        let academyCityObj = this.cities.find(c => c._id === this.city)
        if (academyCityObj != null)
            this.allNeighborhoods = academyCityObj.neighborhoods
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
                address: (this.address != null && this.address.length > 0) ?
                            this.address.trim() : null,
                isVerified: this.isVerified,
                location: (this.latitude != null && this.latitude.trim().length > 0 &&
                            this.longitude != null && this.longitude.trim().length > 0)
                            ?
                            { coordinates: [ parseFloat(this.latitude.trim()), parseFloat(this.longitude.trim()) ] }
                            : null,
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
                address: (this.address != null && this.address.length > 0) ?
                            this.address.trim() : null,
                isVerified: this.isVerified,
                location: (this.latitude != null && this.latitude.trim().length > 0 &&
                            this.longitude != null && this.longitude.trim().length > 0)
                            ?
                            { coordinates: [ parseFloat(this.latitude.trim()), parseFloat(this.longitude.trim()) ] }
                            : null,
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