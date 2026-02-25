import Link from 'next/link';

export default function Home() {
  return (
    <section className="space-y-4">
      <div className="card space-y-3">
        <h1 className="text-3xl font-bold">Guaranteed home maintenance, made simple.</h1>
        <p className="text-slate-600">Book trusted technicians for electrician, plumber, AC, and carpenter jobs with warranty tracking.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/signup" className="btn-primary text-center">Get Started</Link>
          <Link href="/book" className="btn bg-accent text-white text-center">Emergency Request</Link>
        </div>
      </div>
    </section>
  );
}
