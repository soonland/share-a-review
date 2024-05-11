import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";

import App from "@/components/App";
import { ThemeProvider } from "@/components/context/ThemeProvider";

function _App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session} refetchOnWindowFocus={false}>
      <ThemeProvider>
        <App pageProps={pageProps} Component={Component} />
      </ThemeProvider>
    </SessionProvider>
  );
}

export default _App;
