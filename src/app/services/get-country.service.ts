import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class GetCountryService {
  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    this.getAllCountry(); 
  }
  allCountryList:any;
  getAllCountry() {
    this.http
      .get(environment.baseUrl + "/pwa/v1/country/getAllCountry")
      .subscribe(res => {
        this.allCountryList = res["countryList"];
      });
      return this.allCountryList
  }
}
