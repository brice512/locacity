import { Component, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Token {
    constructor() {}

    isValid(token: string) {
        const payload = this.payload(token);
        let now = new Date();

        if (payload) {
            if (
                payload.iss.split(',')[0] === 'http://localhost:8080/auth/login'
            ) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    payload(token: string) {
        if (token != null) {
            const partie = token.split('.');
            const payload = partie[1];
            return this.decode(payload);
        } else {
            return null;
        }
    }

    decode(payload: string) {
        if (payload) {
            return JSON.parse(atob(payload));
        }
        return null;
    }
}
