import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { QueryClientProvider } from './QueryClientProvider';
import { envConfig } from '../configs/env.config';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider>
      {children}
      {envConfig.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
