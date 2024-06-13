import { tesloApi } from "../../config/api/tesloApi";
import { Product } from "../../domain/entities/product";
import { ProductResponse } from "../../infrastructure/interfaces/product.response";
import { ProductMapper } from "../../infrastructure/mappers/product.mapper";


export const getProductsByPage = async (page: number, limit: number = 20): Promise<Product[]> => {
    
    try {
        
        const {data} = await tesloApi.get<ProductResponse[]>(`/products?offset=${page * 10}&limit=${limit}`)

        const products = data.map(ProductMapper.tesloProductToEntity)
        //console.log(products[0]);
        return products
    } catch (error) {
        console.log(error);
        throw new Error("Error getting products");
        
    }
}