import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from 'rxjs';
import { Router } from "@angular/router";

@Component({
    selector: 'app-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, OnDestroy {
    isLoading = false;
    userIsAuthenticated = false;
    private authListenerSubs: Subscription;

    constructor(private authService: AuthService, private router: Router) { }

    ngOnInit() {
        this.userIsAuthenticated = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
            this.userIsAuthenticated = isAuthenticated;

            // Check the user's role and redirect accordingly
            if (isAuthenticated) {
                const userRole = this.authService.getAccountType();
                console.log('User Role:', userRole); // Add this line for debugging

                if (userRole === 'Admin') {
                    this.router.navigate(['/admin/dashboard']);
                }
            }
        });

        // Ensure autoAuthUser is called to set the user's role
        this.authService.autoAuthUser();
    }

    onLogout() {
        this.authService.logout();
    }

    ngOnDestroy() {
        this.authListenerSubs.unsubscribe();
    }
}
