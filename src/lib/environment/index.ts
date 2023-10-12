const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const environment = {
  // baseUrl: isDev
  //   ? "http://localhost:6500/api"
  //   : "https://hajarafa.triangles-eg.com/api",

  baseUrl: "/api",
  changableBaseUrl: "https://hajarafa.triangles-eg.com/api",
  changableSocketUrl: "https://hajarafa.triangles-eg.com",
  // changableBaseUrl: isDev
  //   ? "http://localhost:6500/api"
  //   : "https://hajarafa.triangles-eg.com/api",
  // changableSocketUrl: isDev
  //   ? "http://localhost:8500"
  //   : "https://hajarafa.triangles-eg.com",
};

export default environment;
