import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';
import { CoursesService } from '../../services/courses.service';
import { BookingsService } from '../../services/bookings.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit
{  
    isLoading: boolean = true;
    courseNotFound: boolean = false;
    
    course: any;
    name: string;
    phone: string;
    email: string;
    group: string;
    termsAccepted: boolean = false;
    
    user: any;
    startDateFormatted: String;
    
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    constructor(private courseservice: CoursesService,
                private activatedRoute: ActivatedRoute,
                private userService: UserSessionService,
                private bookingsService: BookingsService,
                private notifications: NzNotificationService)
    {
        
    }

    ngOnInit()
    {
        this.activatedRoute.queryParams.subscribe(params =>
        {
            if (params.course)
            {
                this.courseservice.getCourse(params.course)
                .subscribe(res =>
                {
                    this.course = res.course;
                    this.startDateFormatted = moment(this.course.startDate).locale("es").format("dddd D MMMM");
                    
                    // Set the group from the route query param
                    if (params.group)
                    {
                        this.group = this.startDateFormatted + ' - ' + this.course.group[parseInt(params.group)];
                    }
                    
                    this.userService.isLoggedIn().subscribe(user =>
                    {
                        this.isLoading = false;
                        
                        this.user = user;
                        this.name = user.name;
                        this.email = user.email;
                    },
                    err =>
                    {
                        this.isLoading = false;
                    });
                },
                err =>
                {                    
                    this.isLoading = false;
                    
                    if (err.status === 400)
                        this.courseNotFound = true;
                });
            }
        });
    }
    
    onChangeTermsAccepted(checked)
    {
        this.termsAccepted = checked;
    }
    
    onPressBook()
    {
        if (this.validateFields())
            this.sendBooking();
    }
    validateFields()
    {
        let allOk = true;
        let message = 'Por favor, rellena todos los campos correctamente.';
        
        if (this.name == null || this.name.trim().length === 0 ||
            this.phone == null || this.phone.trim().length === 0 ||
            this.email == null || this.email.trim().length === 0 ||
            this.group == null || this.group.trim().length === 0 ||
            !this.termsAccepted)
        {
            allOk = false;
        }
        
        if (!this.emailRegex.test(this.email))
        {
            allOk = false;
            message = 'Introduce un email válido.';
        }
        
        if (!this.termsAccepted)
            message = 'Por favor, acepta la política de privacidad.';
        
        if (!allOk)
        {
            this.notifications.create(
              'error',
              'Error',
              message
            );
        }
        
        return allOk;
    }
    sendBooking()
    {
        let data: any =
        {
            name: this.name.trim(),
            phone: this.phone.trim(),
            email: this.email.trim(),
            group: this.group.trim(),
            course: this.course._id
        }
        
        if (this.user != null)
            data.user = this.user._id;
            
        this.bookingsService.createBooking(data)
        .subscribe(res =>
        {
            console.log(res);
        },
        err =>
        {
            console.log(err);
        });
    }
}
