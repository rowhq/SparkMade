import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="text-2xl font-semibold tracking-tight hover:opacity-80 transition-apple">
      SparkMade
    </Link>
  );
}
