import { Directive, OnInit, ElementRef } from '@angular/core';
declare var Cesium: any;

@Directive({
  selector: '[appCesium]'
})
export class CesiumDirective implements OnInit {

  constructor(private el: ElementRef) { }

  async ngOnInit() {
    //const viewer = new Cesium.Viewer(this.el.nativeElement);
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
        semiMinorAxis : new Cesium.CallbackProperty(pizzaHeight, false),//2000.0,
        semiMajorAxis : new Cesium.CallbackProperty(pizzaWidth, false),
        material : 'assets/dinnerpizza2.png'
      }
    });
    
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(-81.655647, 30.332184, 20000),
      duration: 0
    })
    // setTimeout(() =>
    //   viewer.camera.flyTo({
    //     destination: Cesium.Rectangle.fromDegrees(60.5284298033, 29.318572496, 75.1580277851, 38.4862816432),
    //     maximumHeight: 10000000,
    //     duration: 10
    //   }), 10000);
    
    let height = 2000;
    let width = 4000;
    
    function pizzaHeight() {
      height *= 1.03;
      return height;
    }
    
    function pizzaWidth() {
      width *= 1.03;
      return width;
    }
    console.log(pizza)
  }

}