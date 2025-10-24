"use client";

import { ReactNode } from "react";
import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "@/lib/graphql/client";

const client = createApolloClient();

/**
 * Apollo Provider wrapper component
 * Wraps the app with Apollo Client context
 */
export function ApolloWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
