import { Inter } from "next/font/google";
import "./globals.css";
import { ConfigProvider, App } from "antd"; 
import StyledComponentsRegistry from "./components/AntdRegistry"; 
import Navbar from "./components/Navbar";
import { GlobalProvider } from "./context/GlobalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Summit Course App",
  description: "Product Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StyledComponentsRegistry>
          <GlobalProvider>
            <ConfigProvider 
              theme={{ token: { colorPrimary: '#1677ff' } }}
            >
              <App 
                style={{ minHeight: '100vh', background: '#f0f2f5' }}
                message={{ duration: 2, maxCount: 3 }} // Config notif global
              >
                <Navbar />
                <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
                  {children}
                </main>
              </App>
            </ConfigProvider>
          </GlobalProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}