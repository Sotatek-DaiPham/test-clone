import { API_PATH } from "@/constant/api-path";
import { clearUser, setUser } from "@/libs/slices/userSlice";
import makeStore from "@/libs/store";
import axios, { AxiosRequestConfig } from "axios";
import { get } from "lodash";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ENDPOINT_URL || "",
  // headers: {
  //   "X-TIME-ZONE": new Date().getTimezoneOffset(),
  // },
});

// if the api no need token put it in here.
// const whiteList = [API_PATH.AUTH.REFRESH_TOKEN];

const refreshExpiredTokenClosure = () => {
  let isCalled = false;
  let runningPromise: any = undefined;
  return () => {
    if (isCalled) {
      return runningPromise;
    } else {
      isCalled = true;
      runningPromise = axiosInstance?.post(API_PATH.AUTH.REFRESH_TOKEN, {
        refreshToken: localStorage.getItem("refreshToken"),
      });
      runningPromise.finally(() => {
        isCalled = false;
      });
      return runningPromise;
    }
  };
};

// stores the function returned by refreshExpiredTokenClosure
const refreshExpiredToken = refreshExpiredTokenClosure();

axiosInstance.interceptors.request.use(
  (config) => {
    if (!navigator.onLine) {
      const action = config.headers["action"];
      if (action) toast.error(`There was a network error`);
      throw new Error("Network Error", { cause: "offline" });
    }

    const accessToken = makeStore.getState().user.accessToken;
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // }
    // if (config.url === API_PATH.AUTH.REFRESH_TOKEN || !accessToken) {
    // delete config.headers["Authorization"];
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const handleSesstionExpired = () => {
  localStorage.clear();
  // store.dispatch(openModal("dialog:SessionExpired"));
  // store.dispatch(rememberPassword(false));
};

const handleRefreshTokenExpired = () => {
  localStorage.clear();
  // store.dispatch(openModal("dialog:SessionExpired"));
};

axiosInstance.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    // logout user's session if refresh token api responds 401 UNAUTHORIZED
    const httpStatus = err.response?.status;
    const message = err.response?.data?.message;
    // if (httpStatus === 401 || message === "Unauthorized") {
    //   makeStore.dispatch(clearUser());
    // }
    // if request fails with 401 UNAUTHORIZED status
    // then it calls the api to generate new access token
    // const { isRememberPassword } = store.getState().settings;
    // const lastUserActiveDate = localStorage.getItem(
    //   LocalStorageKeys.LAST_USER_ACTIVE
    // );
    // const isActiveUserDateValid: boolean =
    //   dayjs().diff(lastUserActiveDate, "m") <
    //   (import.meta.env.VITE_ACCESS_TOKEN_TIME || 1440); // mins

    if (message === "Unauthorized") {
      try {
        const response = await refreshExpiredToken();
        const updateToken = get(response, "data.data.user.accessToken");
        if (updateToken) {
          const user = response.data.data;
          originalConfig.headers[
            "Authorization"
          ] = `Bearer ${user.refresh_token}`;
          return axiosInstance(originalConfig);
        }
        handleSesstionExpired();
        return Promise.reject(err);
      } catch (_error) {
        handleSesstionExpired();
        return Promise.reject(_error);
      }
    } else if (httpStatus === 401) {
      makeStore.dispatch(clearUser());
    }
    return Promise.reject(err);
  }
);

export const getAPI = (
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => {
  return axiosInstance.get(url, config);
};
export const postAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
) => {
  return axiosInstance.post(url, data, config);
};

export const postFormDataAPI = (url: string, data?: any, config?: any) => {
  return axiosInstance.post(url, data, config);
};

export const putAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
) => {
  return axiosInstance.put(url, data, config);
};
export const patchAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined
) => {
  return axiosInstance.patch(url, data, config);
};
export const deleteAPI = (
  url: string,
  config?: AxiosRequestConfig<any> | undefined
) => {
  return axiosInstance.delete(url, config);
};

export const fetcher = (data: string[]) => {
  const [url, token, params] = data;
  if (url) {
    return axiosInstance
      .get(url, {
        params,
        headers: { Authorization: "Bearer " + token },
      })
      .then((res) => res.data.data);
  }
};
