"use client";

import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faLinkedin,
  faSteam,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import CookiePreference from "../common/CookiePreference";
import TrustPilotWidget from "../common/TrustPilotWidget";

export default function Footer() {
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/gaming", label: "Gaming" },
    { href: "/certificates", label: "Certificates" },
    { href: "/work-experience", label: "Work Experience" },
    { href: "/contact-me", label: "Contact Me" },
  ];

  const projectLinks = [
    {
      href: "https://web-designs.melvinjonesrepol.com",
      label: "Web Design",
      external: true,
    },
    {
      href: "https://wakatime.melvinjonesrepol.com",
      label: "Wakatime Stats",
      external: true,
    },
    { href: "https://www.webvium.com", label: "Webvium Browser" },
    {
      href: "https://www.melvinjonesrepol.com/protocol-discussion-platform",
      label: "Protocol Discussion Platform",
    },
    {
      href: "https://www.melvinjonesrepol.com/axleshift-freight-management",
      label: "Axleshift Freight Management",
    },
    {
      href: "https://www.melvinjonesrepol.com/point-of-sale",
      label: "Point of Sale",
    },
    { href: "https://ulishastore.com", label: "Ulisha Store Laravel" },
    {
      href: "https://www.melvinjonesrepol.com/canis-agent",
      label: "Canis Chatbot",
    },
    {
      href: "https://www.hallofcodes.org",
      label: "Hall of Codes",
      external: true,
    },
    { href: "https://www.melvinjonesrepol.com/sitemap.xml", label: "Sitemap" },
  ];

  const socialLinks = [
    {
      href: "https://facebook.com/mrepol742",
      icon: faFacebook,
      label: "Facebook",
    },
    { href: "https://github.com/mrepol742", icon: faGithub, label: "GitHub" },
    {
      href: "https://linkedin.com/in/mrepol742",
      icon: faLinkedin,
      label: "LinkedIn",
    },
    {
      href: "https://youtube.com/@mrepol742",
      icon: faYoutube,
      label: "YouTube",
    },
    {
      href: "https://steamcommunity.com/id/mrepol742",
      icon: faSteam,
      label: "Steam",
    },
  ];

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <Link
              className="footer-wordmark"
              href="https://www.melvinjonesrepol.com/"
            >
              Melvin Jones Repol
            </Link>

            <p className="footer-intro">
              Building modern software experiences with passion and precision.
              Striving for excellence, one project at a time.
            </p>

            <div className="footer-socials">
              {socialLinks.map(({ href, icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="social-link"
                >
                  <FontAwesomeIcon icon={icon} className="text-sm" />
                </Link>
              ))}
            </div>

            <div className="footer-trustpilot">
              <TrustPilotWidget />
            </div>
          </div>

          {/* Navigate */}
          <nav className="footer-links" aria-label="Footer navigation">
            <h4>Navigate</h4>
            <ul>
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={`https://www.melvinjonesrepol.com${href}`}>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Projects */}
          <nav className="footer-links" aria-label="Featured projects">
            <h4>Projects</h4>
            <ul>
              {projectLinks.map(({ href, label, external }) => (
                <li key={href}>
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} Melvin Jones Repol. All rights
            reserved.
          </span>

          <div className="footer-utility-links">
            <CookiePreference />

            <span aria-hidden="true">·</span>

            <Link
              href="https://www.melvinjonesrepol.com/legal"
              target="_blank"
              className="footer-legal-link"
            >
              Legal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
