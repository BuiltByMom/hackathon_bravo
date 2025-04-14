import { SendAssetForm } from "@/components/send-asset-form";
import { ProtectedRoute } from "@/components/protected-route";

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Send Digital Assets</h1>
          <p className="text-muted-foreground mb-8">
            Send crypto, NFTs, or access tokens to anyone via email using magic
            links.
          </p>
          <SendAssetForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
