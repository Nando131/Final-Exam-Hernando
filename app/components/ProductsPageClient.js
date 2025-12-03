'use client';

import React from 'react';
import { Typography } from 'antd';
import ProductTable from './ProductTable';

const { Title } = Typography;

export default function ProductsPageClient({ initialProducts }) {
    return (
        <div style={{ padding: 20 }}>
            <Title level={2}>Products</Title>
            <ProductTable initialData={initialProducts} />
        </div>
    );
}