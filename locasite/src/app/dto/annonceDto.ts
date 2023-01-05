import { Injectable } from "@angular/core";
import { HabitatDto } from "./habitatDto";
@Injectable({
  providedIn: "root",
})
export class AnnonceDto {
  id: number;
  dateDebut: Date;
  dateFin: Date;
  habitat: HabitatDto;

  public constructor() {}
}
