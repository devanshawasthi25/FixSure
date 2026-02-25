'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Customer' },
  { href: '/technician', label: 'Technician' },
  { href: '/admin', label: 'Admin' },
  { href: '/plans', label: 'Plans' }
];

export default function Header() {
  const path = usePathname();
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link href="/" className="text-xl font-bold text-brand">FixSure</Link>
        <div className="flex gap-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm ${path.startsWith(link.href) ? 'bg-brand text-white' : 'bg-slate-100'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
