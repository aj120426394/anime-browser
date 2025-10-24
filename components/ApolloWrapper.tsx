"use client";

import { ApolloProvider } from "@apollo/client";
import apolloClient from "@/lib/graphql/client";
import { ReactNode } from "react";

export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={apolloClient}>{children}</ApolloProvider>;
}
