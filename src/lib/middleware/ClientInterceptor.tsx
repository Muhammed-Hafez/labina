import {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { useRouter } from "next/router";
import { useEffect } from "react";
import apiPaths from "../@types/enum/apiPaths";
import { useClientStore } from "../store/clientStore";
import httpClient from "./httpClient";

function ClientInterceptor({ children }: any) {
  const router = useRouter();

  const request = (req: InternalAxiosRequestConfig) => {
    clearTimeout(useClientStore.getState().clientTimeout);
    useClientStore.setState({
      isHttpClientLoading: true,
    });

    if (useClientStore.getState().userInfo?.token) {
      req.headers.authorization = `Bearer ${
        useClientStore.getState().userInfo?.token
      }`;
    }

    return Promise.resolve(req);
  };

  const requestError = (error: any) => {
    useClientStore.setState({
      clientTimeout: setTimeout(() => {
        useClientStore.setState({ isHttpClientLoading: false });
      }, 1),
    });
    return Promise.reject(error);
  };

  const response = (res: AxiosResponse) => {
    useClientStore.setState({
      clientTimeout: setTimeout(() => {
        useClientStore.setState({
          isHttpClientLoading: false,
          isRefresh: false,
        });
      }, 1),
    });
    return Promise.resolve(res);
  };

  const responseError = async (error: any) => {
    if (
      error?.response?.status === 401 &&
      !useClientStore.getState().isRefresh
    ) {
      useClientStore.setState({ isRefresh: true });

      try {
        const { data } = await httpClient.post(apiPaths.refresh);
        if (await data.data.token) {
          useClientStore.setState({
            userInfo: await data.data,
          });

          error.headers = {
            ...error.headers,
            authorization: `Bearer ${await data.data.token}`,
          };
        }
        return await httpClient(error.config);
      } catch (error) {
        useClientStore.setState({
          userInfo: undefined,
        });
      }
    }
    useClientStore.setState({
      clientTimeout: setTimeout(() => {
        useClientStore.setState({
          isHttpClientLoading: false,
          isRefresh: false,
        });
      }, 1),
    });
    return await Promise.reject(error);
  };

  useEffect(() => {
    const clientReqCeptor = httpClient.interceptors.request.use(
      request,
      requestError
    );
    const clientResCeptor = httpClient.interceptors.response.use(
      response,
      responseError
    );

    return () => {
      httpClient.interceptors.request.eject(clientReqCeptor);
      httpClient.interceptors.response.eject(clientResCeptor);
    };
  }, []);

  return children;
}

export default ClientInterceptor;
