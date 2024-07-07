// import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModel } from "@/components/modals/initial-model";
import { auth, signOut } from "@/lib/auth";
import axiosInstance from "@/lib/axios-instance";
import { userFirstServerResponseSchema } from "@/schema/responseSchema/usersFirstServerResponseSchema";
import { AxiosError } from "axios";

const SetupPage = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  let url = "";
  try {
    const { data } = await axiosInstance(session.user.jwtToken).get(
      "api/v1/servers/first"
    );
    const parsedData = await userFirstServerResponseSchema.safeParseAsync(data);
    if (!parsedData.success) {
      console.log(`Parsing Error: ${[parsedData.error]} `);
      return;
    }

    if (!parsedData.data.success) {
      return <InitialModel />;
    }
    url = `/servers/${parsedData.data.data.serverId}`;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("error from axios interceptors", error.response?.data);
      return;
    }
    console.log(error);
  } finally {
    if (url !== "") return redirect(url);
  }
};

export default SetupPage;
