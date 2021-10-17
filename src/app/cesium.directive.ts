import { Directive, OnInit, ElementRef } from '@angular/core';
import { DataService } from './data.service';
declare var Cesium: any;

const UPDATE_RATE = 30;

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(private el: ElementRef, private data: DataService) {}

  async ngOnInit() {
    
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
      //jacksonsville: -81.655647, 30.332184
      destination: Cesium.Rectangle.fromDegrees(-81.658647, 30.320184, -81.653647, 30.324184),
      //destination: Cesium.Rectangle.fromDegrees(-81.675647, 30.252184, -81.635647, 30.212184),
      //destination: Cesium.Rectangle.fromDegrees(-81.855647, 30.132184, -81.455647, 30.532184),//Cesium.Cartesian3.fromDegrees(-81.655647, 30.332184, 20000),
      orientation: {
        heading: 0,
        pitch: 100,
        roll: 0
      },
      duration: 0
    });
    // setTimeout(() =>
    //   viewer.camera.flyTo({
    //     destination: Cesium.Rectangle.fromDegrees(60.5284298033, 29.318572496, 75.1580277851, 38.4862816432),
    //     maximumHeight: 10000000,
    //     duration: 10
    //   }), 10000);
    setTimeout(() =>
    viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints([
        Cesium.Cartesian3.fromDegrees(-81.675647, 30.312184), Cesium.Cartesian3.fromDegrees(-81.635647, 30.352184)]), {
      duration: 10
    }), 15000);
    
    //florida: -87.6347, 24.514909, -80.032576, 31.000809
    //us: -171.791110603, 18.91619, -66.96466, 71.3577635769
    setTimeout(() =>
    viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints([
        Cesium.Cartesian3.fromDegrees(-87.6347, 24.514909), Cesium.Cartesian3.fromDegrees(-80.032576, 31.000809)]), {
      duration: 10
    }), 30000);
    
    setTimeout(() =>
    viewer.camera.flyToBoundingSphere(Cesium.BoundingSphere.fromPoints([
        Cesium.Cartesian3.fromDegrees(-124.799782, 47.896994), Cesium.Cartesian3.fromDegrees(-79.272440, 25.595688)]), {
      duration: 10
    }), 45000);
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
    const price = this.data.currentBtcValue();
    const pizzaValue = 10000*price;
    //const sizeRatio = pizzaValue/41*1.5/this.bgRefSize;//2*75cm pizza
    //const pizzaSize = 0.41*pizzaValue;
    return price / (41/10000)
  }

}