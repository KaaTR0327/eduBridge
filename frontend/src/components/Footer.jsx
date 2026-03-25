import './Footer.css';

const footerLinks = [
  { label: 'Тусламж', href: '/#help' },
  { label: 'Тухай', href: '/#about' },
  { label: 'Нөхцөл', href: '/#terms' },
  { label: 'Нууцлал', href: '/#privacy' }
];

export function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-section__inner">
        <nav className="footer-section__nav" aria-label="Footer">
          {footerLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="footer-section__link"
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
