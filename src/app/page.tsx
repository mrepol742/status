import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAws,
  faClaude,
  faCloudflare,
  faGithub,
  faGoogle,
  faMicrosoft,
  faOpenai,
  faPaypal,
  faWordpress,
} from "@fortawesome/free-brands-svg-icons";

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

const thirdPartyServices = [
  { name: "GitHub", href: "https://www.githubstatus.com/", icon: faGithub },
  { name: "Vercel", href: "https://www.vercel-status.com/", mark: "V" },
  { name: "Netlify", href: "https://www.netlifystatus.com/", mark: "N" },
  { name: "NameHero", href: "https://status.namehero.com/", mark: "N" },
  { name: "Hostinger", href: "https://statuspage.hostinger.com/", mark: "H" },
  { name: "Claude", href: "https://status.claude.com/", icon: faClaude },
  { name: "OpenAI", href: "https://status.openai.com/", icon: faOpenai },
  {
    name: "Cloudflare",
    href: "https://www.cloudflarestatus.com/",
    icon: faCloudflare,
  },
  { name: "Xendit", href: "https://status.xendit.co/", mark: "X" },
  {
    name: "Paypal",
    href: "https://www.paypal-status.com/paypal-status/product/production",
    icon: faPaypal,
  },
  {
    name: "AWS",
    href: "https://health.aws.amazon.com/health/status",
    icon: faAws,
  },
  {
    name: "Google Cloud",
    href: "https://status.cloud.google.com/",
    icon: faGoogle,
  },
  {
    name: "Microsoft Azure",
    href: "https://azure.status.microsoft/en-us/status",
    icon: faMicrosoft,
  },
  {
    name: "Wordpress",
    href: "https://status.wordpress.org/",
    icon: faWordpress,
  },
];

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

