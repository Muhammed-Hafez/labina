import { useRouter } from "next/router";
import AdminLayout from "./admin/layout/AdminLayout";
import ClientLayout from "./client/layout/ClientLayout";

function Layout({ children }: any) {
  const { pathname } = useRouter();

  if (pathname.match(/\/admin/)) {
    return <AdminLayout>{children}</AdminLayout>;
  } else {
    return <ClientLayout>{children}</ClientLayout>;
  }
}

export default Layout;
