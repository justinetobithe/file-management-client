import { Loader2 } from 'lucide-react';
import React, { FC } from 'react';

type AppSpinnerProps = {
  className?: string;
};

const AppSpinner: FC<AppSpinnerProps> = ({ className }) => {
  return <Loader2 className={`animate-spin ${className}`} />;
};

export default AppSpinner;
