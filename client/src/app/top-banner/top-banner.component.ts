import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-top-banner',
  templateUrl: './top-banner.component.html',
  styleUrls: ['./top-banner.component.scss']
})
export class TopBannerComponent implements OnInit
{
    visible = true;
    countdownMoment = moment('2019-11-01T00:00:00.000');
    countdownText = '';
    
    constructor() { }

    ngOnInit()
    {
        if (this.countdownMoment != null &&
            this.countdownMoment.isAfter(moment()))
        {
            setInterval(() => { this.setCountdownText() }, 1000);
        }
    }
    
    setCountdownText()
    {
        let now = moment();
        let secondsDiff = this.countdownMoment.diff(now, 'seconds');
        let daysRemaining = Math.floor(secondsDiff/3600/24);
        let hoursRemaining = Math.floor(secondsDiff/3600) - daysRemaining*24;
        let minutesRemaining = Math.floor(secondsDiff/60) - daysRemaining*24*60 - hoursRemaining*60;
        let secondsRemaining = secondsDiff - daysRemaining*24*60*60 - hoursRemaining*60*60 - minutesRemaining*60;
        
        this.countdownText = `${daysRemaining} día${daysRemaining == 1 ? '' : 's'} ${hoursRemaining} hora${hoursRemaining == 1 ? '' : 's'} ${minutesRemaining} minuto${minutesRemaining == 1 ? '' : 's'} ${secondsRemaining} segundo${secondsRemaining == 1 ? '' : 's'}`;
    }
}
