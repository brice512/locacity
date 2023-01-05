import { Injectable } from "@angular/core";
import { AnnonceDto } from "./annonceDto";
import { UtilisateurDto } from "./utilisateurDto";
@Injectable({
  providedIn: "root",
})
export class ReservationDto {
  id: number;
  etat: string;
  annonce: AnnonceDto;
  postulant: UtilisateurDto;

  public constructor() {}
}
