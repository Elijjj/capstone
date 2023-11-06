export interface Cart{
  userId: string,
  productId: string;
  productType: string;
  productName: string;
  productDescription: string;
  imagePath: string;
  originalPrice: number;
  price: number;
  quantity: number;
  selectedQuantity:number;
  size: string;
  toppings: string;
  crust: string;
  flowers: string;
}
