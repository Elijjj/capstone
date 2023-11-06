export interface AuthData {
    id?: string,
    email: string;
    password: string;
    firstname: string;
    lastname: string;
    contactnumber: string;
    city: string;
    province: string;
    bls: string;
    subdivision: string;
    postalcode: string;
    role?: string;
    imagePath: string;
    birthday: Date;
    discountType: string;
    discountStatus: string;
  }
  