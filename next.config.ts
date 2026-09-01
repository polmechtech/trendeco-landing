import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/pila-formatowa-z-podcinaniem-do-plyt-meblowych-stol-wahadlowy-i-frezarski-2.html",
        destination: "/kategoria/pila-formatowa",
        permanent: true,
      },
      {
        source: "/pila-formatowa-z-podcinaniem-stol-wahadlowy-oklieniarka.html",
        destination: "/kategoria/pila-formatowa",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
