import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment.prod';

export interface APIResponse {
  status: boolean;
  message: string;
  data?: any;
}

@Injectable({
  providedIn: 'root',
})
export class MainserviceService {
  constructor(private http: HttpClient) {}

  private apiUrl = environment.apiUrl;

  //Login Dashboard
  isLoggedIn(): boolean {
    return sessionStorage.getItem('IslogedIn') === 'True';
  }

  // Logout the Dashboard
  logout(): void {
    sessionStorage.removeItem('IslogedIn');
  }

  getTruckTransaction(
    searchDate: string,
    inputVal?: string
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/VGCB/GC_ReportTruckTransaction`, {
      params: {
        searchDate,
        inputVal: inputVal || ''
      },
    });
  }
}
