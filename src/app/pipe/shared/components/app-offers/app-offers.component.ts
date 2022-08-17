import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-app-offers',
  templateUrl: './app-offers.component.html',
  styleUrls: ['./app-offers.component.scss'],
})
export class AppOffersComponent implements OnInit {
  sliderOpts = {
    zoom: false,
    slidesPerView: 1.6,
    spaceBetween: 10
   };
 
  constructor(private modalcontroller: ModalController) {  }


  ngOnInit() {

  }

  imgsList = [
    {
      imgurl : "assets/images/s1.jpg",
      name: "Armenia",
      price: "25,00"
    },
    {
      imgurl : "assets/images/s4.jpg",
      name: "Bali",
      price: "26,00"
    },
    
    {
      imgurl : "assets/images/s5.jpg",
      name: "Mumbai",
      price: "26,00"
    },
    {
      imgurl : "assets/images/s6.jpg",
      name: "Delhi",
      price: "26,00"
    },
    
  ]

}
