"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumbs() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href="/dashboard">Dashboard</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {usePathname()
          .split("/")
          .slice(2)
          .map((segment, index, array) => {
            const path = `/dashboard/${array.slice(0, index + 1).join("/")}`;
            const isLast = index === array.length - 1;
            const title = segment.charAt(0).toUpperCase() + segment.slice(1);

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link href={path}>{title}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
