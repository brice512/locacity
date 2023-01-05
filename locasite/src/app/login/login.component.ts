import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaderResponse,
  HttpResponse,
} from "@angular/common/http";
import { Component, Injectable, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { AuthRequestDto } from "../dto/authRequestDto";
import { AuthResponseDto } from "../dto/authResponseDto";
import { UtilisateurDto } from "../dto/utilisateurDto";
import { AppStorage } from "../helpers/AppStorage";
import { Token } from "../helpers/Token";
import { AuthentificationService } from "../service/Authentification.service";
import { UtilisateurService } from "../service/Utilisateur.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
@Injectable({
  providedIn: "root",
})
export class LoginComponent implements OnInit {
  //pour moi
  isLogin: boolean = true;
  isSignUp: boolean;
  uploadedFile: any;
  url: any;
  test: Date = new Date();
  year: number = this.test.getFullYear() - 20;
  loginForm: any;
  registerForm: any;

  constructor(
    private router: Router,
    private dto: AuthRequestDto,
    private store: AppStorage,
    private toastr: ToastrService,
    private authentificationService: AuthentificationService,
    private utilisateurService: UtilisateurService
  ) {}

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });

    this.registerForm = new FormGroup({
      email: new FormControl("", [Validators.email]),
      password: new FormControl("", [Validators.required]),
      confirmPassword: new FormControl("", [Validators.required]),
      nom: new FormControl("", [Validators.required, Validators.maxLength(20)]),
      prenom: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      ville: new FormControl("", [
        Validators.required,
        Validators.maxLength(20),
      ]),
      tel: new FormControl([Validators.required]),
      dateNaissance: new FormControl([Validators.required]),
    });
  }

  selected(form: String) {
    if (form === "login") {
      this.isLogin = true;
      this.isSignUp = false;
    } else {
      this.isLogin = false;
      this.isSignUp = true;
    }
  }

  onUpload(event) {
    let reader = new FileReader();
    this.uploadedFile = event.target.files[0];
    reader.readAsDataURL(this.uploadedFile);
    reader.onload = (event: any) => {
      this.url = event.target.result;
    };
  }

  onLogin() {
    this.dto.email = this.loginForm.value.email;
    this.dto.password = this.loginForm.value.password;

    this.authentificationService.login(this.dto).subscribe(
      (data: AuthResponseDto) => {
        if (data != null) {
          this.store.storeToken(data.jwt_token);

          this.router.navigate(["/"]);
        } else {
          this.toastr.error(
            "Mauvais parametres",
            "Email / Mot de passe incorrects"
          );
        }
      },
      (error: HttpErrorResponse) => {
        this.toastr.error(
          "Mauvais parametres",
          "Email / Mot de passe incorrects"
        );
      }
    );
  }

  onRegister() {
    if (
      this.registerForm.value.password ==
      this.registerForm.value.confirmPassword
    ) {
      let dto = new UtilisateurDto();
      dto.nom = this.registerForm.value.nom;
      dto.prenom = this.registerForm.value.prenom;
      dto.email = this.registerForm.value.email;
      dto.tel = this.registerForm.value.tel;
      dto.ville = this.registerForm.value.ville;
      dto.dateNaissance = this.registerForm.value.dateNaissance;
      dto.role = "user";

      const formData = new FormData();
      formData.append("user", JSON.stringify(dto));
      formData.append("file", this.uploadedFile);
      formData.append("password", this.registerForm.value.password);

      let request = new AuthRequestDto();
      request.email = this.dto.email;
      request.password = this.registerForm.value.password;

      Swal.fire({
        title:
          "En Envoyant ces informations vous acceptez les conditions d'utilisation?",
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
              .creerUtilisateur(formData, "creer")
              .subscribe(
                (response) => {
                  this.authentificationService
                    .login(request)
                    .subscribe((data: AuthResponseDto) => {
                      if (data != null) {
                        this.store.storeToken(data.jwt_token);

                        this.router.navigate(["/"]);
                      } else {
                        this.toastr.error(
                          "Mauvais parametres",
                          "Email / Mot de passe incorrects"
                        );
                      }
                    });
                },
                (error) => {
                  console.log(error);
                  this.toastr.error("Echec", "Erreur lors de la création");
                }
              );
          }
        })
        .catch(() => {});
    } else {
      this.toastr.warning("Echec", "Les mots de passe doivent correspondre");
    }
  }
}
