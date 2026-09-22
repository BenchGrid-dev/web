import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function NotFound() {
  return (
    <main id="main" className="page-width not-found">
      <span className="eyebrow">404 / OFF THE GRID</span>
      <h1>
        This one’s
        <br />
        <span className="serif">uncharted territory.</span>
      </h1>
      <p>
        We couldn’t find that page. There are plenty of models back in the
        directory.
      </p>
      <Link className="button dark" href="/">
        <ArrowLeft size={17} /> Back to the models
      </Link>
    </main>
  );
}
