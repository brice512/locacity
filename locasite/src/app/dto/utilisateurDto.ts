import { Injectable } from "@angular/core";
import Chart from "chart.js";

@Injectable({
  providedIn: "root",
})
export class UtilisateurDto {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  gender: string;
  tel: number;
  ville: string;
  role: string;
  dateNaissance: Date;
  avatar: string;

  public constructor() {}
}
