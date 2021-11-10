import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DataService {

  private startDate = '2010-05-22';
  private daysPerSecond = 50;

  private loaded = this.loadBtcData();
  private btcData: [string, number][] = [];
  private paused = true;
  private startTime = 0;
  private startIndex = 0;
  
  public currentDate: string = this.formatDate(this.startDate);
  private btcValue: number = 41/10000;
  public pizzaValue: number = 41;

  constructor() {
    this.reset();
  }
  
  async start() {
    await this.loaded;
    this.paused = false;
    this.startTime = new Date().getTime();
  }
  
  pause() {
    this.paused = true;
    this.startIndex = this.currentIndex();
  }
  
  reset() {
    this.setDate(this.startDate);
  }
  
  async setDate(dateString: string) {
    console.log(dateString);
    await this.loaded;
    this.startIndex = this.btcData.findIndex(d => d[0] == dateString);
    this.update();
  }
  
  currentBtcValue() {
    if (!this.paused) this.update();
    console.log(this.paused, this.btcValue)
    return this.btcValue;
  }
  
  private update() {
    const index = this.currentIndex();
    this.currentDate = this.formatDate(this.btcData[index][0]);
    this.btcValue = this.btcData[index][1];
    this.pizzaValue = _.round(10000*this.btcValue);
    console.log(this.btcValue)
  }
  
  private currentIndex() {
    let indexDiff;
    if (this.startTime == 0) {
      indexDiff = 0;
    } else {
      const timeDiff = (new Date().getTime() - this.startTime) / 1000;
      indexDiff = _.round(this.daysPerSecond*timeDiff);
    }
    return Math.min(this.startIndex + indexDiff, this.btcData.length-1);
  }
  
  private formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US")/*,
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });*/
  }
  
  private async loadBtcData() {
    const API_KEY = 'DDy7uCcyEjyzzqisk9A5';
    const API_URL = 'https://www.quandl.com/api/v3/datasets/BCHAIN/MKPRU.json?api_key='+API_KEY;
    this.btcData = (await (await fetch(API_URL)).json()).dataset.data;
    this.btcData = _.reverse(this.btcData);
    const lazloDayIndex = this.btcData.findIndex(d => d[0] == '2010-05-22');
    const lastZero = _.findLastIndex(this.btcData, d => d[1] == 0);
    const firstValue = this.btcData[lastZero+1][1];
    const increment = (firstValue-(41/10000)) / (lastZero+1-lazloDayIndex);
    for (let i of _.range(lazloDayIndex, lastZero+1)) {
      this.btcData[i][1] = (41/10000)+((i-lazloDayIndex)*increment);
    }
  }

}