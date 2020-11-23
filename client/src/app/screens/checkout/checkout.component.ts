import { Component, OnInit } from '@angular/core';
import { UserSessionService } from '../../../services/userSession.service';
import { CoursesService } from '../../../services/courses.service';
import { BookingsService } from '../../../services/bookings.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { NzNotificationService, NzModalService } from 'ng-zorro-antd';
import { MessageService } from '../../../services/message.service';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';
import { MetaService } from '@ngx-meta/core';

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
    
    user: any;
    startDateFormatted: String;
    
    emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    loginSubscription: Subscription;
    showRegistrationModal: boolean = false;
    bookingSuccessModalRef = null;
    booking = null;
    
    password: String;
    repeatPassword: String;
    
    isVerifiedCourse: boolean = false;
    
    bookingConfirmedPage: boolean = false;
    lottieConfig =
    {
        path: '../../../assets/public/lottie/checkmark.json',
        autoplay: false,
        loop: false
    }
    checkAnimation: any

    constructor(private courseservice: CoursesService,
                private activatedRoute: ActivatedRoute,
                private userService: UserSessionService,
                private bookingsService: BookingsService,
                private notifications: NzNotificationService,
                private modalService: NzModalService,
                private messageService: MessageService,
                private location: Location,
                private meta: MetaService,
                private router: Router)
    {
        
    }

    ngOnInit()
    {
        this.bookingConfirmedPage = (this.router.url.indexOf('reserva-confirmada') > -1);
        
        this.activatedRoute.params.subscribe(params =>
        {
            if (params.id)
            {
                this.courseservice.getCourse(params.id)
                .subscribe(res =>
                {
                    this.course = res.course;
                    
                    this.setMetaData();
                    
                    this.startDateFormatted = moment(this.course.startDate).locale("es").format("dddd D MMMM");
                    this.isVerifiedCourse = false;
                    
                    if (!this.isVerifiedCourse)
                        this.setHubspotForm();
                    
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
            
            if (params.bookingId)
            {
                this.booking = { _id: params.bookingId }
                
                setTimeout(() =>
                {
                    this.showRegistrationModal = true;
                }, 4000);
            }
        });
        
        this.listenToLoginEvents();
    }
    ngOnDestroy()
    {
        if (this.loginSubscription != null)
            this.loginSubscription.unsubscribe();
    }
    
    setMetaData()
    {
        if (this.course != null)
        {
            let courseTitleNoDuration = this.course.title.split(' - ')[0];
            this.meta.setTitle(`Reserva tu plaza online en ${courseTitleNoDuration}.`);
            this.meta.setTag('description', `Reserva tu plaza online en ${courseTitleNoDuration}. Clase de prueba gratis para probar el curso. Tu plaza se reserva al instante y se notifica a la academia.`);
        }
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
            this.sendBooking();
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
            this.booking = res;
            
            this.sendingBooking = false;
            this.courseBooked = true;
            
            /*this.bookingSuccessModalRef = this.modalService.success(
            {
                nzTitle: 'Reserva confirmada',
                nzContent: 'Tu plaza ha sido reservada.',
                nzWrapClassName: 'vertical-center-modal',
                nzOnOk: () =>
                {
                    this.bookingSuccessModalRef.close();
                    this.showRegistrationModal = true;
                }
            });*/
                        
            window.location.href = `${window.location.origin}/reserva-confirmada/${this.course._id}/${this.booking._id}`;
        },
        err =>
        {
            this.sendingBooking = false;
            
            this.modalService.error(
            {
                nzTitle: 'Error',
                nzContent: 'Tu plaza no se ha podido reservar. Inténtalo de nuevo o contacta con nosotros.'
            });
            
            console.log(err);
        });
    }
    
    onRegistrationModalOk()
    {
        if (this.validateRegistrationModal())
        {
            this.sendSignup();
        }
    }
    onRegistrationModalCancel()
    {
        this.showRegistrationModal = false;
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
            lastName: '',
            email: this.email.trim(),
            password: this.password
        }

        this.userService.signup(data)
        .subscribe(() =>
        {
            this.updateBookingWithUserId();
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
        });
    }
    updateBookingWithUserId()
    {
        this.sendingSignup = true;

        let data =
        {
            user: this.user._id
        }

        this.bookingsService.updateBooking(this.booking._id, data)
        .subscribe((res) =>
        {            
            this.sendingSignup = false;
            this.showRegistrationModal = false;
            
            this.modalService.success(
            {
                nzTitle: 'Reserva vinculada',
                nzContent: 'Tu reserva ha sido vinculada a tu cuenta.',
                nzWrapClassName: 'vertical-center-modal'
            });
        },
        error =>
        {
            this.sendingSignup = false;
            this.notifications.create(
              'error',
              'Error',
              'No se ha podido vincular tula reserva a tu cuenta. Por favor, ponte en contacto con nosotros para vincularla.'
            );
            
            console.log(error);
        });
    }
    
    setHubspotForm()
    {
        if ((window as any).hbspt != undefined)
        {
            (window as any).hbspt.forms.create(
            {
                portalId: "4604246",
                formId: "2f790db1-6758-4611-9631-1cc6a5abfea4",
                target: "#requestInfoForm",
                onFormReady: function()
                {
                    if (document.querySelector('#estudioPersonalizado iframe'))
                        document.querySelector('#estudioPersonalizado iframe').setAttribute('data-hj-allow-iframe', '');
                },
                onFormSubmitted: () =>
                {
                    this.location.go(window.location.pathname + '/formulario-completado');
                } 
            });
        }
    }
    
    playCheckAnimation(anim: any)
    {
        setTimeout(() =>
        {
            this.checkAnimation = anim
            this.checkAnimation.play()
        }, 1000)
    }
}
