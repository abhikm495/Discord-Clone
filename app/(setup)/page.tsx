// import { initialProfile } from "@/lib/initial-profile";
import { redirect } from "next/navigation";
import { InitialModel } from "@/components/modals/initial-model";
import { auth } from "@/lib/auth";
const SetupPage = async () => {
  const session = await auth();
  if (!session) return redirect("/sign-in");
  // const server = await db.server.findFirst({
  //   where: {
  //     members: {
  //       some: {
  //         profileId: profile?.id,
  //       },
  //     },
  //   },
  // });
  // if (server) {
  //   return redirect(`/servers/${server.id}`);
  // }
  return <InitialModel />;
};

export default SetupPage;
