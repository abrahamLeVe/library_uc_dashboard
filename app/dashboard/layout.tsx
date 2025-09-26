
import { auth } from "@/auth";
import SideNav from "../ui/dashboard/sidenav";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) return <div>Not authenticated</div>;

  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-60">
        <SideNav user={session.user} />
      </div>
      <div className="flex-grow p-6 overflow-x-hidden">{children}</div>
    </div>
  );
}
