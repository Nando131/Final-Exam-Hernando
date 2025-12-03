import DashboardClient from '../components/DashboardClient';
import api from '../utils/api';

async function getProducts() {
  try {
    const products = await api.getAllProducts();
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error("Server fetch failed on Dashboard page:", error.message);
    return [];
  }
}

export default async function DashboardPage() {
  const initialData = await getProducts();
  return <DashboardClient initialData={initialData} />;
}