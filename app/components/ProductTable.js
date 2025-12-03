'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Table, Button, Input, Space, Popconfirm, Tag, Select, App } from 'antd'; 
import { EditOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons';
import Link from 'next/link';

import { useGlobal } from '../context/GlobalContext'; 
import api from '../utils/api'; 
import ProductModal from './ProductModal'; 

const { Search } = Input;

export default function ProductTable({ initialData }) {
  const { message } = App.useApp(); // Ini tetap bisa dipake karena ada App di layout

  const [data, setData] = useState(Array.isArray(initialData) ? initialData : []);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const { selectedCategory, setSelectedCategory } = useGlobal();

  const fetchData = async () => {
    setLoading(true);
    const products = await api.getAllProducts(); 

    if (!Array.isArray(products) || products.length === 0) {
        if (products.length === 0 && Array.isArray(products)) {
            message.warning('Data loaded successfully, but list is empty.', 3);
        } else {
            message.error('Failed to connect or retrieve products from API. Check server status.', 5);
        }
        setData([]);
    } else {
        message.success('Data refreshed successfully.', 2); // 2 detik auto close
        setData(products);
    }
    
    setLoading(false);
  };
    
  const handleDelete = async (record) => {
    try {
      await api.softDeleteProduct(record);
      message.success('Product set to inactive (stock 0)', 3);
      fetchData(); 
    } catch (error) {
      message.error(error.message || 'Failed to delete product', 5);
    }
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record) => {
    setEditingProduct(record);
    setIsModalOpen(true);
  };

  const uniqueCategories = useMemo(() => {
      return [
          ...new Set(
              data
                  .map(item => item.category)
                  .filter(category => category)
          ),
      ];
  }, [data]);
  
  const categoryOptions = uniqueCategories.map(c => ({ label: c, value: c }));

  const filteredData = data.filter(item => {
    const matchesSearch = (item.name ?? '').toLowerCase().includes(searchText.toLowerCase()); 
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (src) => <img src={src} alt="product" style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} onError={(e) => e.target.style.display='none'} />,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => <Link href={`/products/${record.id}`}>{text}</Link>,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `Rp ${price?.toLocaleString()}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock > 0 ? stock : 'Out of Stock'}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} onClick={() => openEditModal(record)} />
          <Popconfirm
            title="Are you sure to delete (set inactive)?"
            onConfirm={() => handleDelete(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  useEffect(() => {
    api.getAllProducts().then(setData);
  }, [])

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <Space>
          <Search 
            placeholder="Search products" 
            onSearch={setSearchText} 
            onChange={e => setSearchText(e.target.value)} 
            style={{ width: 200 }} 
          />
          <Select 
            placeholder="Filter Category"
            style={{ width: 150 }}
            allowClear
            onChange={setSelectedCategory}
            options={categoryOptions}
            value={selectedCategory}
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData} loading={loading}>Refresh</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
          Add Product
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={filteredData} 
        rowKey="id" 
        loading={loading}
        rowClassName={(record) => record.stock === 0 ? 'bg-gray-100 opacity-60' : ''}
      />

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        refreshData={fetchData}
        editingProduct={editingProduct}
      />
    </div>
  );
}