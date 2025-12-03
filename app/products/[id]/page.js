import { Alert, Card, Typography, Descriptions } from 'antd';
import Link from 'next/link';
import api from '../../utils/api'; 

const { Title, Text, Paragraph } = Typography;

async function getProductDetail(id) {
  return await api.getProductDetail(id);
}

export default async function ProductDetailPage({ params }) {
    const { id } = await params
  if (!id) {
    return (
      <div style={{ padding: 20 }}>
        <Alert title="Invalid Product ID" type="error" showIcon /> 
        <Link href="/products" style={{ display: 'block', marginTop: 16 }}>Back to List</Link>
      </div>
    );
  }
  
  const product = await getProductDetail(id);

  if (!product) {
    return (
      <div style={{ padding: 20 }}>
        <Alert title="Product Not Found" type="error" showIcon /> 
        <Link href="/products" style={{ display: 'block', marginTop: 16 }}>Back to List</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <Title level={2}>{product.name}</Title>
      
      <Card style={{ marginBottom: 20 }}>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="Price">
            <Text strong style={{ color: '#fa8c16' }}>Rp {product.price?.toLocaleString()}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Stock">{product.stock}</Descriptions.Item>
          <Descriptions.Item label="Category">{product.category}</Descriptions.Item>
          <Descriptions.Item label="ID">{product.id}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title="Description" style={{ marginBottom: 20 }}>
        <Paragraph>{product.description}</Paragraph>
      </Card>
      
      {product.image && (
        <Card title="Image">
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }} 
          />
        </Card>
      )}

      <Link href="/products" style={{ display: 'block', marginTop: 20 }}>← Back to List</Link>
    </div>
  );
}