"use client";
import Checkout from "@/components/ui/CheckOut/Checkout";
import cartService from "@/services/cartService";
import { getUserCoupons } from "@/services/userService";
import React, { useEffect, useState } from "react";

const CheckoutPage = () => {
  const [cart, setCart] = useState({});
  const [coupons, setCoupons] = useState({});

  const fetchCoupons = async () => {
    try {
      const data = await getUserCoupons();
      setCoupons(data.myCoupons);
      console.log(Array.isArray(data.myCoupons));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCart = async () => {
    try {
      const data = await cartService.getCartForCheckout();
      setCart(data.cart);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchCoupons();
  }, []);
  return (
    <Checkout onCartUpdate={fetchCart} cart={cart} coupons={coupons}></Checkout>
  );
};

export default CheckoutPage;
