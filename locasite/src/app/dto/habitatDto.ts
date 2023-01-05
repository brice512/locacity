import { Injectable } from "@angular/core";
import { ImageDto } from "./imageDto";
@Injectable({
  providedIn: "root",
})
export class HabitatDto {
  id: number;
  nom: string;
  ville: string;
  superficie: number;
  nombrePiece: number;
  prix: number;
  type: string;
  description: string;
  etat: string;
  images: ImageDto[];

  public constructor() {}
}
