import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppStorage } from "./AppStorage";

@Injectable()
export class RequestInterceptor implements HttpInterceptor{
    constructor(private store : AppStorage){}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let token = this.store.getToken()
        const headers = {
            Authorization: 'Bearer '+token,
        }
        
        req = req.clone({
            setHeaders: headers
        })
        
        return next.handle(req);
    }

}