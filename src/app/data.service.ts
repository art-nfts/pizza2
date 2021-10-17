import { Injectable } from '@angular/core';
import * as _ from 'lodash';

@Injectable()
export class DataService {

  private loaded = false;
  private btc: [string, number][] = [];
  private startDate = '2010-05-22';
  private startTime = 0;
  private speed = 1;
  public currentDate: string = this.formatDate('2010-05-22');
  private btcValue: number = 41/10000;
  public pizzaValue: number = 41;

  constructor() {
    this.init();
  }
  
  private async init() {
    this.btc = await this.getBtcData();
    this.loaded = true;
  }
  
  currentBtcValue() {
    //if (!this.loaded) return this.btcValue;
    if (!this.startTime) this.startTime = new Date().getTime() + 10000;
    const currentDiff = new Date().getTime() - this.startTime;
    if (currentDiff > 0) {
      const index = Math.min(_.round(currentDiff/(20/this.speed)), this.btc.length-1);
      this.currentDate = this.formatDate(this.btc[index][0]);
      this.btcValue = this.btc[index][1];
      this.pizzaValue = _.round(10000*this.btcValue);
    }
    return this.btcValue;
  }
  
  private formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-US")/*,
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });*/
  }
  
  private async getBtcData() {
    const API_KEY = 'DDy7uCcyEjyzzqisk9A5';
    const API_URL = 'https://www.quandl.com/api/v3/datasets/BCHAIN/MKPRU.json?api_key='+API_KEY;
    let data: [string, number][]
      = (await (await fetch(API_URL)).json()).dataset.data;
    data = _.reverse(data);
    const startIndex = data.findIndex(d => d[0] == this.startDate);
    data = data.slice(startIndex);
    const firstNonZero = data.findIndex(d => d[1] != 0);
    for (let i of _.range(0, firstNonZero)) {
      data[i][1] = (41/10000)+(i/firstNonZero*(data[firstNonZero][1]-(41/10000)));
    }
    return data;
  }

}