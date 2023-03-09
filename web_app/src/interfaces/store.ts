export interface State {
  navbar: Navbar;
}

export interface Navbar {
  navItems: string[];
  currentNavItem: string;
}

export interface AppProps {
  store: State;
}
