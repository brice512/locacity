import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AppStorage } from './AppStorage';
import { Token } from './Token';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router, private toastr: ToastrService) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | boolean
        | UrlTree
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree> {
        return this.permission();
    }

    permission() {
        const store = new AppStorage();
        const tokenValid = new Token();
        let token = store.getToken();
        if (token == null) {
            console.log('faux 1');
            this.toastr.error('Error', 'Acces Refuse!');
            this.router.navigate(['']);
            return false;
        } else {
            if (tokenValid.isValid(token)) {
                console.log('vrai');
                return true;
            } else {
                console.log('faux 2');
                this.toastr.error('Error', 'Acces Refuse!');
                this.router.navigate(['']);

                return false;
            }
        }
    }
}
