export type CartItemType = "Resource" | "Service";

/** Shape accepted when adding an item to the cart (no quantity yet) */
export interface CartItemInput {
  id: number;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl?: string;
  itemType: CartItemType;
  categoryName: string;
  providerName: string;
  projectId: number;
}

/** Cart line item = input + quantity */
export interface CartItem extends CartItemInput {
  quantity: number;
}
