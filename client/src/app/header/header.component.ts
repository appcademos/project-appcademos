import { Component, OnInit } from '@angular/core';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['../../sass/components/header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public request: RequestService) { }

  ngOnInit() {
  }

}
