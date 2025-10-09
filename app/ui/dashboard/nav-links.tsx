"use client";

import {
  ArchiveBoxIcon,
  BookOpenIcon,
  BriefcaseIcon,
  BuildingLibraryIcon,
  HomeIcon,
  HomeModernIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SideNavProps } from "./sidenav";

const links = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Libros", href: "/dashboard/books", icon: BookOpenIcon },
  { name: "Autores", href: "/dashboard/author", icon: UserGroupIcon },
  { name: "Facultades", href: "/dashboard/faculty", icon: HomeModernIcon },
  {
    name: "Carreras",
    href: "/dashboard/career",
    icon: BuildingLibraryIcon,
  },
  {
    name: "Especialidades",
    href: "/dashboard/specialty",
    icon: BriefcaseIcon,
  },
  { name: "Usuarios", href: "/dashboard/users", icon: UserIcon, role: "ADMIN" },
];

export default function NavLinks({ user }: SideNavProps) {
  const pathname = usePathname();

  // Filtra links según rol
  const filteredLinks = links.filter((link) => {
    if (link.role && link.role !== user.role) return false;
    return true;
  });

  return (
    <>
      {filteredLinks.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3",
              { "bg-sky-100 text-blue-600": pathname === link.href }
            )}
          >
            <LinkIcon className="w-6" />
            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
