import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from "recharts";

interface PropertyRow {
  id: string;
  title: string;
  price: number;
  views: number;
  status: string;
}

interface Props {
  listings: PropertyRow[];
}

const COLORS = [
  "hsl(25, 65%, 45%)",   // accent/chocolate
  "hsl(35, 80%, 55%)",   // caramel
  "hsl(25, 40%, 20%)",   // cocoa
  "hsl(30, 25%, 78%)",   // latte
  "hsl(25, 55%, 58%)",   // chocolate-light
];

export default function DashboardAnalytics({ listings }: Props) {
  const viewsData = useMemo(() =>
    listings
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6)
      .map((l) => ({
        name: l.title.length > 18 ? l.title.slice(0, 18) + "…" : l.title,
        views: l.views || 0,
      })),
    [listings]
  );

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((l) => {
      const s = l.status || "unknown";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [listings]);

  const priceDistribution = useMemo(() => {
    const ranges = [
      { label: "< $200K", min: 0, max: 200000 },
      { label: "$200K-$400K", min: 200000, max: 400000 },
      { label: "$400K-$600K", min: 400000, max: 600000 },
      { label: "$600K-$1M", min: 600000, max: 1000000 },
      { label: "$1M+", min: 1000000, max: Infinity },
    ];
    return ranges.map((r) => ({
      range: r.label,
      count: listings.filter((l) => l.price >= r.min && l.price < r.max).length,
    }));
  }, [listings]);

  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);
  const avgPrice = listings.length
    ? Math.round(listings.reduce((s, l) => s + l.price, 0) / listings.length)
    : 0;

  if (listings.length === 0) {
    return (
      <div className="mt-6 text-center py-12 text-muted-foreground">
        <p>No listing data to display analytics. Create some listings first!</p>
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Listings", value: listings.length },
          { label: "Total Views", value: totalViews.toLocaleString() },
          { label: "Avg. Price", value: `$${(avgPrice / 1000).toFixed(0)}K` },
          { label: "Active", value: listings.filter((l) => l.status === "active").length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="font-display text-2xl font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Views by Property */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-display text-lg font-semibold text-foreground mb-4">Views by Property</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={viewsData}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(25, 15%, 45%)" }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(25, 15%, 45%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(30, 15%, 91%)",
                  border: "1px solid hsl(30, 12%, 82%)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                }}
              />
              <Bar dataKey="views" fill="hsl(25, 65%, 45%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Distribution */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-display text-lg font-semibold text-foreground mb-4">Listing Status</h4>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Distribution */}
        <div className="rounded-xl border border-border bg-card p-5 md:col-span-2">
          <h4 className="font-display text-lg font-semibold text-foreground mb-4">Price Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={priceDistribution}>
              <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(25, 15%, 45%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(25, 15%, 45%)" }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "hsl(30, 15%, 91%)",
                  border: "1px solid hsl(30, 12%, 82%)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                stroke="hsl(25, 65%, 45%)"
                fill="hsl(25, 65%, 45%)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
