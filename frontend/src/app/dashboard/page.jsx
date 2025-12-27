'use client';

import DashboardContent from '@/components/layout/DashboardContent';
import Providers from '@/components/providers/AuthProvider';

export default function Page() {
  return (
    <Providers>
      <DashboardContent />
    </Providers>
  );
}