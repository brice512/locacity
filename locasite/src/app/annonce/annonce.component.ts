import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import * as Chartist from "chartist";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { AnnonceDto } from "../dto/annonceDto";
import { HabitatDto } from "../dto/habitatDto";
import { AnnonceService } from "../service/Annonce.service";
import { UtilisateurService } from "../service/Utilisateur.service";

@Component({
  selector: "app-annonce",
  templateUrl: "./annonce.component.html",
  styleUrls: ["./annonce.component.css"],
})
export class AnnonceComponent implements OnInit {
  //pour moi
  villes: string[];
  categories: string[];
  annonces: AnnonceDto[];
  annonces_tmp: AnnonceDto[];
  annonces_tmp2: AnnonceDto[];
  annonce_tmp: AnnonceDto = new AnnonceDto();
  filtre: any;
  recordForm: any;

  isList: boolean = true;
  isSelected: boolean;
  isForm: boolean;
  uploadedFiles: any[] = [];
  url: any[] = [];
  constructor(
    private toastr: ToastrService,
    private annonceService: AnnonceService,
    private formBuilder: FormBuilder
  ) {}

  onUpload(event) {
    let reader = new FileReader();
    for (const file of event.target.files) {
      this.uploadedFiles.push(file);
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url.push(event.target.result);
      };
    }
  }

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
      ville: new FormControl([""]),
      categorie: new FormControl([""]),
      etat: new FormControl([""]),
    });

    this.recordForm = this.formBuilder.group({
      nom: new FormControl(null, [Validators.required]),
      categorie: new FormControl(null, [Validators.required]),
      superficie: new FormControl(null, [Validators.required]),
      ville: new FormControl(null, [Validators.required]),
      nombrePiece: new FormControl(null, [Validators.required]),
      prix: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
    });

    this.annonceService.get().then(
      (data: AnnonceDto[]) => {
        this.annonces = data;
      },
      (error: any) => {}
    );
  }

  selected(form: String) {
    if (form === "list") {
      this.isList = true;
      this.isForm = false;
      this.isSelected = false;
    } else if (form === "form") {
      this.isList = false;
      this.isForm = true;
      this.isSelected = false;
    } else {
      this.isList = false;
      this.isForm = false;
      this.isSelected = true;
    }
  }

  selected1(annonce: AnnonceDto) {
    this.annonce_tmp = annonce;
    this.isList = false;
    this.isForm = false;
    this.isSelected = true;
  }

  searchAnnonce() {
    this.annonces = this.annonces_tmp;
    this.annonces = this.annonces_tmp.filter((annonce: AnnonceDto) =>
      annonce.habitat.ville.includes(this.filtre.value.ville)
    );
    this.annonces = this.annonces_tmp.filter((annonce: AnnonceDto) =>
      annonce.habitat.type.includes(this.filtre.value.categorie)
    );

    this.annonces = this.annonces_tmp.filter((annonce: AnnonceDto) =>
      annonce.habitat.etat.includes(this.filtre.value.etat)
    );
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

  masquer(annonce: AnnonceDto) {
    Swal.fire({
      title: "Masquer cette Annonce ?",
      text: "action irreversible",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Envoyer!",
    })
      .then((result) => {
        if (result.value) {
          this.annonceService.masquerAnnonce(annonce).then(
            (data: any) => {
              this.toastr.success(" ", data);
              this.ngOnInit();
            },
            (error: any) => {}
          );
        }
      })
      .catch(() => {});
  }

  onSubmit() {
    Swal.fire({
      title: "Confirmez-vous l'envoi des informatioms?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Envoyer!",
    })
      .then((result) => {
        if (result.value) {
          let annonce: AnnonceDto = new AnnonceDto();
          annonce.habitat = new HabitatDto();
          annonce.dateDebut = new Date();
          annonce.habitat.nom = this.recordForm.value.nom;
          annonce.habitat.type = this.recordForm.value.categorie;
          annonce.habitat.superficie = this.recordForm.value.superficie;
          annonce.habitat.prix = this.recordForm.value.prix;
          annonce.habitat.description = this.recordForm.value.description;
          annonce.habitat.etat = "libre";
          annonce.habitat.nombrePiece = this.recordForm.value.nombrePiece;
          annonce.habitat.ville = this.recordForm.value.ville;

          let formData = new FormData();

          formData.append("user", JSON.stringify(annonce));
          for (let i = 0; i < this.uploadedFiles.length; i++) {
            formData.append("file", this.uploadedFiles[i]);
          }
          formData.append("taille", this.uploadedFiles.length + "");
          this.annonceService.creerAnnonce(formData, "creer").subscribe(
            (data: string) => {
              this.toastr.success(" ", data);
              this.ngOnInit();
            },
            (error: any) => {}
          );
        }
      })
      .catch(() => {});
  }
}
