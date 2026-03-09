import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface PropertyRow {
  id: string;
  title: string;
  price: number;
  views: number;
  status: string;
}

interface SavesCount {
  property_id: string;
  saves_count: number;
}

interface Props {
  listings: PropertyRow[];
  savesData?: SavesCount[];
}

const COLORS = [
  "hsl(25, 65%, 45%)",
  "hsl(35, 80%, 55%)",
  "hsl(25, 40%, 20%)",
  "hsl(30, 25%, 78%)",
  "hsl(25, 55%, 58%)",
];

export default function DashboardAnalytics({ listings, savesData = [] }: Props) {
  const savesMap = useMemo(() => {
    const map: Record<string, number> = {};
    savesData.forEach((s) => { map[s.property_id] = s.saves_count; });
    return map;
  }, [savesData]);

  const viewsData = useMemo(() =>
    listings
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6)
      .map((l) => ({
        name: l.title.length > 18 ? l.title.slice(0, 18) + "…" : l.title,
        views: l.views || 0,
        saves: savesMap[l.id] || 0,
      })),
    [listings, savesMap]
  );

  const statusData = useMemo(() => {
    const counts: Record<string, number> = {};
    listings.forEach((l) => {
      const s = l.status || "unknown";
      counts[s] = (counts[s] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [listings]);

  const totalViews = listings.reduce((s, l) => s + (l.views || 0), 0);
  const totalSaves = savesData.reduce((s, d) => s + d.saves_count, 0);
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
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {[
          { label: "Total Listings", value: listings.length },
          { label: "Total Views", value: totalViews.toLocaleString() },
          { label: "Total Saves", value: totalSaves.toLocaleString() },
          { label: "Avg. Price", value: `$${(avgPrice / 1000).toFixed(0)}K` },
          { label: "Active", value: listings.filter((l) => l.status === "active").length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 text-center">
            <p className="font-display text-3xl font-bold text-foreground">{s.value}</p>
            <p className="text-sm font-medium text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-display text-xl font-bold text-foreground mb-4">Views & Saves by Property</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={viewsData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} angle={-20} textAnchor="end" height={60} />
              <YAxis tick={{ fontSize: 12, fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(30, 15%, 91%)",
                  border: "1px solid hsl(30, 12%, 82%)",
                  borderRadius: "0.75rem",
                  fontSize: "0.8rem",
                }}
              />
              <Bar dataKey="views" fill="hsl(25, 65%, 45%)" radius={[6, 6, 0, 0]} name="Views" />
              <Bar dataKey="saves" fill="hsl(35, 80%, 55%)" radius={[6, 6, 0, 0]} name="Saves" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h4 className="font-display text-xl font-bold text-foreground mb-4">Listing Status</h4>
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
      </div>
    </div>
  );
}
