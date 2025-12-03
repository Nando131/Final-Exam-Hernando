// app/products/page.js (Server Component)

import React from 'react';
import ProductsPageClient from '../components/ProductsPageClient';
import api from '../utils/api';

async function getInitialProducts() {
    const products = await api.getAllProducts();
    return products;
}

export default async function ProductsPage() {
    const initialProducts = await getInitialProducts();
    
    return <ProductsPageClient initialProducts={initialProducts} />;
}