import { Directive, OnInit, ElementRef } from '@angular/core';
import { DataService } from './data.service';
declare var Cesium: any;

const UPDATE_RATE = 30;

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  private viewer: any;//Cesium.Viewer;

  constructor(private el: ElementRef, private data: DataService) {console.log('CONST')}

  async ngOnInit() {
    
    Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzNTUzMzg1MS05YzYyLTRiZDAtYmJkMS1iOWFmNTU5YjllZTUiLCJpZCI6NTc0NTcsImlhdCI6MTYyMjM2ODIzNX0.oOvyENDh9CrhPGF0596pdXwlAMSA8n5F5JUlO0mYc54";
    
    this.viewer = new Cesium.Viewer(this.el.nativeElement, {
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
    this.viewer._cesiumWidget._creditContainer.style.display="none"; //Hide version information
    const countries = await Cesium.GeoJsonDataSource.load("assets/countries.geojson");
    console.log(countries.entities.values)
    this.viewer.dataSources.add(countries);
    const pizza = this.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(-81.655647, 30.342184),
      ellipse : {
        semiMinorAxis : new Cesium.CallbackProperty(this.pizzaRadius.bind(this), false),//2000.0,
        semiMajorAxis : new Cesium.CallbackProperty(this.pizzaRadius.bind(this), false),
        height: 0,
        extrudedHeight: 0,//new Cesium.CallbackProperty(this.pizzaThickness.bind(this), false),
        material : new Cesium.ImageMaterialProperty({
          image : 'assets/pizza.png',
          transparent: true
        })
      }
    });
  }
  
  flyTo(coords: [number, number, number, number], duration: number) {
    this.viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints([
        Cesium.Cartesian3.fromDegrees(coords[0], coords[1]),
        Cesium.Cartesian3.fromDegrees(coords[2], coords[3])]), {
      duration: duration
    });
  }
  
  private pizzaRadius() {
    return this.doublePizzaRadius() / 2;
  }
  
  private doublePizzaRadius() {
    return 0.4064 * this.pizzaSizeRatio();
  }
  
  private pizzaThickness() {
    return 0.01 * this.pizzaSizeRatio();
  }
  
  private pizzaSizeRatio() {
    const price = this.data.currentBtcValue();
    const pizzaValue = 10000*price;
    //const sizeRatio = pizzaValue/41*1.5/this.bgRefSize;//2*75cm pizza
    //const pizzaSize = 0.41*pizzaValue;
    return pizzaValue / 41;
  }

}