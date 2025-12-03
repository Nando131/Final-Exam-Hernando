'use client';
import { Menu, Switch } from 'antd';
import { DashboardOutlined, ShopOutlined, BulbOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGlobal } from '../context/GlobalContext';

const Navbar = () => {
  const pathname = usePathname();
  const { isDarkMode, toggleTheme } = useGlobal();

  const items = [
    {
      label: <Link href="/dashboard">Dashboard</Link>,
      key: '/dashboard',
      icon: <DashboardOutlined />,
    },
    {
      label: <Link href="/products">Products</Link>,
      key: '/products',
      icon: <ShopOutlined />,
    },
  ];

  return (
    <div style={{ background: '#fff', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 8px #f0f1f2' }}>
      <div style={{ fontWeight: 'bold', fontSize: '18px' }}>SummitStore</div>
      <Menu mode="horizontal" selectedKeys={[pathname]} items={items} style={{ flex: 1, borderBottom: 'none', justifyContent: 'center' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span>Theme</span>
        <Switch checkedChildren={<BulbOutlined />} unCheckedChildren={<BulbOutlined />} checked={isDarkMode} onChange={toggleTheme} />
      </div>
    </div>
  );
};

export default Navbar;