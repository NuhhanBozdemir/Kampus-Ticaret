export interface Product {
  title: string;
  price: number;
  id: string;
  description: string;
  category: string;
  image: string;
}

export interface Cart extends Product {
  count: number;
}
