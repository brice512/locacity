import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { UtilisateurDto } from "../dto/utilisateurDto";
import { AppStorage } from "../helpers/AppStorage";
import { Token } from "../helpers/Token";
import { UtilisateurService } from "../service/Utilisateur.service";
import { environment } from "../../environments/environment";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"],
})
export class UserProfileComponent implements OnInit {
  utilisateur: UtilisateurDto = new UtilisateurDto();
  updateForm: any;
  url:string = environment.apiUrl;
  constructor(
    private token: Token,
    private store: AppStorage,
    private utilisateurService: UtilisateurService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    let p = this.token.payload(this.store.getToken());
    if (p != null) {
      let id = parseInt(p.iss.split(",")[1]);
      this.utilisateurService.getUser(id).then(
        (data: UtilisateurDto) => {
          this.utilisateur = data;
        },
        (error: any) => {}
      );
    }

    this.updateForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),

      nom: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      prenom: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      ville: new FormControl(null, [
        Validators.required,
        Validators.maxLength(20),
      ]),
      tel: new FormControl(null, [
        Validators.required,
        Validators.maxLength(9),
      ]),
      dateNaissance: new FormControl(null, [Validators.required]),
    });
  }

  getImage(utilisateur: UtilisateurDto) {
    return this.utilisateurService.getAvatar(utilisateur.id);
  }

  nomPrenom(postulant: UtilisateurDto) {
    return postulant.nom + " " + postulant.prenom;
  }

  onUpdate() {
    let dto = new UtilisateurDto();
    dto.nom = this.updateForm.value.nom;
    dto.prenom = this.updateForm.value.prenom;
    dto.email = this.updateForm.value.email;
    dto.tel = this.updateForm.value.tel;
    dto.ville = this.updateForm.value.ville;
    dto.dateNaissance = this.updateForm.value.dateNaissance;

    const formData = new FormData();
    formData.append("user", JSON.stringify(dto));

    Swal.fire({
      title: "Cette action modifira vos informations personnelles !",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, Envoyer!",
    })
      .then((result) => {
        if (result.value) {
          this.utilisateurService
            .creerUtilisateur(formData, "update")
            .subscribe(
              (Response) => {
                console.log(Response);

                this.toastr.success("Succes", "Informations mises a jour");
              },
              (error) => {
                console.log(error);
                this.toastr.error("Echec", "Erreur lors de la mise a jour");
              }
            );
        }
      })
      .catch(() => {});
  }
}
