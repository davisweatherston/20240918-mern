import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';


@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {

  constructor(private route: Router) {
    this.route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      // console.log(event);
      switch(event.url) {
        case '/teams' : this.highlight = 'Teams'; break
        case '/players' : this.highlight = 'Players'; break
        case '/schedule' : this.highlight = 'Schedule'; break
      }
    })
  }

  highlight: string = 'Teams';

  setHighlight(value: string) {
    this.highlight = value;
  }
}
