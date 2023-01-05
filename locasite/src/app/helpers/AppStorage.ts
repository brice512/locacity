import { Component, Injectable } from "@angular/core";
import { Token } from "./Token";

@Component({
  selector: "app-dto",
  template: ``,
  styleUrls: [],
})
@Injectable({
  providedIn: "root",
})
export class AppStorage {
  private token = new Token();
  constructor() {}

  public storeToken(token: string) {
    this.clear();
    localStorage.setItem("token", token);
  }
  public clear() {
    localStorage.removeItem("token");
  }

  public getToken(): string {
    const tok = localStorage.getItem("token");
    if (tok) {
      return tok;
    } else {
      return "";
    }
  }
}
