import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.prod";
import { ReservationDto } from "../dto/reservationDto";

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  public constructor(private http: HttpClient) {}

  public creerReservation(
    reservation: ReservationDto,
    action: String
  ): Observable<String> {
    if (action === "creer") {
      return this.http.post<any>(
        `${environment.apiUrl}/reservation`,
        reservation
      );
    } else {
      return this.http.put<any>(
        `${environment.apiUrl}/reservation`,
        reservation
      );
    }
  }

  accepterOuRejeterReservation(formData: FormData): Observable<String> {
    return this.http.post<any>(
      `${environment.apiUrl}/reservation/acceptOrReject`,
      formData
    );
  }

  getReservation(id: number): Promise<ReservationDto> {
    return this.http
      .get<any>(`${environment.apiUrl}/reservation/${id}`)
      .toPromise();
  }

  get(): Promise<ReservationDto[]> {
    return this.http
      .get<ReservationDto[]>(`${environment.apiUrl}/reservation`)
      .toPromise();
  }
  getMesReservation(id: number): Promise<ReservationDto[]> {
    return this.http
      .get<ReservationDto[]>(
        `${environment.apiUrl}/reservation/utilisateur/${id}`
      )
      .toPromise();
  }
}
