import type {
  AddCartItemDto,
  CartItemResponseDto,
  CartResponseDto,
  UpdateCartItemDto,
} from "@/shared/api/generated/schemas";

export type Cart = CartResponseDto;
export type CartItem = CartItemResponseDto;

export type AddCartItemInput = AddCartItemDto;
export type UpdateCartItemInput = UpdateCartItemDto;
