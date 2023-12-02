import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {

  slides: any[] = new Array(5).fill({id: -1, src: '', title: '', subtitle: ''});

  constructor() { }

  ngOnInit(): void {
    this.slides[0] = {
      src: './assets/carousel/carousel5.jpg',
    };
    this.slides[1] = {
      src: './assets/carousel/carousel1.png',
    }
    this.slides[2] = {
      src: './assets/carousel/carousel6.jpg',
    }
    this.slides[3] = {
        src: './assets/carousel/carousel2.png',
      }
      this.slides[4] = {
        src: './assets/carousel/carousel3.jpg',
      }
  }
}