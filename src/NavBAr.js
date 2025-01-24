import { Logo } from "./Logo";

export function NavBAr({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
