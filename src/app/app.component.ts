import { Component, ViewChild, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from './data.service';
import { CesiumDirective } from './cesium.directive';

@Component({
  selector: 'app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild(CesiumDirective) cesium!: CesiumDirective;
  story = '';
  opacity = 1;
  
  constructor(private route: ActivatedRoute, public data: DataService) {}
  
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log(params)
    });
    this.startStory();
  }
  
  private async startStory() {
    await this.timeout(1);
    //jville hood: -81.658647, 30.320184, -81.653647, 30.324184
    //this.cesium.flyTo([-81.658647, 30.330184, -81.653647, 30.334184], 0);
    this.cesium.flyTo([-81.656647, 30.341184, -81.654647, 30.343184], 0);
    await this.displayText(`On May 22, 2010, Programmer Lazlo Hanyecz bought two Papa John's Pizzas in
      Jacksonsville, FL for 10,000 BTC which was worth around $41.`, 5);
    await this.displayText(`This NFT shows how large a pizza Lazlo could have bought with
      10,000 BTC at any later point in time.`, 5);
    this.data.start();
    await this.timeout(2);
    //jville: -81.655647, 30.322184, -81.615647, 30.342184
    this.cesium.flyTo([-81.655647, 30.322184, -81.615647, 30.342184], 6);
    await this.timeout(6);
    // this.data.pause();
    // await this.displayText(`A year later the pizzas would have been larger than Lazlo's neighborhood.`, 5);
    // this.data.start();
    // //jville county: -82.01, 30.1, -81.33, 30.5
    // this.cesium.flyTo([-82.01, 30.1, -81.33, 30.5], 10);
    // await this.timeout(14);
    // this.data.pause();
    // await this.displayText(`Three years later the pizzas would have been larger than Lazlo's city.`, 5);
    // this.data.start();
    // //florida: -87.6347, 24.514909, -80.032576, 31.000809
    // this.cesium.flyTo([-87.6347, 24.514909, -80.032576, 31.000809], 9);
    // await this.timeout(32);
    // this.data.pause();
    // await this.displayText(`Seven years later the pizzas would have been larger than the state of Florida.`, 5);
    // this.data.start();
    // //us: -171.791110603, 18.91619, -66.96466, 71.3577635769 (including hawaii/alaska)
    // this.cesium.flyTo([-124.799782, 47.896994, -79.272440, 25.595688], 8);
    // await this.timeout(22.5);
    // this.data.pause();
    // await this.displayText(`In late 2020 the pizzas would have reached a size larger than the United States.`, 5);
    // this.data.start();
    // //world
    // this.cesium.flyTo([-124.799782, 80, -79.272440, -20], 5);
  }
  
  private async displayText(text: string, duration: number) {
    this.opacity = 0.3;
    this.story = text;
    await this.timeout(duration);
    this.story = '';
    this.opacity = 1;
  }
  
  private async timeout(duration: number) {
    return new Promise(resolve => setTimeout(resolve, duration*1000));
  }
}
