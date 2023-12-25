import { Container } from "@mui/material";

type LayoutProps = {
  children: React.ReactNode;
};

export const Layout = ({ children }: LayoutProps) => {
  return <Container maxWidth="lg">{children}</Container>;
};
