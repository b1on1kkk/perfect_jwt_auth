"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

const Tanstack_provider: React.FC<
  Readonly<{
    children: React.ReactNode;
  }>
> = ({ children }) => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default Tanstack_provider;
