import FooterProto from "@/components/Footer.Proto";
import MainNavbarProto from "@/components/Navbar.Proto";
import NavBarProtoV1 from "@/components/Navbar.Proto.v1";
import { SidebarDemo } from "../home/SideBarDemo";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="  min-h-screen min-w-full bg-background-deemphasized">
      <NavBarProtoV1></NavBarProtoV1>
      <SidebarDemo>
        <div>{children}</div>
      </SidebarDemo>
      <FooterProto></FooterProto>
    </div>
  );
}
