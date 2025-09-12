"use client";
import React from "react";

export default function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <h1 className="text-xl font-bold text-primary">My App</h1>
        <nav className="space-x-4">
          <a href="/" className="hover:text-primary transition">
            Home
          </a>
          <a href="/login" className="hover:text-primary transition">
            Login
          </a>
        </nav>
      </div>
    </header>
  );
}
