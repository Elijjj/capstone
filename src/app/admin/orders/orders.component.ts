import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "src/app/auth/auth.service";
import { Subscription } from 'rxjs';

@Component({
    selector:'app-orders',
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css', '../admin-homepage.component.css']
})

export class OrdersComponent implements OnInit, OnDestroy{
    isLoading=false;
    private token: string;

    constructor(private route: ActivatedRoute, private authService: AuthService) {}

    ngOnInit(){
        this.isLoading=true;
        this.route.queryParams.subscribe((params) => {
            this.token = params['token'];
            this.isLoading = false;
        });
    }

    ngOnDestroy(){
    }

    onLogout(){
        this.authService.logout();
    }
}