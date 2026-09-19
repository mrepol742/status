export const revalidate = 60;

import Navbar from "@/components/layout/Navbar";

const API_URL = "https://stats.uptimerobot.com/api/getMonitorList/IZwUI4mLcR";

type DailyRatio = { date: string; ratio: string; color: string };
type Monitor = {
  monitorId: number;
  name: string;
  type: string;
  statusClass: string;
  dailyRatios: DailyRatio[];
  ratio: { ratio: string };
  "30dRatio": { ratio: string };
  "90dRatio": { ratio: string };
  lastDowntime: { date: string; duration: number; reason: string } | null;
};

async function getMonitors(): Promise<Monitor[]> {
  try {
    const response = await fetch(API_URL, { next: { revalidate } });
    if (!response.ok) return [];
    const data = await response.json();
    return data.data ?? [];
  } catch {
    return [];
  }
}

function formatDuration(seconds: number) {
  const minutes = Math.max(1, Math.round(seconds / 60));
  return `${minutes} minute${minutes === 1 ? "" : "s"}`;
}

function formatIncidentDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const incidentDay = new Date(date);
  incidentDay.setHours(0, 0, 0, 0);
  const daysAgo = Math.round(
    (today.getTime() - incidentDay.getTime()) / 86_400_000,
  );
  const fullDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);

  if (daysAgo === 0) return `today (${fullDate})`;
  if (daysAgo === 1) return `yesterday (${fullDate})`;
  if (daysAgo > 1 && daysAgo <= 7) {
    const weekday = new Intl.DateTimeFormat("en-US", {
      weekday: "long",
    }).format(date);
    return `last ${weekday} (${fullDate})`;
  }

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatIncidentReason(reason: string) {
  const cleaned = reason.trim().replace(/[_-]+/g, " ");
  if (!cleaned || /^(unknown|n\/?a|none)$/i.test(cleaned)) {
    return "an unspecified issue";
  }
  return cleaned.charAt(0).toLowerCase() + cleaned.slice(1);
}

export default async function Home() {
  const monitors = await getMonitors();
  const operational = monitors.filter(
    (monitor) => monitor.statusClass === "success",
  ).length;
  const allOperational = monitors.length > 0 && operational === monitors.length;
  const recentInterruptions = monitors.filter(
    (monitor) => monitor.lastDowntime,
  ).length;
  const average90DayUptime = monitors.length
    ? monitors.reduce(
        (total, monitor) =>
          total + (Number.parseFloat(monitor["90dRatio"].ratio) || 0),
        0,
      ) / monitors.length
    : null;

  return (
    <main className="page-shell">
      <Navbar />

      <section className="hero" aria-labelledby="page-title">
        <p className="eyebrow">Status</p>
        <h1 id="page-title">Service availability</h1>
        <div
          className={`overall-status ${allOperational ? "is-operational" : ""}`}
        >
          <span aria-hidden="true" className="status-dot" />
          <span>
            {allOperational
              ? "All systems operational"
              : "Monitoring service status"}
          </span>
        </div>
        <p className="hero-copy">
          Live availability for the services maintained by Melvin Jones Repol.
        </p>
      </section>

      <section className="status-dashboard" aria-labelledby="dashboard-title">
        <div className="section-heading">
          <h2 id="dashboard-title">At a glance</h2>
          <p>Combined service health</p>
        </div>
        <div className="dashboard-grid">
          <article className="dashboard-stat">
            <span className="dashboard-label">Services monitored</span>
            <strong>{monitors.length}</strong>
            <p>Active services being tracked</p>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-label">Operational now</span>
            <strong>
              {monitors.length ? `${operational}/${monitors.length}` : "—"}
            </strong>
            <p>
              {monitors.length
                ? allOperational
                  ? "Everything is running normally"
                  : "Some services need attention"
                : "Waiting for monitoring data"}
            </p>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-label">Average uptime</span>
            <strong>
              {average90DayUptime === null
                ? "—"
                : `${average90DayUptime.toFixed(2)}%`}
            </strong>
            <p>
              {average90DayUptime === null
                ? "Waiting for monitoring data"
                : "Across all services, last 90 days"}
            </p>
          </article>
          <article className="dashboard-stat">
            <span className="dashboard-label">Recent interruptions</span>
            <strong>{recentInterruptions}</strong>
            <p>
              {recentInterruptions === 1
                ? "Service with a recorded interruption"
                : "Services with recorded interruptions"}
            </p>
          </article>
        </div>
      </section>

      <section className="services" aria-labelledby="services-title">
        {monitors.length ? (
          <div className="monitor-list">
            {monitors.map((monitor) => {
              const isOperational = monitor.statusClass === "success";
              return (
                <article className="monitor" key={monitor.monitorId}>
                  <div className="monitor-topline">
                    <div>
                      <h3>{monitor.name}</h3>
                      <p>{monitor.type}</p>
                    </div>
                    <span
                      className={`service-status ${isOperational ? "is-operational" : ""}`}
                    >
                      <span aria-hidden="true" className="status-dot" />
                      {isOperational ? "Operational" : "Attention needed"}
                    </span>
                  </div>
                  <div className="uptime-summary" aria-label="Uptime summary">
                    <div>
                      <span>Current uptime</span>
                      <strong>{monitor.ratio.ratio}%</strong>
                    </div>
                    <div>
                      <span>Last 30 days</span>
                      <strong>{monitor["30dRatio"].ratio}%</strong>
                    </div>
                    <div>
                      <span>Last 90 days</span>
                      <strong>{monitor["90dRatio"].ratio}%</strong>
                    </div>
                  </div>
                  <div
                    className="history"
                    aria-label={`${monitor.name} 90 day uptime history`}
                  >
                    {monitor.dailyRatios.slice(-90).map((day) => (
                      <span
                        className={`history-day ${day.color === "green" ? "is-up" : ""}`}
                        key={`${day.date}-${day.ratio}`}
                        title={`${day.date}: ${day.ratio}% uptime`}
                      />
                    ))}
                  </div>
                  {monitor.lastDowntime && (
                    <p className="incident-note">
                      The most recent interruption was{" "}
                      {formatIncidentDate(monitor.lastDowntime.date)}. It lasted{" "}
                      {formatDuration(monitor.lastDowntime.duration)} due to{" "}
                      {formatIncidentReason(monitor.lastDowntime.reason)}.
                    </p>
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <span aria-hidden="true" className="status-dot" />
            <div>
              <h3>Status is being checked</h3>
              <p>
                Service details will appear here when monitoring data is
                available.
              </p>
            </div>
          </div>
        )}
      </section>

      <aside className="status-support" aria-label="Monitoring and support">
        <div className="monitoring-note">
          <span aria-hidden="true" className="status-dot" />
          <div>
            <h2>Live monitoring</h2>
            <p>
              This page refreshes automatically every minute with the latest
              service data.
            </p>
          </div>
        </div>
        <div className="support-note">
          <div>
            <h2>Something not working?</h2>
            <p>
              If you are experiencing an issue, please get in touch and I’ll
              take a look.
            </p>
          </div>
          <a href="https://www.melvinjonesrepol.com/contact-me">Contact me</a>
        </div>
      </aside>
    </main>
  );
}
