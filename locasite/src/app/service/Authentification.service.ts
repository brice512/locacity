import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AuthRequestDto } from "../dto/authRequestDto";
import { AuthResponseDto } from "../dto/authResponseDto";

@Injectable({
  providedIn: "root",
})
export class AuthentificationService {
  public constructor(private http: HttpClient) {}

  public login(authRequest: AuthRequestDto): Observable<AuthResponseDto> {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, authRequest);
  }
}
