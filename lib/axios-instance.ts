import axios, { AxiosError } from "axios";
import { auth, signIn, signOut } from "./auth";
import { loginResponseSchema } from "@/schema/responseSchema/loginResponseSchema";
import refreshJWT from "@/actions/refreshJwtAction";
import { BACKEND_URL } from "./constants";
import { redirect } from "next/navigation";
import { signoutAction } from "@/actions/signoutAction";
const axiosInstance = (token: string | undefined, contentType?: string) => {
  const axiosPrivateInstance = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      "Content-Type": contentType || "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  axiosPrivateInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      console.log("original Request", originalRequest);

      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log("refreshh");

        try {
          const session = await auth();

          if (!session?.user) {
            return Promise.reject(error);
          }
          console.log("refreshhApi");

          const response = await axios({
            method: "post",
            baseURL: BACKEND_URL,
            url: "api/v1/auth/refresh",
            headers: {
              Authorization: `Bearer ${session.user.refreshToken}`,
              "Content-Type": "application/json",
            },
          });
          console.log("refreshhApiRes");
          console.log(response.data);

          const parsedData = await loginResponseSchema.safeParseAsync(
            response.data
          );

          console.log(parsedData.success);

          if (!parsedData.success) {
            return Promise.reject(error);
          }

          refreshJWT(parsedData.data);
          // Retry the original request with the new token
          console.log("new ac token", parsedData.data.jwttoken);

          originalRequest.headers.Authorization = `Bearer ${parsedData.data.jwttoken}`;
          return axios(originalRequest);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log("error from axios interceptors", error.response?.data);
          }
          //   await signoutAction();
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosPrivateInstance;
};

export default axiosInstance;
