import { SignUpForm } from "@/components/signup-form";
import { AuthPageWrapper } from "@/components/auth-page-wrapper";

export default function SignUpPage() {
  return (
    <AuthPageWrapper>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-2">Create an Account</h1>
          <p className="text-muted-foreground mb-8">
            Sign up to start sending digital assets to anyone via email.
          </p>
          <SignUpForm />
        </div>
      </div>
    </AuthPageWrapper>
  );
}
