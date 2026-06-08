import type { AddCartItemDto } from "@/shared/api/generated/schemas/addCartItemDto";
import type { CartItemResponseDto } from "@/shared/api/generated/schemas/cartItemResponseDto";
import type { CartResponseDto } from "@/shared/api/generated/schemas/cartResponseDto";
import type { UpdateCartItemDto } from "@/shared/api/generated/schemas/updateCartItemDto";

export type Cart = CartResponseDto;
export type CartItem = CartItemResponseDto;
export type AddCartItemInput = AddCartItemDto;
export type UpdateCartItemInput = UpdateCartItemDto;
