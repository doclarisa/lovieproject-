export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center">
          <p>&copy; {new Date().getFullYear()} Lovie Project. All rights reserved.</p>
          <p className="text-sm text-gray-400 mt-2">
            Built with Next.js and Supabase
          </p>
        </div>
      </div>
    </footer>
  );
}
