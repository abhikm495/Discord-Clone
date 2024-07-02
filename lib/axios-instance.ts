import axios, { AxiosError } from "axios";
import { auth, signIn } from "./auth";
import { loginResponseSchema } from "@/schema/responseSchema/loginResponseSchema";
import refreshJWT from "@/actions/refreshJwtAction";
// import signOutAction from "@/actions/signOutAction";
import { BACKEND_URL } from "./constants";
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
      console.log(originalRequest);

      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const session = await auth();

          if (!session?.user) {
            return Promise.reject(error);
          }

          const response = await axios({
            method: "post",
            baseURL: BACKEND_URL,
            url: "api/v1/auth/refresh",
            headers: {
              Authorization: `Bearer ${session.user.refreshToken}`,
            },
          });
          const parsedData = await loginResponseSchema.safeParseAsync(
            response.data
          );
          if (!parsedData.success) {
            return Promise.reject(error);
          }

          refreshJWT(parsedData.data);
          // Retry the original request with the new token
          originalRequest.headers.Authorization = `Bearer ${parsedData.data.jwttoken}`;
          return axios(originalRequest);
        } catch (error) {
          if (error instanceof AxiosError) {
            console.log("error from axios interceptors", error.response?.data);
            // await signOutAction();
          }
          // Handle refresh token error or redirect to login
        }
      }
      return Promise.reject(error);
    }
  );

  return axiosPrivateInstance;
};

export default axiosInstance;

// export const testAxiosInstance = (serviceType: keyof typeof serviceBaseUrl) => {
//   const axiosInstance = axios.create({
//     baseURL: serviceBaseUrl[serviceType],
//   });

//   axiosInstance.interceptors.request.use(async (config) => {
//     const session = await auth();
//     if (session?.user) {
//       config.headers.Authorization = `Bearer ${session.user.jwtToken}`;
//     }
//     return config;
//   });

//   axiosInstance.interceptors.response.use(
//     (response) => {
//       return response;
//     },
//     async (error) => {
//       const originalRequest = error.config;

//       // If the error status is 401 and there is no originalRequest._retry flag,
//       // it means the token has expired and we need to refresh it
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;

//         try {
//           const session = await auth();

//           if (!session?.user) {
//             return Promise.reject(error);
//           }

//           const response = await axios({
//             method: "post",
//             baseURL: serviceBaseUrl.auth,
//             url: "/refresh-token",
//             data: {
//               token: session.user.refreshToken,
//             },
//           });
//           const parsedData = await loginResponseSchema.safeParseAsync(
//             response.data
//           );
//           if (!parsedData.success) {
//             return Promise.reject(error);
//           }

//           await signIn("credentials", {
//             jwtToken: parsedData.data.jwttoken,
//             refreshToken: parsedData.data.refreshtoken,
//             ...parsedData.data.user,
//           });

//           // Retry the original request with the new token
//           originalRequest.headers.Authorization = `Bearer ${parsedData.data.jwttoken}`;
//           return axios(originalRequest);
//         } catch (error) {
//           // Handle refresh token error or redirect to login
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return axiosInstance;
// };
