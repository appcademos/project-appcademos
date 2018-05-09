import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-academy',
  templateUrl: './academy.component.html',
  styleUrls: ['../../sass/components/academy.component.scss']
})
export class AcademyComponent implements OnInit {

  constructor(public request: RequestService) { }

  ngOnInit() {
  }

}
