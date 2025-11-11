"use client";
import Cart from "@/components/ui/ShoppingCart/Cart";
import React, { useEffect, useState } from "react";

const CartPage = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {}, []);
  // if (isLoading) return <Loading />;
  return <Cart></Cart>;
};

export default Cart;
