"use client";

import dynamic from "next/dynamic";

const PieChart = dynamic(
    () => import("@mui/x-charts").then((mod) => mod.PieChart),
    { ssr: false }
);


export default function PieChartComponent({ selectedData }) {
    return (

        <PieChart
            series={[
                {
                    data: selectedData,
                },
            ]}
            width={800}
            height={200}
            className="w-full sm:max-w-lg lg:max-w-4xl"
        />
    );
}
