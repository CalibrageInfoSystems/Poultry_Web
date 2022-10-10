import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig } from '../config/app.config';
const apiKey: string = AppConfig.weatherApiKey.apiKey;
const units :string ='metric' 
const countryCode :string ='in'

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) { }

  getCurrentWeather(pincode: string) {
    return this.http.get(`${AppConfig.weatherApiUrl.apiUrl}/weather?zip=${pincode},${countryCode}&appid=${apiKey}&units=${units}`)
  }
 
}