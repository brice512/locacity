import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl } from "@angular/forms";
import * as Chartist from "chartist";
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
  selector: "app-reservation",
  templateUrl: "./reservation.component.html",
  styleUrls: ["./reservation.component.css"],
})
export class ReservationComponent implements OnInit {
  reservations: ReservationDto[];
  reservations_tmp: ReservationDto[];
  filtre: any;
  mes_reservation: boolean;
  constructor(
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private reservationService: ReservationService,
    private utilisateurService: UtilisateurService,
    private token: Token,
    private store: AppStorage,
    private annonceService: AnnonceService
  ) {}

  ngOnInit() {
    let p = this.token.payload(this.store.getToken());
    if (p != null) {
      let role = p.iss.split(",")[2];
      if (role === "admin") {
        this.reservationService.get().then((data: ReservationDto[]) => {
          this.reservations = data;
        });
      } else {
        this.mes_reservation = true;
        let id = p.iss.split(",")[1];
        this.reservationService
          .getMesReservation(id)
          .then((data: ReservationDto[]) => {
            this.reservations = data;
          });
      }

      this.filtre = this.formBuilder.group({
        utilisateur: new FormControl([""]),
      });
    }
  }

  searchReservation() {
    this.reservations = this.reservations_tmp;
    this.reservations = this.reservations_tmp.filter(
      (reservation: ReservationDto) =>
        this.nomPrenom(reservation.postulant).includes(
          this.filtre.value.utilisateur
        )
    );
  }

  nomPrenom(postulant: UtilisateurDto) {
    return postulant.nom + " " + postulant.prenom;
  }

  accepterOuRejeterReservation(reservation: ReservationDto, action: string) {
    Swal.fire({
      title: "Voullez-vous " + action + " cette reservaction ?",
      text: "action irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui !",
    })
      .then((result) => {
        if (result.value) {
          let formData = new FormData();

          formData.append("reservaction", JSON.stringify(reservation));
          formData.append("action", action);
          this.reservationService
            .accepterOuRejeterReservation(formData)
            .subscribe(
              (result: string) => {
                this.toastr.success(" ", result);
                this.ngOnInit();
              },
              (error: any) => {}
            );
        }
      })
      .catch(() => {});
  }

  etat(reservation: ReservationDto) {
    return reservation.etat === "en cours" ? true : false;
  }

  lettre15(nom: string) {
    return nom.slice(0, 14);
  }

  getImage(utilisateur: UtilisateurDto) {
    return this.utilisateurService.getAvatar(utilisateur.id);
  }

  annonceImages(reservation: ReservationDto): any[][] {
    let images: any[][];
    this.annonceService.getImages(reservation.annonce.id).then(
      (data: any) => {
        images = data;
      },
      (error: any) => {}
    );

    return images;
  }
  annulerReservation(reservation: ReservationDto) {
    Swal.fire({
      title: "Voullez-vous annuler cette reservaction ?",
      text: "action irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui !",
    })
      .then((result) => {
        if (result.value) {
          reservation.etat = " ";
          this.reservationService
            .creerReservation(reservation, "annuler")
            .subscribe(
              (result: string) => {
                this.toastr.success(" ", result);
                this.ngOnInit();
              },
              (error: any) => {}
            );
        }
      })
      .catch(() => {});
  }
}
