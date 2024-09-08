import { Link } from 'next-view-transitions';
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  return (
    <div className="container mx-auto py-10 text-center">
      <h1 className="mb-5 text-2xl font-bold">Onboarding Successful!</h1>
      <p className="mb-5">Your museum has been successfully registered.</p>
      <Button asChild>
        <Link href="/dashboard">Go to Dashboard</Link>
      </Button>
    </div>
  );
}
