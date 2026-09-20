import Link from "next/link";

const primaryLinks = [
  { href: "https://www.melvinjonesrepol.com/", label: "Portfolio" },
  { href: "https://www.melvinjonesrepol.com/projects", label: "Projects" },
  { href: "https://www.melvinjonesrepol.com/blog", label: "Blog" },
  { href: "https://www.melvinjonesrepol.com/contact-me", label: "Contact" },
];

export default function Navbar() {
  return (
    <header className="site-header">
      <Link className="wordmark" href="https://www.melvinjonesrepol.com/">
        Melvin Jones Repol
      </Link>

      <nav className="primary-nav" aria-label="Primary navigation">
        <div className="primary-nav-links">
          {primaryLinks.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <details className="mobile-nav">
        <summary aria-label="Open navigation">
          <span />
          <span />
          <span />
        </summary>
        <nav aria-label="Mobile navigation">
          <span className="mobile-nav-label">Navigate</span>
          {primaryLinks.map(({ href, label }) => (
            <Link href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
      </details>
    </header>
  );
}
