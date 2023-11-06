import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "../auth/auth.service";
import { Subscription } from 'rxjs';
import { AuthData } from "../auth/auth-data.model";

@Component({
    selector:'app-admin',
    templateUrl: './admin-homepage.component.html',
    styleUrls: ['./admin-homepage.component.css']
})

export class AdminHomepageComponent implements OnInit, OnDestroy{
    isLoading=false;
    private token: string;
    private role: string;
    authData: string;
    private authStatusSub: Subscription;
    userIsAuthenticated = false;

    constructor(private route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit() {
        this.isLoading = true;
        if(!this.authData){
            this.isLoading=false;
        }
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
            authStatus => {
                this.isLoading=false;
                this.userIsAuthenticated = authStatus;
            });
      }
      

    ngOnDestroy(){
    }

    onLogout(){
        this.authService.logout();
    }
}