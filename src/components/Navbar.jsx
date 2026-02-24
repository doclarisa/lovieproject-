import Link from 'next/link';
import LanguageToggle from './LanguageToggle';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          Lovie
        </Link>
        <div className="flex gap-6 items-center">
          <Link href="/home" className="text-gray-700 hover:text-blue-600">
            Gallery
          </Link>
          <Link href="/submit" className="text-gray-700 hover:text-blue-600">
            Submit
          </Link>
          <LanguageToggle />
        </div>
      </div>
    </nav>
  );
}
