'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Typography, Tag, Spin, App, Statistic, Table } from 'antd';
import { ReloadOutlined, ShoppingCartOutlined, DollarOutlined, UserOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title, Text, Paragraph } = Typography;

const DashboardClientContent = ({ initialData }) => {
  const { message } = App.useApp();
  
  const [data, setData] = useState(Array.isArray(initialData) ? initialData : []);
  const [loading, setLoading] = useState(false);

  // Load data di client-side jika initialData kosong
  useEffect(() => {
    if (data.length === 0) {
      api.getAllProducts().then(products => {
        setData(Array.isArray(products) ? products : []);
      });
    }
  }, []);

  const totalProducts = data.length;
  const totalValue = data.reduce((sum, item) => sum + (item.price * item.stock), 0);
  const lowStock = data.filter(item => item.stock < 10).length;
  const categories = [...new Set(data.map(d => d.category))];
  
  const randomHighlight = data.length > 0 
    ? data[Math.floor(Math.random() * data.length)] 
    : null;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const products = await api.getAllProducts();
    
    if (Array.isArray(products) && products.length > 0) {
      setData(products);
      message.success('Random highlight refreshed.', { duration: 2 });
    } else {
      message.error('Could not retrieve products for highlight. Check server status.', { duration: 5 });
      setData([]);
    }
    
    setLoading(false);
  }, [message]);

  const columns = [
    { title: 'Product', dataIndex: 'name', key: 'name' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Stock', dataIndex: 'stock', key: 'stock' },
    { title: 'Price', dataIndex: 'price', key: 'price', render: (price) => `Rp ${price?.toLocaleString()}` },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard</Title>
      
      {/* Statistics Row */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Products"
              value={totalProducts}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Value"
              value={totalValue}
              prefix={<DollarOutlined />}
              precision={0}
              formatter={(value) => `Rp ${value.toLocaleString()}`}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Low Stock Items"
              value={lowStock}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Categories & Highlight Row */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} sm={12}>
          <Card title="Categories">
            {categories.length > 0 ? (
              categories.map(c => <Tag key={c} color="blue">{c}</Tag>)
            ) : (
              <Text type="secondary">No categories data found.</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={12}>
          <Card 
            title="Random Highlight"
            extra={
              <a onClick={fetchData} style={{ cursor: loading ? 'not-allowed' : 'pointer' }}>
                {loading ? <Spin size="small" /> : <ReloadOutlined />} Refresh
              </a>
            }
          >
            {randomHighlight ? (
              <div>
                <Title level={4} style={{ marginBottom: 4 }}>{randomHighlight.name}</Title>
                <Text type="secondary">{randomHighlight.category}</Text>
                
                <Title level={5} style={{ color: '#fa8c16', margin: '8px 0' }}>
                  Rp {randomHighlight.price?.toLocaleString()}
                </Title>
                
                <Paragraph ellipsis={{ rows: 2 }} style={{ marginBottom: 8 }}>
                  {randomHighlight.description}
                </Paragraph>

                <Text type="secondary">Stock: {randomHighlight.stock}</Text>
              </div>
            ) : (
              <Text type="secondary">No products available. Check API connection.</Text>
            )}
          </Card>
        </Col>
      </Row>

      {/* Recent Products Table */}
      <Card title="Recent Products" style={{ marginTop: 16 }}>
        <Table 
          dataSource={data.slice(0, 5)} 
          columns={columns} 
          rowKey="id" 
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
};

const DashboardClient = (props) => (
  <App>
    <DashboardClientContent {...props} />
  </App>
);

export default DashboardClient;