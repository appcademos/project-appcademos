import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../services/userSession.service';
import { CoursesService } from '../../services/courses.service';
import { BookingsService } from '../../services/bookings.service';
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { MessageService } from '../../services/message.service';
import { Subscription } from 'rxjs';

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
    
    sendingBooking: boolean = false;
    courseBooked: boolean = false;
    sendingSignup: boolean = false;
    signupCompleted: boolean = false;
    
    user: any;
    startDateFormatted: String;
    
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    loginSubscription: Subscription;
    showRegistrationModal: boolean = false;
    
    password: String;
    repeatPassword: String;

    constructor(private courseservice: CoursesService,
                private activatedRoute: ActivatedRoute,
                private userService: UserSessionService,
                private bookingsService: BookingsService,
                private notifications: NzNotificationService,
                private modalService: NzModalService,
                private messageService: MessageService)
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
        
        this.listenToLoginEvents();
    }
    ngOnDestroy()
    {
        if (this.loginSubscription != null)
            this.loginSubscription.unsubscribe();
    }
    
    listenToLoginEvents()
    {
        this.loginSubscription = this.messageService.getMessage()
        .subscribe((message) =>
        {
            if (typeof message.user != 'undefined')
            {
                this.user = (message.user == null) ? null : {...message.user}
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
        {
            if (this.user != null)
            {
                this.sendBooking();
            }
            else
            {
                this.showRegistrationModal = true;
            }
        }
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
        
        this.sendingBooking = true;
        
        this.bookingsService.createBooking(data)
        .subscribe(res =>
        {
            this.sendingBooking = false;
            this.courseBooked = true;
            
            this.modalService.success(
            {
                nzTitle: 'Reserva confirmada',
                nzContent: (this.signupCompleted) ? 'Tu cuenta ha sido creada correctamente.\nTu reserva ha sido creada correctamente.' : 'Tu reserva ha sido creada correctamente.'
            });
        },
        err =>
        {
            this.sendingBooking = false;
            
            this.modalService.error(
            {
                nzTitle: 'Error',
                nzContent: 'Tu reserva no ha podido ser creada. Inténtalo de nuevo o contacta con nosotros.'
            });
            
            console.log(err);
        });
    }
    
    onRegistrationModalOk()
    {
        if (this.validateRegistrationModal())
        {
            this.sendSignup()
            .then(() =>
            {
                setTimeout(() => { this.sendBooking(); }, 200);
            })
            .catch(() => {});
        }
    }
    onRegistrationModalCancel()
    {
        this.showRegistrationModal = false;
        this.sendBooking();
    }
    
    validateRegistrationModal()
    {
        let allOk = true;
        let message = 'Por favor, rellena todos los campos correctamente.';
        
        if (this.password == null || this.password.length === 0)
            allOk = false;
        if (this.repeatPassword == null || this.repeatPassword.length === 0)
            allOk = false;
        
        if (allOk && this.password != this.repeatPassword)
        {
            message = 'Las contraseñas no coinciden.';
            allOk = false;
        }
        
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
    sendSignup()
    {
        this.sendingSignup = true;

        let data =
        {
            name: this.name.trim(),
            email: this.email.trim(),
            password: this.password
        }

        return new Promise((resolve, reject) =>
        {
            this.userService.signup(data).subscribe(() =>
            {
                this.sendingSignup = false;
                this.showRegistrationModal = false;
                this.signupCompleted = true;
                resolve();
            },
            error =>
            {
                this.sendingSignup = false;
                this.notifications.create(
                  'error',
                  'Error',
                  'No se ha podido crear tu cuenta. Inténtalo de nuevo o ponte en contacto con nosotros.'
                );
                
                console.log(error);
                reject();
            });
        });
    }
}
