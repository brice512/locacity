import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment.prod";
import { UtilisateurDto } from "../dto/utilisateurDto";

@Injectable({
  providedIn: "root",
})
export class UtilisateurService {
  public constructor(private http: HttpClient) {}

  public creerUtilisateur(
    formData: FormData,
    action: String
  ): Observable<String> {
    if (action === "creer") {
      return this.http.post<any>(
        `${environment.apiUrl}/utilisateur/add`,
        formData
      );
    } else {
      return this.http.put<any>(
        `${environment.apiUrl}/utilisateur/add`,
        formData
      );
    }
  }

  getUser(id: number): Promise<UtilisateurDto> {
    return this.http
      .get<UtilisateurDto>(`${environment.apiUrl}/utilisateur/${id}`)
      .toPromise();
  }

  // @ts-ignore
  get(): Promise<UtilisateurDto[]> {
    return this.http
      .get<UtilisateurDto[]>(`${environment.apiUrl}/utilisateur`)
      .toPromise();
  }

  getAvatar(id: number): Promise<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/utilisateur/avatar/${id}`)
      .toPromise();
  }
}
