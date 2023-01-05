import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ImageDto {
  id: number;
  chemin: string;

  public constructor() {}
}
