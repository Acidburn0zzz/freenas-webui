import { Component, OnInit, Input } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { RoutePartsService } from '../../../services/route-parts/route-parts.service';
import { CoreService, CoreEvent } from 'app/core/services/core.service';
import globalHelptext from '../../../helptext/global-helptext';

@Component({
  selector: 'pagetitle',
  templateUrl: './pagetitle.component.html',
  styleUrls: ['./pagetitle.component.css']
})
export class PageTitleComponent implements OnInit {
  @Input() breadcrumbs: boolean;
  @Input() product_type;
  public titleText: string;
  public copyrightYear = globalHelptext.copyright_year;

  routeParts:any[];
  public isEnabled: boolean = true;
  constructor(private router: Router,
  private routePartsService: RoutePartsService, 
  private activeRoute: ActivatedRoute,
  private core: CoreService) { 
  }

  ngOnInit() {
  // must be running once to get breadcrumbs
    this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
    this.titleText = this.routeParts && this.routeParts[0].title ? this.routeParts[0].title : '';

    // generate url from parts
    this.routeParts.reverse().map((item, i) => {
      // prepend / to first part
      if(i === 0) {
        item.url = `/${item.url}`;
        if (!item['toplevel']) {
          item.disabled = true;
        }
        return item;
      }
      // prepend previous part to current part
      item.url = `${this.routeParts[i - 1].url}/${item.url}`;
      return item;
    });

  // only execute when routechange
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe((routeChange) => {
      this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      this.titleText = this.routeParts && this.routeParts[0].title ? this.routeParts[0].title : '';

      // generate url from parts
      this.routeParts.reverse().map((item, i) => {
        // prepend / to first part
        if(i === 0) {
          item.url = `/${item.url}`;
          if (!item['toplevel']) {
            item.disabled = true;
          }
          return item;
        }
        // prepend previous part to current part
        item.url = `${this.routeParts[i - 1].url}/${item.url}`;
        return item;
      });
    });

  // Pseudo routing events (for reports page)
    this.core.register({observerClass:this, eventName:"PseudoRouteChange"}).subscribe((evt:CoreEvent) => {
      let routeChange = evt.data;
      //this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      this.routeParts = evt.data;
      // generate url from parts
      this.routeParts.map((item, i) => {
        // prepend / to first part
        if(i === 0) {
          item.url = `/${item.url}`;
          item.disabled = true;
          return item;
        }
        // prepend previous part to current part
        item.url = `${this.routeParts[i - 1].url}/${item.url}`;
        return item;
      });
    });
  }

}