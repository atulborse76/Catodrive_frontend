"use client"
import dynamic from 'next/dynamic';

const CarDetailsClient = dynamic(() => import('./CarDetailsClient'), {
  ssr: false, // disables server-side rendering (fixes the build crash)
});

export default function Page() {
  return (
    <div>
      <CarDetailsClient />
    </div>
  );
}
