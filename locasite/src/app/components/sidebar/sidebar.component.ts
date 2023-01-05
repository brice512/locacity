import { Component, Inject, Injectable, OnInit } from "@angular/core";
import { Route } from "@angular/router";
import { Token } from "../../helpers/Token";
import { AppStorage } from "../../helpers/AppStorage";

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  visible: boolean;
}
export const ROUTES: RouteInfo[] = [
  {
    path: "/dashboard",
    title: "Accueil",
    icon: "design_app",
    class: "",
    visible: true,
  },
  {
    path: "/annonce",
    title: "Annonces",
    icon: "design_app",
    class: "",
    visible: true,
  },
  {
    path: "/reservation",
    title: "Reservations",
    icon: "design_app",
    class: "",
    visible: true,
  },
  {
    path: "/user-profile",
    title: "Profile",
    icon: "users_single-02",
    class: "",
    visible: true,
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  connected: boolean;

  constructor(private store: AppStorage, private token: Token) {}

  ngOnInit() {
    if (this.store.getToken() === "") {
      for (let i = 0; i < ROUTES.length; i++) {
        ROUTES[i].visible = false;
      }
    } else {
      this.connected = true;
    }
    let p = this.token.payload(this.store.getToken());
    if (p != null) {
      let role = p.iss.split(",")[2];
      if (role === "user") {
        ROUTES[2].title = "Mes Reservations";
      }
    }
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  }
}
