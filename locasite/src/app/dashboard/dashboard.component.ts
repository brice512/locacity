import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { AnnonceDto } from "../dto/annonceDto";
import { ReservationDto } from "../dto/reservationDto";
import { UtilisateurDto } from "../dto/utilisateurDto";
import { AppStorage } from "../helpers/AppStorage";
import { Token } from "../helpers/Token";
import { AnnonceService } from "../service/Annonce.service";
import { ReservationService } from "../service/Reservation.service";
import { UtilisateurService } from "../service/Utilisateur.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit {
  //pour moi
  villes: string[];
  categories: string[];
  annonces: AnnonceDto[];
  annonces_tmp: AnnonceDto[];
  annonces_tmp2: AnnonceDto[];
  annonce_tmp: AnnonceDto = new AnnonceDto();
  filtre: any;

  isList: boolean = true;
  isSelected: boolean;

  constructor(
    private toastr: ToastrService,
    private annonceService: AnnonceService,
    private router: Router,
    private utilisateurService: UtilisateurService,
    private reservationService: ReservationService,
    private store: AppStorage,
    private token: Token,
    private formBuilder: FormBuilder,
    http: HttpClient
  ) {}

  ngOnInit() {
    this.annonceService.getVilles().then(
      (data: string[]) => {
        this.villes = data;
        this.villes.sort();
      },
      (error: any) => {}
    );
    this.annonceService.getTypes().subscribe(
      (data: string[]) => {
        this.categories = data;
        this.categories.sort();
      },
      (error: any) => {}
    );
    this.filtre = this.formBuilder.group({
      ville: [""],
      categorie: [""],
      prixMin: [""],
      prixMax: [""],
      nombrePiece: [""],
    });

    this.annonceService.get().then(
      (data: AnnonceDto[]) => {
        this.annonces_tmp = data;
        for (let i = 0; i < this.annonces_tmp.length; i++) {
          if (this.annonces_tmp[i].habitat.etat === "libre") {
            this.annonces.push(this.annonces_tmp[i]);
          }

          this.annonces_tmp = this.annonces;
        }
      },
      (error: any) => {}
    );
  }
  selected(annonce: AnnonceDto) {
    this.annonce_tmp = annonce;
    this.isList = false;
    this.isSelected = true;
  }
  selected1() {
    this.isList = true;
    this.isSelected = false;
  }

  searchAnnonce() {
    this.annonces = this.annonces_tmp;
    this.annonces = this.annonces_tmp.filter((annonce: AnnonceDto) =>
      annonce.habitat.ville.includes(this.filtre.value.ville)
    );
    this.annonces = this.annonces_tmp.filter((annonce: AnnonceDto) =>
      annonce.habitat.type.includes(this.filtre.value.categorie)
    );

    for (let annonce of this.annonces) {
      if (
        annonce.habitat.prix < this.filtre.value.prixMin ||
        annonce.habitat.prix > this.filtre.value.prixMax
      ) {
        if (annonce.habitat.nombrePiece == this.filtre.value.nombrePiece) {
          this.annonces_tmp2.push(annonce);
        }
      }
    }

    this.annonces = this.annonces_tmp2;
  }

  lettre15(nom: string) {
    return nom.slice(0, 14);
  }

  annonceImages(annonce: AnnonceDto): any[][] {
    let images: any[][];
    this.annonceService.getImages(annonce.id).then(
      (data: any) => {
        images = data;
      },
      (error: any) => {}
    );

    return images;
  }

  reserver(annonce: AnnonceDto) {
    let reservation = new ReservationDto();
    reservation.annonce = annonce;
    reservation.etat = "en cours";
    let p = this.token.payload(this.store.getToken());
    if (p != null) {
      let id = p.iss.split(",")[1];
      this.utilisateurService.getUser(id).then(
        (data: UtilisateurDto) => {
          reservation.postulant = data;
        },
        (error: any) => {}
      );

      Swal.fire({
        title: "Confirmez-vous l'envoi des informatioms?",
        text: "action irreversible",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Oui, Envoyer!",
      })
        .then((result) => {
          if (result.value) {
            this.reservationService
              .creerReservation(reservation, "creer")
              .subscribe((data: string) => {
                this.toastr.success(" ", data);
              });
          }
        })
        .catch(() => {});
    }
  }
}
