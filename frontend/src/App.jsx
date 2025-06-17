import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from './components/Layout/UserLayout'
import Home from './Pages/Home'
import { Toaster } from "sonner";
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import CollectionPage from './Pages/CollectionPage';
import ProductDetails from './components/Products/ProductDetails';
import Checkout from './components/Cart/Checkout';
import OrderConformationPage from './Pages/OrderConformationPage';
import OrderDetailsPage from './Pages/OrderDetailsPage';
import MyOrdersPage from './Pages/MyOrdersPage';
import AdminLayout from './components/Admin/AdminLayout';
import AdminHomePage from './Pages/AdminHomePage';
import UserManagement from './components/Admin/UserManagement';
import ProductManagement from './components/Admin/ProductManagement';
import EditProductPage from './components/Admin/EditProductPage.jsx';
import OrderManagement from './components/Admin/OrderManagement';

import { Provider } from "react-redux";
import store from "./redux/store.js"
import ProtectedRoutes from './components/Common/ProtectedRoutes.jsx';
import ScrollToTopButton from './components/Common/ScrollToTopButton.jsx';

function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
      
      <ScrollToTopButton />

        <Toaster position='top-right' />
        <Routes>
          <Route path='/' element={<UserLayout />}> 
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='profile' element={<Profile />} />
            <Route path='collections/:collection' element={<CollectionPage />} />
            <Route path='product/:id' element={<ProductDetails />} />
            <Route path='checkout' element={<Checkout />} />
            <Route path='order-conformation' element={<OrderConformationPage />} />
            <Route path='order/:id' element={<OrderDetailsPage />} />
            <Route path='my-orders' element={<MyOrdersPage />} />
          </Route>
          <Route path='/admin' element={<ProtectedRoutes role="admin"><AdminLayout /></ProtectedRoutes>}>
            <Route index element={<AdminHomePage />} />
            <Route path='users' element={<UserManagement />} />
            <Route path='products' element={<ProductManagement />} />
            <Route path='products/:id/edit' element={<EditProductPage />} />
            <Route path='orders' element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App
