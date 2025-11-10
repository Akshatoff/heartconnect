import Image from "next/image";
import { Heart } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-linear-to-br from-primary-50 to-primary-100">
      <div className="container mx-auto px-4 py-8">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="w-10 h-10 text-primary-600 fill-primary-600" />
            <h1 className="text-4xl font-bold text-primary-600">
              HeartConnect
            </h1>
          </div>
          <p className="text-gray-600 max-w-md mx-auto">
            A compassionate matrimony platform for people with special needs
          </p>
        </div>

        {/* Content */}
        <div className="max-w-md mx-auto">{children}</div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            By continuing, you agree to our{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
