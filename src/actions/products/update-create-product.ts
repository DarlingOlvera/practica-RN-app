import { isAxiosError } from "axios";
import { tesloApi } from "../../config/api/tesloApi";
import { Product } from "../../domain/entities/product";

//Partial es propio de Ts y permite que todas las propiedades de una interfaz (Product)
//sean opcionales
export const updateCreateProduct = (product: Partial<Product>) => {

    product.stock = isNaN(Number(product.stock)) ? 0 : Number(product.stock)
    product.price = isNaN(Number(product.price)) ? 0 : Number(product.price)

    if(product.id && product.id !== 'new'){
        return updateProduct(product)
    }

    return createProduct(product)
    
}

const updateProduct = async (product: Partial<Product>) => {
    
    
    const {id, images = [], ...rest} = product

    try {
        const checkedImages = await prepareImages(images)
    
        const {data} = await tesloApi.patch(`/products/${id}`,{
            images: checkedImages,
            ...rest
        })

        return data
        
    } catch (error) {
        if(isAxiosError(error)){
            console.log(error.response?.data);
        }
        throw new Error("Error updating product");
        
    }


}

const createProduct = async (product: Partial<Product>) => {
    
    const {id, images = [], ...rest} = product

    try {
        const checkedImages = await prepareImages(images)
    
        const {data} = await tesloApi.post(`/products`,{
            images: checkedImages,
            ...rest
        })

        return data
        
    } catch (error) {
        if(isAxiosError(error)){
            console.log(error.response?.data);
        }
        throw new Error("Error creating product");
        
    }
}

const prepareImages = async (images: string[]) => {

    //TODO: revisar files
    const fileImages = images.filter(img => img.includes('file://'))
    const currentImages = images.filter(img =>  !img.includes('file://'))

    if(fileImages.length > 0){
        const uploadPromises = fileImages.map(uploadImage)
        const uploadedImages = await Promise.all(uploadPromises)

        currentImages.push(...uploadedImages)
    }

    return currentImages.map( image => image.split('/').pop())
}

const uploadImage = async (image: string) => {
    const formData = new FormData()

    formData.append('file',{
        uri: image,
        type:'image/jpeg',
        name: image.split('/').pop()
    })

    const {data} = await tesloApi.post<{image: string}>('files/product', formData,{
        headers:{
            'Content-Type': 'multipart/form-data'
        }
    })

    return data.image
}