export const revalidate = 60;

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

export default async function Home() {
  const monitors = await getMonitors();
  const operational = monitors.filter(
    (monitor) => monitor.statusClass === "success",
  ).length;
  const allOperational = monitors.length > 0 && operational === monitors.length;

  return (
    <main className="page-shell">
      <header className="site-header">
        <a className="wordmark" href="https://www.melvinjonesrepol.com/">
          Melvin Jones Repol
        </a>
        <span className="header-label">System status</span>
      </header>
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
      <section className="services" aria-labelledby="services-title">
        <div className="section-heading">
          <h2 id="services-title">Services</h2>
          <p>Uptime over the last 90 days</p>
        </div>
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
                      Most recent interruption: {monitor.lastDowntime.date} for{" "}
                      {formatDuration(monitor.lastDowntime.duration)}.
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
      <footer>Updated automatically every minute</footer>
    </main>
  );
}
