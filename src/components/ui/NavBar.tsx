import Link from 'next/link';

export default function NavBar() {
  return (
    <nav className="flex gap-4 p-4 bg-gray-100 w-full justify-center">
      <Link href="/">Home</Link>
      <Link href="/upload-file">Upload</Link>
    </nav>
  );
}
