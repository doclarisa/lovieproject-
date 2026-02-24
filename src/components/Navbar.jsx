import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  return (
    <nav className="bg-white border-b-2" style={{ borderBottomColor: 'var(--color-burgundy-light)' }}>
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/home" className="text-2xl font-serif font-bold" style={{ color: 'var(--color-burgundy-light)' }}>
          Lovie
        </Link>
        <div className="flex gap-8 items-center">
          <Link href="/home" className="text-gray-700 hover:text-burgundy-light transition font-medium" style={{ '--hover-color': 'var(--color-burgundy-light)' }}>
            Gallery
          </Link>
          <Link href="/submit" className="text-gray-700 hover:text-burgundy-light transition font-medium">
            Submit
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-burgundy-light transition font-medium text-sm uppercase tracking-wider">
            Admin
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
