import { NormalisedStocks } from "./props";

export interface State {
  navbar: Navbar;
  normalisedStock: normalisedStocks
}

export interface Navbar {
  navItems: string[];
  currentNavItem: string;
}

export interface AppProps {
  store: State;
}
export interface normalisedStocks{
  normalisedStocks: NormalisedStocks[]
}