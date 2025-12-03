'use client';

import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Typography, Tag, Spin, App } from 'antd'; 
import { ReloadOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title, Text, Paragraph } = Typography; 

const DashboardClientContent = ({ initialData }) => {
  const { message } = App.useApp(); 
  
  const [data, setData] = useState(Array.isArray(initialData) ? initialData : []);
  const [loading, setLoading] = useState(false);

  const totalProducts = data.length;
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
  
  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Dashboard</Title>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={8}>
          <Card title="Total Products">
            <Title level={1}>{totalProducts}</Title>
          </Card>
        </Col>
        
        <Col xs={24} sm={8}>
          <Card title="Categories">
            {categories.length > 0 ? (
              categories.map(c => <Tag key={c}>{c}</Tag>)
            ) : (
              <Text type="secondary">No categories data found.</Text>
            )}
          </Card>
        </Col>

        <Col xs={24} sm={8}>
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
                <Title level={4}>{randomHighlight.name}</Title>
                <Text type="secondary">{randomHighlight.category}</Text>
                
                <Title level={5} style={{ color: '#fa8c16', margin: '8px 0' }}>
                  Rp {randomHighlight.price?.toLocaleString()}
                </Title>
                
                <Paragraph ellipsis={{ rows: 3 }}>
                    {randomHighlight.description}
                </Paragraph>
              </div>
            ) : (
              <Text type="secondary">No products available. Check API connection.</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const DashboardClient = (props) => (
  <App>
    <DashboardClientContent {...props} />
  </App>
);

export default DashboardClient;