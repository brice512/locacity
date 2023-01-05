import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.prod";
import { AnnonceDto } from "../dto/annonceDto";

@Injectable({
  providedIn: "root",
})
export class AnnonceService {
  public constructor(private http: HttpClient) {}

  public creerAnnonce(formData: FormData, action: String): Observable<String> {
    if (action === "creer") {
      return this.http.post<any>(`${environment.apiUrl}/annonce`, formData);
    } else {
      return this.http.put<any>(`${environment.apiUrl}/annonce`, formData);
    }
  }

  masquerAnnonce(annonce: AnnonceDto): Promise<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/annonce/masquer`, annonce)
      .toPromise();
  }

  getAnnonce(id: number): Promise<AnnonceDto> {
    return this.http
      .get<any>(`${environment.apiUrl}/annonce/${id}`)
      .toPromise();
  }

  get(): Promise<AnnonceDto[]> {
    return this.http
      .get<AnnonceDto[]>(`${environment.apiUrl}/annonce`)
      .toPromise();
  }

  getVilles(): Promise<string[]> {
    return this.http
      .get<string[]>(`${environment.apiUrl}/annonce/villes`)
      .toPromise();
  }

  getTypes(): Observable<string[]> {
    return this.http.get<string[]>(`${environment.apiUrl}/annonce/types`);
  }

  getImages(id: number): Promise<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/annonce/images/${id}`)
      .toPromise();
  }
}
