import Link from "next/link";

export default function NotFound() {
  return (
    <main className="not-found page-shell">
      <section aria-labelledby="not-found-title">
        <p className="eyebrow">404 error</p>
        <h1 id="not-found-title">This page isn’t available.</h1>
        <p className="not-found-copy">
          The address may be incorrect, or the page may have moved. You can
          return to the service status page to see the latest availability.
        </p>
        <div className="not-found-actions">
          <Link className="not-found-primary" href="/">
            View system status
          </Link>
          <Link
            className="not-found-secondary"
            href="https://www.melvinjonesrepol.com/"
          >
            Visit portfolio
          </Link>
        </div>
      </section>
      <div className="not-found-status" aria-label="System status">
        <span aria-hidden="true" className="status-dot" />
        <span>System monitoring remains active</span>
      </div>
    </main>
  );
}
