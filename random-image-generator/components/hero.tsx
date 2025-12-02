import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center gap-6 py-20">
      <h1 className="text-4xl font-bold">Welcome to Random Image Generator</h1>
      <p className="text-lg text-foreground/80 max-w-xl">
        Log in or sign up to upload images, organize your own categories, and
        generate a random image from your personal gallery.
      </p>
      <p className="text-sm text-foreground/60">
        Create categories like <strong>Animals</strong>, <strong>Nature</strong>,{" "}
        <strong>People</strong>, and more.
      </p>
      <Suspense>
        <AuthButton />
      </Suspense>
    </section>
  );
}