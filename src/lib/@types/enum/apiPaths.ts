const enum apiPaths {
  getAllLanguages = "/language",
  getCart = "/cart",
  refresh = "/user/refresh",
  login = "/user/login",
  logout = "/user/logout",
  register = "/user/register",
  refreshAdmin = "/admin/refresh",
  loginAdmin = "/admin/login",
  logoutAdmin = "/admin/logout",
  admin = "/admin",
  category = "/category",
  getCategoryBySlug = "/category/slug",
  product = "/product",
  newProductList = "/product/new?populate=true",
  newProductListHome = "/product/new?populate=true&home=true",
  featuredProductList = "/product/featured?populate=true",
  featuredProductListHome = "/product/featured?populate=true&home=true",
  recipe = "/recipe",
  country = "/country",
  city = "/city",
  area = "/area",
  address = "/address",
  payment = "/payment",
  addCardSession = "/payment/session",
  getRecipesForHomepage = "/recipe?showInHome=true",
  getRecipesForAdmin = "/recipe/full",
  initAuthPayment = "/payment/initAuth",
  order = "/order",
  orderUser = "/order/user",
  orderFull = "/order/f",
  orderGuest = "/order/guest",
  orderSuccess = "/order/success",
  updateUserInfo = "/user/account",
  updateUserPassword = "/user/account/password",
}

export default apiPaths;
