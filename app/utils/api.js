import axios from 'axios';
import { unstable_noStore as noStore } from 'next/cache'; 

const BASE_URL_SERVER = process.env.NEXT_PUBLIC_API_BASE_URL || ''; 
const BASE_URL_PATH = '/api/products'; 

const API_BASE_URL = typeof window === 'undefined' 
    ? `${BASE_URL_SERVER}${BASE_URL_PATH}`
    : BASE_URL_PATH;


export async function getAllProducts() {
  try {
    noStore(); 
    const response = await axios.get(API_BASE_URL);
    
    const products = response.data?.body?.data; 
    
    if (Array.isArray(products)) {
        return products;
    } else {
        console.error("API returned invalid data format in body.data:", response.data);
        return [];
    }
  } catch (error) {
    return []; 
  }
}

export async function getProductDetail(id) {
    noStore(); 
    if (!id) return null; 
    
    const DETAIL_URL = `${API_BASE_URL}?id=${id}`; 

    try {
        const response = await axios.get(DETAIL_URL);
        
        const product = response.data?.body?.data?.[0]; 

        if (product && product.id) {
            return product;
        } else {
            console.warn(`Product not found in API response for ID: ${id}`);
            return null;
        }
    } catch (error) {
        console.warn(`Error fetching product detail for ID ${id}:`, error.message);
        return null;
    }
}


export async function createProduct(productData) {
    try {
      const response = await axios.post(API_BASE_URL, productData);
      return response.data;
    } catch (error) {
      return false;
    }
}

export async function updateProduct(id, productData) {
    try {
      const response = await axios.put(`${API_BASE_URL}?id=${id}`, productData); 
      return response.data;
    } catch (error) {
      return false; 
    }
}

export async function softDeleteProduct(product) {
    if (!product || !product.id) {
        throw new Error("Product object is invalid or missing ID.");
    }
    
    const payload = {
        ...product,
        stock: 0, 
    };
    
    delete payload.id; 

    return updateProduct(product.id, payload);
}

const api = {
    getAllProducts,
    getProductDetail, 
    createProduct,
    updateProduct,
    softDeleteProduct,
};

export default api;