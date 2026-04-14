import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PartnersAdmin() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/admin/availability');
  }, [router]);
  return null;
}
