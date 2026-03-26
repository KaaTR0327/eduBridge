import './Footer.css';

const footerLinks = [
  { href: '/#help', label: 'Тусламж' },
  { href: '/#about', label: 'Тухай' },
  { href: '/#terms', label: 'Нөхцөл' },
  { href: '/#privacy', label: 'Нууцлал' }
];

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-section__inner">
        <nav className="footer-section__nav" aria-label="Footer">
          {footerLinks.map((link) => (
            <a key={link.label} href={link.href} className="footer-section__link">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
