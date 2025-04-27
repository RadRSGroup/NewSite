import MobileMenu from './MobileMenu';

/**
 * @component Header
 * @description Site header with logo and navigation
 */
export default function Header() {
  return (
    <header className="header">
      <div className="container">
        <a href="#" className="logo">
          {/* TODO: Replace with Next.js <Image /> */}
          <img src="images/logo.svg" alt="RS Group Logo" />
        </a>
        <nav className="nav">
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
} 