function formatIncidentDateOnly(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
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
  const incidents = monitors
    .filter(
      (
        monitor,
      ): monitor is Monitor & {
        lastDowntime: NonNullable<Monitor["lastDowntime"]>;
      } => monitor.lastDowntime !== null,
    )
    .sort(
      (a, b) =>
        new Date(b.lastDowntime.date).getTime() -
        new Date(a.lastDowntime.date).getTime(),
    );
  const average90DayUptime = monitors.length
    ? monitors.reduce(
        (total, monitor) =>
          total + (Number.parseFloat(monitor["90dRatio"].ratio) || 0),
        0,
      ) / monitors.length
    : null;

  return (
    <main className="mx-auto w-[calc(100%_-_2rem)] max-w-[880px] pb-[42px] sm:w-[calc(100%_-_2.5rem)]">
      <section
        className="py-[54px] md:py-[76px] md:pb-16"
        aria-labelledby="page-title"
      >
        <h1
          id="page-title"
          className="mb-[22px] max-w-[580px] text-[clamp(40px,7vw,68px)] leading-[.98] tracking-[-.06em]"
        >
          Service availability
        </h1>
        <div
          className={`inline-flex items-center gap-2 border px-[11px] py-2 text-sm font-semibold ${allOperational ? "border-[#b7ddc3] bg-[var(--green-soft)] text-[#11643a]" : "border-[var(--line)]"}`}
        >
          <span
            aria-hidden="true"
            className={`size-2 shrink-0 rounded-full ${allOperational ? "bg-[var(--green)]" : "bg-[#aab4ae]"}`}
          />
          <span>
            {allOperational
              ? "All systems operational"
              : "Monitoring service status"}
          </span>
        </div>
      </section>

      <section
        className="mb-[34px] md:mb-[42px]"
        aria-labelledby="dashboard-title"
      >
        <h2 id="dashboard-title" className="sr-only">
          At a glance
        </h2>
        <div className="grid grid-cols-2 border-l border-t border-[var(--line)] md:grid-cols-4">
          <article className="min-h-[138px] min-w-0 border-b border-r border-[var(--line)] p-[17px] md:min-h-[156px] md:p-5">
            <span className="mb-[18px] block text-xs font-semibold leading-[1.35] text-[var(--muted)] md:mb-[22px]">
              Services monitored
            </span>
            <strong className="mb-2 block overflow-hidden text-[clamp(24px,3vw,32px)] tracking-[-.05em] text-ellipsis whitespace-nowrap">
              {monitors.length}
            </strong>
            <p className="m-0 text-xs leading-[1.45] text-[var(--muted)]">
              Active services being tracked
            </p>
          </article>
          <article className="min-h-[138px] min-w-0 border-b border-r border-[var(--line)] p-[17px] md:min-h-[156px] md:p-5">
            <span className="mb-[18px] block text-xs font-semibold leading-[1.35] text-[var(--muted)] md:mb-[22px]">
              Operational now
            </span>
            <strong className="mb-2 block overflow-hidden text-[clamp(24px,3vw,32px)] tracking-[-.05em] text-ellipsis whitespace-nowrap">
              {monitors.length ? `${operational}/${monitors.length}` : "—"}
            </strong>
            <p className="m-0 text-xs leading-[1.45] text-[var(--muted)]">
              {monitors.length
                ? allOperational
                  ? "Everything is running normally"
                  : "Some services need attention"
                : "Waiting for monitoring data"}
            </p>
          </article>
          <article className="min-h-[138px] min-w-0 border-b border-r border-[var(--line)] p-[17px] md:min-h-[156px] md:p-5">
            <span className="mb-[18px] block text-xs font-semibold leading-[1.35] text-[var(--muted)] md:mb-[22px]">
              Average uptime
            </span>
            <strong className="mb-2 block overflow-hidden text-[clamp(24px,3vw,32px)] tracking-[-.05em] text-ellipsis whitespace-nowrap">
              {average90DayUptime === null
                ? "—"
                : `${average90DayUptime.toFixed(2)}%`}
            </strong>
            <p className="m-0 text-xs leading-[1.45] text-[var(--muted)]">
              {average90DayUptime === null
                ? "Waiting for monitoring data"
                : "Across all services, last 90 days"}
            </p>
          </article>
          <article className="min-h-[138px] min-w-0 border-b border-r border-[var(--line)] p-[17px] md:min-h-[156px] md:p-5">
            <span className="mb-[18px] block text-xs font-semibold leading-[1.35] text-[var(--muted)] md:mb-[22px]">
              Recent interruptions
            </span>
            <strong className="mb-2 block overflow-hidden text-[clamp(24px,3vw,32px)] tracking-[-.05em] text-ellipsis whitespace-nowrap">
              {recentInterruptions}
            </strong>
            <p className="m-0 text-xs leading-[1.45] text-[var(--muted)]">
              {recentInterruptions === 1
                ? "Service with a recorded interruption"
                : "Services with recorded interruptions"}
            </p>
          </article>
        </div>
      </section>

      <section className="pt-[30px]" aria-labelledby="services-title">
        {monitors.length ? (
          <div className="border-t border-[var(--line)]">
            {monitors.map((monitor) => {
              const isOperational = monitor.statusClass === "success";
              return (
                <article
                  className="border-b border-[var(--line)] py-[25px]"
                  key={monitor.monitorId}
                >
                  <div className="flex flex-col items-start justify-between gap-[14px] sm:flex-row sm:gap-5">
                    <div>
                      <h3 className="mb-[5px] text-lg tracking-[-.02em]">
                        {monitor.name}
                      </h3>
                      <p className="mb-0 text-sm text-[var(--muted)]">
                        {monitor.type}
                      </p>
                    </div>
                    <span
                      className={`inline-flex whitespace-nowrap items-center gap-2 border px-[11px] py-2 text-[13px] font-semibold ${isOperational ? "border-[#b7ddc3] bg-[var(--green-soft)] text-[#11643a]" : "border-[var(--line)]"}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`size-2 shrink-0 rounded-full ${isOperational ? "bg-[var(--green)]" : "bg-[#aab4ae]"}`}
                      />
                      {isOperational ? "Operational" : "Attention needed"}
                    </span>
                  </div>
                  <div
                    className="mt-[29px] grid grid-cols-3 gap-[10px] sm:gap-[18px]"
                    aria-label="Uptime summary"
                  >
                    <div>
                      <span className="mb-[6px] block text-xs text-[var(--muted)]">
                        Current uptime
                      </span>
                      <strong className="text-[19px] tracking-[-.04em] sm:text-[22px]">
                        {monitor.ratio.ratio}%
                      </strong>
                    </div>
                    <div>
                      <span className="mb-[6px] block text-xs text-[var(--muted)]">
                        Last 30 days
                      </span>
                      <strong className="text-[19px] tracking-[-.04em] sm:text-[22px]">
                        {monitor["30dRatio"].ratio}%
                      </strong>
                    </div>
                    <div>
                      <span className="mb-[6px] block text-xs text-[var(--muted)]">
                        Last 90 days
                      </span>
                      <strong className="text-[19px] tracking-[-.04em] sm:text-[22px]">
                        {monitor["90dRatio"].ratio}%
                      </strong>
                    </div>
                  </div>
                  <div
                    className="mt-[26px] grid grid-cols-[repeat(18,1fr)] gap-[3px] sm:grid-cols-[repeat(30,1fr)]"
                    aria-label={`${monitor.name} 90 day uptime history`}
                  >
                    {monitor.dailyRatios.slice(-90).map((day) => (
                      <span
                        className={`block h-2 ${day.color === "green" ? "bg-[var(--green)]" : "bg-[#e4eae6]"}`}
                        key={`${day.date}-${day.ratio}`}
                        title={`${day.date}: ${day.ratio}% uptime`}
                      />
                    ))}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="flex items-start gap-3 border border-[var(--line)] p-6">
            <span
              aria-hidden="true"
              className="mt-1 size-2 shrink-0 rounded-full bg-[var(--green)]"
            />
            <div>
              <h3 className="mb-[6px] text-base">Status is being checked</h3>
              <p className="mb-0 leading-normal text-[var(--muted)]">
                Service details will appear here when monitoring data is
                available.
              </p>
            </div>
          </div>
        )}
      </section>

      <section
        className="mt-[34px] md:mt-[42px]"
        aria-labelledby="incidents-title"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="incidents-title" className="text-lg tracking-[-.02em]">
            Incident history
          </h2>
        </div>
        {incidents.length ? (
          <div className="border-t border-[var(--line)]">
            {incidents.map((monitor) => (
              <article
                className="grid gap-[18px] border-b border-[var(--line)] py-5 grid-cols-1 md:gap-7 md:py-[23px]"
                key={monitor.monitorId}
              >
                <div className="flex items-center gap-[9px]">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-full bg-[var(--green)]"
                  />
                  <h3 className="m-0 text-[15px] tracking-[-.02em]">
                    {monitor.name}
                  </h3>
                </div>
                <dl className="m-0 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-[18px]">
                  <div>
                    <dt className="mb-[7px] text-[11px] font-bold uppercase tracking-[.07em] text-[var(--muted)]">
                      Date
                    </dt>
                    <dd className="m-0 text-sm leading-[1.45]">
                      {formatIncidentDateOnly(monitor.lastDowntime.date)}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-[7px] text-[11px] font-bold uppercase tracking-[.07em] text-[var(--muted)]">
                      Reason
                    </dt>
                    <dd className="m-0 text-sm leading-[1.45]">
                      {formatIncidentReason(monitor.lastDowntime.reason)}
                    </dd>
                  </div>
                  <div>
                    <dt className="mb-[7px] text-[11px] font-bold uppercase tracking-[.07em] text-[var(--muted)]">
                      Time offline
                    </dt>
                    <dd className="m-0 text-sm leading-[1.45]">
                      {formatDuration(monitor.lastDowntime.duration)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2.5 border-y border-[var(--line)] py-[21px]">
            <span
              aria-hidden="true"
              className="size-2 shrink-0 rounded-full bg-[var(--green)]"
            />
            <p className="m-0 text-sm text-[var(--muted)]">
              No interruptions have been recorded.
            </p>
          </div>
        )}
      </section>

      <section
        className="mt-[34px] md:mt-[42px]"
        aria-labelledby="third-party-title"
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="third-party-title" className="text-lg tracking-[-.02em]">
            Third-party service status
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-l border-[var(--line)]">
          {thirdPartyServices.map(({ name, href, icon, mark }) => (
            <a
              className="flex min-w-0 items-center gap-[11px] border-r border-b border-[var(--line)] px-[14px] py-[14px] text-sm font-semibold text-[var(--ink)] no-underline transition-colors hover:bg-[var(--green-soft)] hover:text-[#11643a] focus-visible:bg-[var(--green-soft)] focus-visible:text-[#11643a] sm:px-[17px] sm:py-[15px]"
              href={href}
              key={name}
              rel="noreferrer"
              target="_blank"
            >
              <span
                aria-hidden="true"
                className={`grid size-[21px] shrink-0 place-items-center text-[var(--green)] leading-none ${icon ? "text-lg" : "rounded-full border border-current text-[9px] font-extrabold tracking-[-.04em]"}`}
              >
                {icon ? <FontAwesomeIcon icon={icon} /> : mark}
              </span>
              <span>{name}</span>
              <span
                aria-hidden="true"
                className="ml-auto text-base font-normal text-[var(--green)]"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      </section>

      <aside
        className="mt-6 grid gap-[10px] md:mt-8 md:grid-cols-2 md:gap-4"
        aria-label="Monitoring and support"
      >
        <div className="flex min-h-0 items-start gap-[13px] border border-[var(--line)] p-[18px] md:min-h-[116px] md:p-[21px]">
          <span
            aria-hidden="true"
            className="mt-[5px] size-2 shrink-0 rounded-full bg-[var(--green)]"
          />
          <div>
            <h2 className="mb-[7px] text-[15px]">Live monitoring</h2>
            <p className="m-0 text-[13px] leading-[1.55] text-[var(--muted)]">
              This page refreshes automatically every minute with the latest
              service data.
            </p>
          </div>
        </div>
        <div className="flex min-h-0 items-start justify-between gap-[13px] border border-[#b7ddc3] bg-[var(--green-soft)] p-[18px] md:min-h-[116px] md:p-[21px]">
          <div>
            <h2 className="mb-[7px] text-[15px]">Something not working?</h2>
            <p className="m-0 text-[13px] leading-[1.55] text-[var(--muted)]">
              If you are experiencing an issue, please get in touch and I’ll
              take a look.
            </p>
          </div>
          <a
            className="self-center whitespace-nowrap border border-[#9acbab] px-2.5 py-2 text-[13px] font-semibold text-[#11643a] no-underline transition-colors hover:bg-[var(--green)] hover:text-white focus-visible:bg-[var(--green)] focus-visible:text-white"
            href="https://www.melvinjonesrepol.com/contact-me"
          >
            Contact me
          </a>
        </div>
      </aside>
    </main>
  );
}
