import * as _ from 'lodash';
import { Directive, OnInit, ElementRef } from '@angular/core';
declare var Cesium: any;

const UPDATE_RATE = 30;

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {
  
  private btc: [string, number][] = [];
  private startTime = 0;

  constructor(private el: ElementRef) {}

  async ngOnInit() {
    this.btc = await this.getBtcData();
    
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNTUzMzg1MS05YzYyLTRiZDAtYmJkMS1iOWFmNTU5YjllZTUiLCJpZCI6NTc0NTcsImlhdCI6MTYyMjM2ODIzNX0.oOvyENDh9CrhPGF0596pdXwlAMSA8n5F5JUlO0mYc54";
    
    const viewer = new Cesium.Viewer(this.el.nativeElement, {
      geocoder:false, //Search in the upper right corner
      homeButton:false, //Upper right corner Home
      sceneModePicker:false, //upper right corner 2D/3D switch
      baseLayerPicker:false, //top right corner terrain
      navigationHelpButton:false, //Upper right corner Help
      animation:false, // Disc animation control in the lower left corner
      timeline:false, //timeline
      fullscreenButton:false, //Bottom right corner full screen control
      vrButton:false, // If set to true, a VRButton widget will be created.
      scene3DOnly: true, // Each geometry instance is only rendered in 3D to save GPU memory
      infoBox: false, //Hide the prompt message after clicking the element
    });
    viewer._cesiumWidget._creditContainer.style.display="none"; //Hide version information
    const countries = await Cesium.GeoJsonDataSource.load("assets/countries.geojson");
    console.log(countries.entities.values)
    viewer.dataSources.add(countries);
    const pizza = viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-81.655647, 30.332184),
      ellipse : {
        semiMinorAxis : new Cesium.CallbackProperty(this.pizzaHeight.bind(this), false),//2000.0,
        semiMajorAxis : new Cesium.CallbackProperty(this.pizzaWidth.bind(this), false),
        height: 0,
        extrudedHeight: new Cesium.CallbackProperty(this.pizzaThickness.bind(this), false),
        material : new Cesium.ImageMaterialProperty({
          image : 'assets/dinnerpizza2.png',
          transparent: true
        })
      }
    });
    
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-81.655647, 30.332184, 20000),
      orientation: {
        heading: 0,
        pitch: 100,
        roll: 0
      },
      duration: 0
    })
    // setTimeout(() =>
    //   viewer.camera.flyTo({
    //     destination: Cesium.Rectangle.fromDegrees(60.5284298033, 29.318572496, 75.1580277851, 38.4862816432),
    //     maximumHeight: 10000000,
    //     duration: 10
    //   }), 10000);
  }
  
  private pizzaHeight() {
    return 0.41 * this.pizzaSizeRatio();
  }
  
  private pizzaWidth() {
    return 0.82 * this.pizzaSizeRatio();
  }
  
  private pizzaThickness() {
    return 0 * this.pizzaSizeRatio();
  }
  
  private pizzaSizeRatio() {
    const price = this.currentBtcValue();
    const pizzaValue = 10000*price;
    //const sizeRatio = pizzaValue/41*1.5/this.bgRefSize;//2*75cm pizza
    //const pizzaSize = 0.41*pizzaValue;
    return price / (41/10000)
  }
  
  private currentBtcValue() {
    if (!this.startTime) this.startTime = new Date().getTime();
    const currentDiff = new Date().getTime() - this.startTime;
    const index = Math.round(currentDiff/10);
    return index < this.btc.length ? this.btc[index][1]
      : this.btc[this.btc.length-1][1];
  }
  
  private async getBtcData() {
    const API_KEY = 'DDy7uCcyEjyzzqisk9A5';
    const API_URL = 'https://www.quandl.com/api/v3/datasets/BCHAIN/MKPRU.json?api_key='+API_KEY;
    const data = (await (await fetch(API_URL)).json()).dataset.data;
    //add linear beginning
    for (let i of _.range(4035, 3941)) {
      data[i][1] = (41/10000)+((4035-i)/(4034-3941)*(0.0688-(41/10000)))
    }
    return _.reverse(data);
  }

}