import { SignIn } from "@clerk/nextjs";

export default function SigninPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignIn />
    </div>
  );
}
