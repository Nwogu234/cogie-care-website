/*
 * Accept Invite Page
 * Validates an admin invite token and allows the user to accept it.
 * Flow: Visit link → validate token → login if needed → accept → redirect to admin
 */
import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import PageLayout from "@/components/PageLayout";
import { Shield, CheckCircle, XCircle, Loader2, LogIn } from "lucide-react";

export default function AcceptInvite() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const params = new URLSearchParams(search);
  const token = params.get("token") || "";

  const { data: validation, isLoading: validating } = trpc.invite.validate.useQuery(
    { token },
    { enabled: !!token }
  );

  const acceptMutation = trpc.invite.accept.useMutation({
    onSuccess: () => {
      // Redirect to admin after a short delay
      setTimeout(() => {
        window.location.href = "/admin";
      }, 2000);
    },
  });

  const handleAccept = () => {
    if (token) {
      acceptMutation.mutate({ token });
    }
  };

  // No token provided
  if (!token) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="max-w-md mx-auto px-4 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1
              className="text-2xl font-semibold text-navy mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Invalid Invite Link
            </h1>
            <p className="text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
              This invite link is missing a token. Please check the link you received and try again.
            </p>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Loading states
  if (validating || authLoading) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-navy animate-spin mx-auto mb-4" />
            <p className="text-warm-gray" style={{ fontFamily: "var(--font-body)" }}>
              Validating invite...
            </p>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Invalid invite
  if (validation && !validation.valid) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="max-w-md mx-auto px-4 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1
              className="text-2xl font-semibold text-navy mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Invite Not Valid
            </h1>
            <p className="text-warm-gray mb-6" style={{ fontFamily: "var(--font-body)" }}>
              {validation.reason}
            </p>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Go to Homepage
            </button>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Successfully accepted
  if (acceptMutation.isSuccess) {
    return (
      <PageLayout>
        <section className="min-h-[70vh] flex items-center justify-center bg-cream">
          <div className="max-w-md mx-auto px-4 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1
              className="text-2xl font-semibold text-navy mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome to the Team!
            </h1>
            <p className="text-warm-gray mb-2" style={{ fontFamily: "var(--font-body)" }}>
              You now have admin access to Cogie Care Services.
            </p>
            <p className="text-warm-gray text-sm" style={{ fontFamily: "var(--font-body)" }}>
              Redirecting to the admin dashboard...
            </p>
          </div>
        </section>
      </PageLayout>
    );
  }

  // Valid invite — show accept screen
  return (
    <PageLayout>
      <section className="min-h-[70vh] flex items-center justify-center bg-cream">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-cream-dark text-center">
            <div className="w-16 h-16 rounded-full bg-navy/5 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-navy" />
            </div>

            <h1
              className="text-2xl font-semibold text-navy mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Admin Invite
            </h1>

            <p className="text-warm-gray mb-6" style={{ fontFamily: "var(--font-body)" }}>
              You have been invited to join Cogie Care Services as an admin member.
              {validation?.email && (
                <span className="block mt-2 text-sm text-navy/60">
                  Invite sent to: <strong>{validation.email}</strong>
                </span>
              )}
              {validation?.label && (
                <span className="block mt-1 text-sm text-navy/60">
                  Role: <strong>{validation.label}</strong>
                </span>
              )}
            </p>

            {!isAuthenticated ? (
              <div>
                <p className="text-warm-gray text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  Please log in first to accept this invite.
                </p>
                <a
                  href={getLoginUrl()}
                  onClick={() => sessionStorage.setItem("invite_return", `/accept-invite?token=${token}`)}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-navy text-white font-semibold rounded-lg hover:bg-navy-light transition-colors shadow-md"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  <LogIn className="w-4 h-4" />
                  Log In to Accept
                </a>
              </div>
            ) : (
              <div>
                <p className="text-warm-gray text-sm mb-4" style={{ fontFamily: "var(--font-body)" }}>
                  Logged in as <strong>{user?.name || user?.email || "User"}</strong>
                </p>

                {acceptMutation.isError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {acceptMutation.error?.message || "Failed to accept invite. Please try again."}
                  </div>
                )}

                <button
                  onClick={handleAccept}
                  disabled={acceptMutation.isPending}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-lg hover:bg-gold-light transition-colors shadow-md disabled:opacity-50"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {acceptMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Accept Invite
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </PageLayout>
  );
}
