import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class AuthRequestDto {
  email: string;
  password: string;

  public constructor() {}
}
