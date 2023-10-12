import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import environment from "../environment";
import apiPaths from "../@types/enum/apiPaths";
import { useClientStore } from "../store/clientStore";
import { useAppStore } from "../store/appStore";
import { customId } from "../@types/stables";

const httpClient = axios.create({
  baseURL: environment.baseUrl,
  withCredentials: true,
});

export function httpClientSSR(req: any) {
  httpClient.defaults.baseURL = environment.changableBaseUrl;
  httpClient.defaults.headers.Cookie = req.headers.cookie;

  return httpClient;
}

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

  if (res.data.notify) {
    useAppStore.setState({
      notifyList: [
        ...useAppStore.getState().notifyList,
        {
          _id: customId(),
          message: res.data.message ?? "Success",
          type: "success",
        },
      ],
    });
  }

  return Promise.resolve(res);
};

const responseError = async (error: any) => {
  switch (error?.response?.status) {
    case 400:
    case 409:
      useAppStore.setState({
        notifyList: [
          ...useAppStore.getState().notifyList,
          {
            _id: customId(),
            message: error?.response?.data.message ?? "Error",
            type: "error",
          },
        ],
      });
      break;
    default:
      if (error?.response?.data.notify) {
        useAppStore.setState({
          notifyList: [
            ...useAppStore.getState().notifyList,
            {
              _id: customId(),
              message: error?.response?.data.message ?? "Error",
              type: "error",
            },
          ],
        });
      }
      break;
  }

  if (error?.response?.status === 401 && !useClientStore.getState().isRefresh) {
    useClientStore.setState({ isRefresh: true });

    try {
      const resp =
        typeof window === "undefined"
          ? await httpClient.post(
              apiPaths.refresh,
              {},
              {
                withCredentials: true,
                headers: {
                  Cookie: error.request._headers.cookie,
                },
              }
            )
          : await httpClient.post(apiPaths.refresh);

      if (await resp.data.data.token) {
        useClientStore.setState({
          userInfo: await resp.data.data,
        });

        error.config.headers.authorization = `Bearer ${await resp.data.data
          .token}`;
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

const clientReqCeptor = httpClient.interceptors.request.use(
  request,
  requestError
);
const clientResCeptor = httpClient.interceptors.response.use(
  response,
  responseError
);

export default httpClient;
