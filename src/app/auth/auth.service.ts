import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, first, Observable } from 'rxjs';

import { AuthData } from './auth-data.model';

import { environment } from 'src/environments/environments';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private role: string;
  private authStatusListener = new Subject<boolean>();
  private authData: AuthData;

  constructor(private http: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getAccountType() {
    return this.role;
  }

  setAuthStatus(isAuth: boolean, role: string | null): void {
    this.isAuthenticated = isAuth;
    this.role = role;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserProfile() {
    return this.http.get(BACKEND_URL + 'profile');
  }

  updateUserProfile(updatedData: AuthData) {
    return this.http.put(BACKEND_URL + 'profile', updatedData);
}

  getUserId() {
    return this.userId;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  isAdminAccount() {
    return this.getAccountType() === 'Admin';
  }

getUserProfileDiscount(userId: string) {
  return this.http.get<{
    verified: boolean;
    id: string;
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    contactnumber: string,
    city: string,
    province: string,
    bls: string,
    subdivision: string,
    postalcode: string,
    role: string,
    imagePath: string,
    // birthday: Date,
    discountType: string,
    discountStatus: string;


  }>(BACKEND_URL + 'profile/discount/' + userId);
}


  createUser(
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    contactnumber: string,
    city: string,
    province: string,
    bls: string,
    subdivision: string,
    postalcode: string,
    role: string,
    imagePath: string,
    // birthday: Date,
    discountType: string,
    discountStatus: string,
    verified: boolean,
  ) {
    const authData: AuthData = {
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      contactnumber: contactnumber,
      city: city,
      province: province,
      bls: bls,
      subdivision: subdivision,
      postalcode: postalcode,
      role: 'Customer',
      imagePath: imagePath,
      // birthday: birthday,
      discountType: discountType,
      discountStatus: discountStatus,
      verified: false
    };
    this.http.post(BACKEND_URL + '/signup', authData).subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.authStatusListener.next(false);
      },
    });
  }
  

  requestResetPassword(email: string) {
    const payload = { email: email };
    this.http.post('BACKEND_URL/reset-password', payload).subscribe(
      response => {
        console.log(response);
        // Handle response
      },
      error => {
        console.error(error);
        // Handle error
      }
    );
  }

  login(
    id: string,
    email: string,
    password: string,
    firstname: string,
    lastname: string,
    contactnumber: string,
    city: string,
    province: string,
    bls: string,
    subdivision: string,
    postalcode: string,
    role: string,
    imagePath: string,
    // birthday: Date,
    discountType: string,
    discountStatus: string,
    verified: boolean,
  ) {
    const authData: AuthData = {
      id: id,
      email: email,
      password: password,
      firstname: firstname,
      lastname: lastname,
      contactnumber: contactnumber,
      city: city,
      province: province,
      bls: bls,
      subdivision: subdivision,
      postalcode: postalcode,
      role: role,
      imagePath: imagePath,
      // birthday: birthday,
      discountType: discountType,
      discountStatus: discountStatus,
      verified: verified,
    };
  
    this.http
      .post<{ token: string; expiresIn: number; userId: string; role: string; }>(
        BACKEND_URL + '/login',
        authData
      )
      .subscribe(
        (response) => {
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.role = response.role;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            this.saveAuthData(token, expirationDate, this.userId, this.role);
  
            console.log('User Role:', this.role); // Add this line for debugging
  
            // Check the user's role and redirect accordingly
            if (this.role === 'Admin') {
              this.router.navigate(['/admin/dashboard']);
            } else {
              this.router.navigate(['/']);
            }
          }
        },
        (error) => {
          this.authStatusListener.next(false);
        }
      );
  }  
  
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      // User is not authenticated
      this.isAuthenticated = false;
      this.role = 'Customer'; // Set account type to 'Customer' for unauthenticated users
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
  
      // Set the accountType based on the user's role
      this.role = authInformation.role;
      const userRole = this.role;
      console.log('User Role:', userRole); // Add this line for debugging
      return;
    }
    this.isAuthenticated = false;
    this.role = 'Customer';
  }
  


  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, role: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
    localStorage.setItem('role', role);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
  }

  getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    const role = localStorage.getItem('role');
    if (!token || !expirationDate || !userId || !role) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId,
      role: role
    };
  }

  updateDiscount(
    id: string, 
    email: string, 
    password: string, 
    firstname: string, 
    lastname: string,  
    contactnumber: string, 
    city: string, 
    province: string, 
    bls: string, 
    subdivision: string, 
    postalcode: string, 
    role: string, 
    image: File, 
    // birthday: Date | string, 
    discountType: string,
    discountStatus: string,
    
  ) {
      let authData: AuthData | FormData;
      
      // Check if image is an instance of File (assuming AuthData.imagePath is of type string)
          authData = new FormData();
          authData.append("userId", id);
          authData.append("email", email);
          authData.append("password", password);
          authData.append("firstname", firstname);
          authData.append("lastname", lastname);
          authData.append("contactnumber", contactnumber);
          authData.append("city", city);
          authData.append("province", province);
          authData.append("bls", bls);
          authData.append("subdivision", subdivision);
          authData.append("postalcode", postalcode);
          authData.append("role", role);
          authData.append("image", image, firstname);
          
          // Check if birthday is an instance of Date and convert to string for FormData
          // if (birthday instanceof Date) {
          //     authData.append("birthday", birthday.toDateString());
          // } else if (typeof birthday === "string") {
          //     authData.append("birthday", birthday);
          // } else {
          //     console.error("birthday is neither a string nor a Date object:", birthday);
          // }
  
          authData.append("discountType", discountType);
          authData.append("discountStatus", discountStatus);
      this.http.put(BACKEND_URL + 'profile/discount/' + id, authData)
      .subscribe(response => {
      });
  }
  
  
  
}
