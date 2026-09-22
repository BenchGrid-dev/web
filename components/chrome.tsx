import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
export function Logo() {
  return (
    <Link href="/" className="brand" aria-label="BenchGrid home">
      <span className="brand-icon" aria-hidden="true">
        <img src="/favicon.svg" width={29} height={29} alt="" />
      </span>
      benchgrid<span className="brand-period">.</span>
    </Link>
  );
}
export function Header() {
  return (
    <header className="site-header">
      <div className="header-inner page-width">
        <Logo />
        <nav aria-label="Main navigation">
          <Link href="/models">Models</Link>
          <Link href="/rankings">Rankings</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/guides">Guides</Link>
        </nav>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div>
          <Logo />
          <p>Model specs, GPU memory estimates, and deployment guides.</p>
        </div>
        <div className="footer-links">
          <Link href="/models">Model directory</Link>
          <Link href="/rankings">Rankings & shortlists</Link>
          <Link href="/compare">Compare models</Link>
          <Link href="/methodology">Methodology & disclosure</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} BenchGrid</span>
        <span>Specifications sourced from official model cards.</span>
        <span className="mono">
          INDEPENDENT BY DESIGN <Plus size={12} />
        </span>
      </div>
    </footer>
  );
}
export function ArrowLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link className={`arrow-link ${className}`} href={href}>
      {children}
      <ArrowRight size={17} />
    </Link>
  );
}
export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <Link href="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <span aria-hidden="true">/</span>
          {item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
