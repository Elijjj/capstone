export interface CartItem {
  id?: string;
  userId: string;
  productId: string;
  productType: string;
  productName: string;
  productDescription: string;
  imagePath: string;
  originalPrice: number;
  price: number;
  quantity: number;
  selectedQuantity: number;
  size: string;
  toppings?: string;
  crust?: string;
  flowers?: string;
}

// Checkout model in Angular (checkout.model.ts)
export interface Checkout {
  _id?: string; // Optional since it's assigned by MongoDB
  userId: string; // Assuming this is a reference to an AuthData model
  cartItems: CartItem[];
  totalPrice: number;
  discount?: number; // Optional since it has a default value
  finalPrice: number;
  orderType: string;
  pickupDate?: Date; // Optional since it may not be required for all orders
  paymentMethod: string;
  createdAt?: Date; // Optional as it's assigned by default in the schema
}

// AuthData model in Angular (auth-data.model.ts)
export interface AuthData {
  id?: string;
  email: string;
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
