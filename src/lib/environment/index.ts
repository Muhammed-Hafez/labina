const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";

const environment = {
  // baseUrl: isDev
  //   ? "http://localhost:6500/api"
  //   : "https://labina.triangles-eg.com/api",

  baseUrl: "/api",
  changableBaseUrl: "https://labina.triangles-eg.com/api",
  changableSocketUrl: "https://labina.triangles-eg.com",
  // changableBaseUrl: isDev
  //   ? "http://localhost:6500/api"
  //   : "https://labina.triangles-eg.com/api",
  // changableSocketUrl: isDev
  //   ? "http://localhost:8500"
  //   : "https://labina.triangles-eg.com",
};

export default environment;
