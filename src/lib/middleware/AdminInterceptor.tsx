import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import apiPaths from "../@types/enum/apiPaths";
import { useAdminStore } from "../store/adminStore";
import httpAdmin from "./httpAdmin";

function AdminInterceptor({ children }: any) {
  const router = useRouter();

  const request = (req: InternalAxiosRequestConfig) => {
    clearTimeout(useAdminStore.getState().adminTimeout);
    useAdminStore.setState({
      isHttpAdminLoading: true,
    });

    if (useAdminStore.getState().adminInfo?.token) {
      req.headers.authorization = `Bearer ${
        useAdminStore.getState().adminInfo?.token
      }`;
    }

    return Promise.resolve(req);
  };

  const requestError = (error: any) => {
    useAdminStore.setState({
      adminTimeout: setTimeout(() => {
        useAdminStore.setState({ isHttpAdminLoading: false });
      }, 1),
    });
    return Promise.reject(error);
  };

  const response = (res: AxiosResponse) => {
    useAdminStore.setState({
      adminTimeout: setTimeout(() => {
        useAdminStore.setState({
          isHttpAdminLoading: false,
          isAdminRefresh: false,
        });
      }, 1),
    });
    return Promise.resolve(res);
  };

  const responseError = async (error: any) => {
    if (
      error?.response?.status === 401 &&
      !useAdminStore.getState().isAdminRefresh
    ) {
      useAdminStore.setState({ isAdminRefresh: true });

      try {
        const { data } = await httpAdmin.post(apiPaths.refreshAdmin);
        if (await data.data.token) {
          useAdminStore.setState({ adminInfo: await data.data });

          error.headers = {
            ...error.headers,
            authorization: `Bearer ${await data.data.token}`,
          };
        }
        useAdminStore.setState({
          adminTimeout: setTimeout(() => {
            useAdminStore.setState({
              isHttpAdminLoading: false,
            });
          }, 1),
        });
        return await httpAdmin(error.config);
      } catch (error) {
        useAdminStore.setState({ adminInfo: undefined });
      }
    }
    useAdminStore.setState({
      adminTimeout: setTimeout(() => {
        useAdminStore.setState({
          isHttpAdminLoading: false,
          isAdminRefresh: false,
        });
      }, 1),
    });
    return await Promise.reject(error);
  };

  useEffect(() => {
    const adminReqCeptor = httpAdmin.interceptors.request.use(
      request,
      requestError
    );
    const adminResCeptor = httpAdmin.interceptors.response.use(
      response,
      responseError
    );

    return () => {
      httpAdmin.interceptors.request.eject(adminReqCeptor);
      httpAdmin.interceptors.response.eject(adminResCeptor);
    };
  }, []);

  return children;
}

export default AdminInterceptor;
