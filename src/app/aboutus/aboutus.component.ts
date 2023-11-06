import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from 'rxjs';

import { PageEvent } from "@angular/material/paginator";
import { AuthService } from "src/app/auth/auth.service";

@Component({
    selector:'app-aboutus',
    templateUrl: './aboutus.component.html',
    styleUrls: ['./aboutus.component.css']
})

export class AboutUsComponent implements OnInit, OnDestroy{
    isLoading=false;
    constructor(private authService: AuthService) {}

    ngOnInit(){
        this.isLoading=true;
    }
    onChangedPage(pageData: PageEvent){
        this.isLoading=true;
    }
    
    onDelete(postId: string){
        this.isLoading=true;
    }

    ngOnDestroy(){
    }
}