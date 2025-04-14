import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";

export default function SuccessPage({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Asset Sent Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            The recipient will receive an email with a magic link to claim their
            asset.
          </p>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Transaction ID: {searchParams.id}
            </p>
            <Button asChild>
              <Link href="/">Send Another Asset</Link>
            </Button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
