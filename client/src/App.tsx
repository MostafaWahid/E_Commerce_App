import { useAuth } from "@clerk/react";
import PageLoader from "./components/PageLoader";
import Layout from "./components/Layout";
import { Navigate, Route, Routes } from "react-router";
import HomePage from "./features/Home/HomePage";
import CartPage from "./features/Cart/CartPage";
import OrdersPage from "./features/Order/OrdersPage";
import CheckoutReturnPage from "./features/Checkout/CheckoutReturnPage";
import ProductDetailPage from "./features/Product/ProductDetailPage";
import OrderDetailPage from "./features/Order/OrderDetailPage";
import OrderSummaryPage from "./features/Order/OrderSummaryPage";
import OrderChatPage from "./features/Order/OrderChatPage";
import OrderVideoPage from "./features/Order/OrderVideoPage";

import AdminProductsPage from "./features/admin/AdminProductsPage";
function App() {
  const { isLoaded, isSignedIn } = useAuth();
  if (!isLoaded) return <PageLoader />;
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/orders"
            element={
              isSignedIn ? <OrdersPage /> : <Navigate to={"/"} replace />
            }
          />
          <Route path="/checkout/return" element={<CheckoutReturnPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route
            path="/orders/:id/call"
            element={
              isSignedIn ? <OrderVideoPage /> : <Navigate to={"/"} replace />
            }
          />
          
        <Route
          path="/admin"
          element={isSignedIn ? <AdminProductsPage /> : <Navigate to="/" replace />}
        /> 

          <Route path="/orders/:id" element={<OrderDetailPage />}>
            <Route index element={<OrderSummaryPage />} />
            <Route path="chat" element={<OrderChatPage />} />
          </Route>
          {/* 
    
     

        <Route path="/demo-sentry" element={<SentryDemoPage />} />

        <Route
          path="/orders/:id/call"
          element={isSignedIn ? <OrderVideoPage /> : <Navigate to={"/"} replace />}
        />

        <Route
          path="/admin"
          element={isSignedIn ? <AdminProductsPage /> : <Navigate to="/" replace />}
        /> */}

          {/* NESTED ROUTES */}
          {/* <Route path="/orders/:id" element={<OrderDetailPage />}>
          <Route index element={<OrderSummaryPage />} />
          <Route path="chat" element={<OrderChatPage />} />
        </Route> */}
        </Routes>
      </Layout>
    </>
  );
}

export default App;
