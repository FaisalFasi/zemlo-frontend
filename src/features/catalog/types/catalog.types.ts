import type {
  PublicBrandResponseDto,
  PublicCategoryResponseDto,
  PublicProductDetailResponseDto,
  PublicProductListItemResponseDto,
} from "@/shared/api/generated/schemas";

export type CatalogProductListItem = PublicProductListItemResponseDto;
export type CatalogProductDetail = PublicProductDetailResponseDto;
export type CatalogCategory = PublicCategoryResponseDto;
export type CatalogBrand = PublicBrandResponseDto;
