import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  accessKey: string = 'eb588dbf70cb81df1c8d374269db9d18';

  constructor(private http: HttpClient) { }

  getCountryCodes() {
    const url = `https://apilayer.net/api/countries?access_key=${this.accessKey}`;
    return this.http.get<any>(url);
  }

  validateMobileNumber(mobile: string, countryCode: string){
    const url = `https://apilayer.net/api/validate?access_key=${this.accessKey}&number=${mobile}&country_code=${countryCode}&format=1`
    return this.http.get<any>(url);
  }
}
