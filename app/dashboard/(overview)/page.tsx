import CardWrapper from "@/app/ui/dashboard/cards";
import LatestBooks from "@/app/ui/dashboard/latest-books";
import RevenueChart from "@/app/ui/dashboard/revenue-chart";
import { nunito } from "@/app/ui/fonts";
import {
  CardsSkeleton,
  LatestBooksSkeleton,
  RevenueChartSkeleton,
} from "@/app/ui/skeletons";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Dashboard",
};

export const dynamic = "force-dynamic";

export default async function Page() {
  return (
    <main className="md:overflow-y-auto h-full">
      <h1 className={`${nunito.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}>
          <RevenueChart />
        </Suspense>
        <Suspense fallback={<LatestBooksSkeleton />}>
          <LatestBooks />
        </Suspense>
      </div>
    </main>
  );
}
