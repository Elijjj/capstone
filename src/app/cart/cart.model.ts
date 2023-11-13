export interface Cart{
  id?: string,
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
  isOutOfStock?: boolean;
}
