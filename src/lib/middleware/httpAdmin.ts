import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import environment from "../environment";
import apiPaths from "../@types/enum/apiPaths";
import { useAdminStore } from "../store/adminStore";
import { useAppStore } from "../store/appStore";
import { customId } from "../@types/stables";

const httpAdmin = axios.create({
  baseURL: environment.baseUrl,
  withCredentials: true,
});

export function httpAdminSSR(req: any) {
  httpAdmin.defaults.baseURL = environment.changableBaseUrl;
  httpAdmin.defaults.headers.Cookie = req.headers.cookie;

  return httpAdmin;
}

const request = (req: InternalAxiosRequestConfig) => {
  clearTimeout(useAdminStore.getState().adminTimeout);
  useAdminStore.setState({
    isHttpAdminLoading: true,
  });

  if (useAdminStore.getState().adminInfo) {
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
    case 404:
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

  if (
    error?.response?.status === 401 &&
    !useAdminStore.getState().isAdminRefresh
  ) {
    useAdminStore.setState({ isAdminRefresh: true });

    try {
      const resp =
        typeof window === "undefined"
          ? await httpAdmin.post(
              apiPaths.refreshAdmin,
              {},
              {
                withCredentials: true,
                headers: {
                  Cookie: error.request._headers.cookie,
                },
              }
            )
          : await httpAdmin.post(apiPaths.refreshAdmin);

      if (await resp.data.data.token) {
        useAdminStore.setState({ adminInfo: await resp.data.data });

        error.config.headers.authorization = `Bearer ${await resp.data.data
          .token}`;
      }
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

const adminReqCeptor = httpAdmin.interceptors.request.use(
  request,
  requestError
);
const adminResCeptor = httpAdmin.interceptors.response.use(
  response,
  responseError
);

export default httpAdmin;
