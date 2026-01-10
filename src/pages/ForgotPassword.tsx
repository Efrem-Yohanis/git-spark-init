import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      // Simulate API call - replace with actual password reset logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      toast.success("Password reset email sent");
    } catch {
      setError("Unable to send reset email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = email.trim() && validateEmail(email);

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden md:flex md:w-2/5 lg:w-1/2 bg-primary relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16 text-white">
          {/* Logos */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl">M</span>
              </div>
              <div>
                <p className="text-lg font-semibold">M-Pesa</p>
                <p className="text-sm text-white/80">Safaricom Ethiopia</p>
              </div>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl lg:text-4xl font-bold leading-tight">
            M-Pesa Customer<br />Engagement Platform
          </h1>
        </div>
      </div>

      {/* Right Panel - Forgot Password Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo - shown only on mobile */}
          <div className="md:hidden mb-8 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <div className="text-left">
                <p className="text-lg font-semibold text-foreground">M-Pesa</p>
                <p className="text-sm text-muted-foreground">Safaricom Ethiopia</p>
              </div>
            </div>
          </div>

          <Card className="rounded-xl shadow-lg border-border">
            <CardContent className="p-8">
              {!isSubmitted ? (
                <>
                  {/* Back to login */}
                  <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>

                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-foreground">Forgot password?</h2>
                    <p className="text-muted-foreground mt-2">
                      Enter your email address and we will send you instructions to reset your password.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error message */}
                    {error && (
                      <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm">{error}</span>
                      </div>
                    )}

                    {/* Email field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="user@safaricom.et"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError("");
                        }}
                        className={`h-11 rounded-lg ${error ? "border-destructive focus-visible:ring-destructive" : ""}`}
                        disabled={isLoading}
                      />
                    </div>

                    {/* Submit button */}
                    <Button
                      type="submit"
                      className="w-full h-11 rounded-lg text-base font-semibold"
                      disabled={!isFormValid || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Reset Instructions"
                      )}
                    </Button>
                  </form>
                </>
              ) : (
                /* Success state */
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Check your email</h2>
                  <p className="text-muted-foreground mb-6">
                    We have sent password reset instructions to:
                  </p>
                  <p className="font-medium text-foreground mb-8">{email}</p>
                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full h-11 rounded-lg text-base font-semibold"
                  >
                    Back to Login
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmail("");
                    }}
                    className="mt-4 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Try a different email
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            © 2026 Safaricom Ethiopia PLC
          </p>
        </div>
      </div>
    </div>
  );
}