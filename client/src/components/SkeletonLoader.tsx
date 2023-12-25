import { Skeleton } from "@mui/material";

type SkeletonLoaderProps = {
  children: React.ReactNode;
  isLoading: boolean;
  height: number;
};

export const SkeletonLoader = ({
  children,
  isLoading,
  height,
}: SkeletonLoaderProps) => {
  if (isLoading) {
    return (
      <Skeleton variant="rectangular" height={height} width="100%">
        {children}
      </Skeleton>
    );
  }

  return <>{children}</>;
};
