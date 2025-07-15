// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { BorderBeam } from "@/components/magicui/border-beam";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] px-4">
      <BorderBeam size={300} duration={10} delay={6} color="white">
        <div className="w-full max-w-md rounded-xl bg-[#111111] border border-neutral-800 shadow-2xl p-6 sm:p-8">
          <SignIn
            appearance={{
              elements: {
                card: "bg-transparent shadow-none",
                headerTitle: "text-2xl font-semibold text-center text-white mb-1",
                headerSubtitle: "text-sm text-neutral-400 text-center mb-6",
                formFieldLabel: "text-sm text-neutral-300 mb-1",
                formFieldInput:
                  "bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-500 focus:ring-white focus:border-white rounded-md px-3 py-2",
                formButtonPrimary:
                  "bg-white hover:bg-neutral-300 text-black font-medium py-2 mt-4 rounded-md transition",
                socialButtonsBlockButton:
                  "bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-700 py-2 rounded-md",
                footerActionText: "text-neutral-400 text-sm mt-6 text-center",
                footerActionLink: "text-white hover:underline",
              },
              variables: {
                colorPrimary: "#ffffff",
                colorText: "#ffffff",
                fontSize: "14px",
                fontFamily: "Inter, sans-serif",
                borderRadius: "8px",
              },
            }}
          />
        </div>
      </BorderBeam>
    </div>
  );
}
