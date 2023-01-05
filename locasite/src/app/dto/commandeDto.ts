import { Injectable } from "@angular/core";
import { UtilisateurDto } from "./utilisateurDto";
@Injectable({
  providedIn: "root",
})
export class CommandeDto {
  id: number;
  nombrePiece: number;
  prixMin: number;
  prixMax: number;
  date: Date;
  description: string;
  ville: string;
  etat: string;
  client: UtilisateurDto;

  public constructor() {}
}
