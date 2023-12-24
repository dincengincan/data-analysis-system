import { Container } from "@mui/material";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <Container>{children}</Container>;
};
