import api from '../utils/api';
import ProductTable from '../components/ProductTable';

async function getProducts() {
    try {
        const products = await api.getAllProducts();
        return products;
    } catch (error) {
        console.error("Server fetch failed:", error);
        return [];
    }
}

export default async function ProductsPage() {
    const initialProducts = await getProducts(); 

    return (
        <div>
            <h2>Products</h2>
            <ProductTable initialData={initialProducts} /> 
        </div>
    );
}