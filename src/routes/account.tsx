import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Eye, EyeOff, LogOut, Package, User } from "lucide-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import {
  clearStoredToken,
  fetchCurrentCustomer,
  getStoredToken,
  loginCustomer,
  MedusaCustomer,
  registerCustomer,
  setStoredToken,
} from "@/lib/medusa";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "My Account — VedAarna Studio" },
      {
        name: "description",
        content:
          "Sign in or create your VedAarna Studio account to view orders, saved addresses and your wishlist.",
      },
      { property: "og:title", content: "My Account — VedAarna Studio" },
      {
        property: "og:description",
        content: "Access your orders, addresses and wishlist in one place.",
      },
    ],
  }),
  component: AccountPage,
});

// ---------------------------------------------------------------------------
// Helper: is the API response an error?
// ---------------------------------------------------------------------------
function isAuthError(r: unknown): r is { message: string } {
  return typeof r === "object" && r !== null && "message" in r;
}

// ---------------------------------------------------------------------------
// Password visibility toggle input
// ---------------------------------------------------------------------------
function PasswordInput({
  id,
  value,
  onChange,
  placeholder,
  autoComplete,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative mt-2">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full border border-border bg-background px-4 py-3 pr-11 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setShow((v) => !v)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={show ? "Hide password" : "Show password"}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Password strength indicator
// ---------------------------------------------------------------------------
function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "bg-red-400", "bg-amber-400", "bg-yellow-400", "bg-emerald-500"];
  return (
    <div className="mt-2 space-y-1">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i <= score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground">{labels[score]}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Logged-in dashboard view
// ---------------------------------------------------------------------------
function Dashboard({ customer, onLogout }: { customer: MedusaCustomer; onLogout: () => void }) {
  const displayName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") || customer.email;
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
      {/* Welcome header */}
      <div className="flex items-start justify-between border-b border-border pb-8">
        <div>
          <p className="text-[11px] tracking-[0.2em] uppercase text-terracotta">My Account</p>
          <h1 className="mt-2 text-2xl font-display font-normal">
            Welcome back, {customer.first_name || "there"}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{customer.email}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex items-center gap-2 rounded-sm border border-border px-4 py-2 text-xs tracking-wider uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </div>

      {/* Quick tiles */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-sm border border-border p-6 space-y-2">
          <Package className="h-5 w-5 text-terracotta" />
          <h2 className="text-sm font-semibold tracking-wide uppercase">My Orders</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            View your order history, track shipments, and request exchanges.
          </p>
          <p className="mt-2 text-xs text-muted-foreground italic">No orders placed yet.</p>
        </div>
        <div className="rounded-sm border border-border p-6 space-y-2">
          <User className="h-5 w-5 text-terracotta" />
          <h2 className="text-sm font-semibold tracking-wide uppercase">Account Details</h2>
          <div className="mt-2 space-y-1 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Name:</span> {displayName}
            </p>
            <p>
              <span className="font-medium text-foreground">Email:</span> {customer.email}
            </p>
            {customer.phone && (
              <p>
                <span className="font-medium text-foreground">Phone:</span> {customer.phone}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Browse CTA */}
      <div className="mt-10 text-center">
        <Link
          to="/collections/$slug"
          params={{ slug: "new-arrivals" }}
          className="inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.22em] uppercase transition-colors hover:bg-foreground hover:text-background"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------
function AccountPage() {
  // Which panel is showing on mobile: "login" | "register"
  const [panel, setPanel] = useState<"login" | "register">("login");

  // Auth state
  const [customer, setCustomer] = useState<MedusaCustomer | null>(null);
  const [authReady, setAuthReady] = useState(false); // prevents flash of login form on reload

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Register form
  const [regFirst, setRegFirst] = useState("");
  const [regLast, setRegLast] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Restore session from localStorage on mount (client only)
  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setAuthReady(true);
      return;
    }
    fetchCurrentCustomer(token).then((c) => {
      if (c) setCustomer(c);
      else clearStoredToken(); // token expired / invalid
      setAuthReady(true);
    });
  }, []);

  // Keep a stable ref to avoid stale closure in async handlers
  const customerRef = useRef(customer);
  customerRef.current = customer;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    const result = await loginCustomer({ email: loginEmail, password: loginPassword });
    setLoginLoading(false);
    if (isAuthError(result)) {
      setLoginError(result.message);
      return;
    }
    setStoredToken(result.token);
    setCustomer(result.customer);
    setLoginPassword(""); // clear sensitive data from state immediately
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");

    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters.");
      return;
    }
    if (regPassword !== regConfirm) {
      setRegError("Passwords do not match.");
      return;
    }

    setRegLoading(true);
    const result = await registerCustomer({
      email: regEmail,
      password: regPassword,
      first_name: regFirst,
      last_name: regLast,
      ...(regPhone ? { phone: regPhone } : {}),
    });
    setRegLoading(false);

    if (isAuthError(result)) {
      setRegError(result.message);
      return;
    }
    setStoredToken(result.token);
    setCustomer(result.customer);
    setRegPassword(""); // clear sensitive fields
    setRegConfirm("");
  };

  const handleLogout = () => {
    clearStoredToken();
    setCustomer(null);
    setLoginEmail("");
    setLoginPassword("");
  };

  // Avoid flash of login page while we check localStorage
  if (!authReady) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="flex min-h-[50vh] items-center justify-center">
          <span className="text-sm text-muted-foreground tracking-wider animate-pulse">
            Loading…
          </span>
        </div>
        <Footer />
      </div>
    );
  }

  if (customer) {
    return (
      <div className="min-h-screen">
        <Header />
        <main>
          <Dashboard customer={customer} onLogout={handleLogout} />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-20">
        {/* Page heading */}
        <div className="mb-10 text-center">
          <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
            VedAarna Studio
          </p>
          <h1 className="mt-3 text-3xl font-display font-normal tracking-tight">My Account</h1>
        </div>

        {/* Mobile tab switcher */}
        <div className="mb-8 flex border-b border-border md:hidden">
          <button
            type="button"
            onClick={() => setPanel("login")}
            className={`flex-1 pb-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
              panel === "login"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setPanel("register")}
            className={`flex-1 pb-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors ${
              panel === "register"
                ? "border-b-2 border-foreground text-foreground"
                : "text-muted-foreground"
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="grid md:grid-cols-2 md:divide-x md:divide-border gap-12 md:gap-0">
          {/* ── Left: Login ─────────────────────────────────────────────────── */}
          <div className={`md:pr-16 ${panel !== "login" ? "hidden md:block" : ""}`}>
            <h2 className="text-xl tracking-[0.12em] uppercase">Login</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account? Sign in below.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleLogin} noValidate>
              <div>
                <label htmlFor="login-email" className="text-[11px] tracking-[0.18em] uppercase">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label htmlFor="login-pass" className="text-[11px] tracking-[0.18em] uppercase">
                  Password
                </label>
                <PasswordInput
                  id="login-pass"
                  value={loginPassword}
                  onChange={setLoginPassword}
                  placeholder="Your password"
                  autoComplete="current-password"
                />
              </div>

              {loginError && (
                <p
                  role="alert"
                  className="rounded-sm bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700"
                >
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {loginLoading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          {/* ── Right: Create Account ────────────────────────────────────────── */}
          <div className={`md:pl-16 ${panel !== "register" ? "hidden md:block" : ""}`}>
            <h2 className="text-xl tracking-[0.12em] uppercase">Create an Account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Join VedAarna Studio to track orders and enjoy a faster checkout experience.
            </p>

            <form className="mt-8 space-y-5" onSubmit={handleRegister} noValidate>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reg-first" className="text-[11px] tracking-[0.18em] uppercase">
                    First Name
                  </label>
                  <input
                    id="reg-first"
                    type="text"
                    value={regFirst}
                    onChange={(e) => setRegFirst(e.target.value)}
                    placeholder="Ananya"
                    autoComplete="given-name"
                    required
                    className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
                <div>
                  <label htmlFor="reg-last" className="text-[11px] tracking-[0.18em] uppercase">
                    Last Name
                  </label>
                  <input
                    id="reg-last"
                    type="text"
                    value={regLast}
                    onChange={(e) => setRegLast(e.target.value)}
                    placeholder="Sharma"
                    autoComplete="family-name"
                    required
                    className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className="text-[11px] tracking-[0.18em] uppercase">
                  Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label htmlFor="reg-phone" className="text-[11px] tracking-[0.18em] uppercase">
                  Phone <span className="normal-case text-muted-foreground">(optional)</span>
                </label>
                <input
                  id="reg-phone"
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  autoComplete="tel"
                  className="mt-2 w-full border border-border bg-background px-4 py-3 text-sm outline-none focus:border-foreground placeholder:text-muted-foreground/50"
                />
              </div>

              <div>
                <label htmlFor="reg-pass" className="text-[11px] tracking-[0.18em] uppercase">
                  Password
                </label>
                <PasswordInput
                  id="reg-pass"
                  value={regPassword}
                  onChange={setRegPassword}
                  placeholder="Min. 8 characters"
                  autoComplete="new-password"
                />
                <PasswordStrength password={regPassword} />
              </div>

              <div>
                <label htmlFor="reg-confirm" className="text-[11px] tracking-[0.18em] uppercase">
                  Confirm Password
                </label>
                <PasswordInput
                  id="reg-confirm"
                  value={regConfirm}
                  onChange={setRegConfirm}
                  placeholder="Repeat password"
                  autoComplete="new-password"
                />
                {regConfirm && regPassword !== regConfirm && (
                  <p className="mt-1 text-[11px] text-rose-600">Passwords do not match.</p>
                )}
              </div>

              {regError && (
                <p
                  role="alert"
                  className="rounded-sm bg-rose-50 border border-rose-200 px-3 py-2 text-xs text-rose-700"
                >
                  {regError}
                </p>
              )}

              <p className="text-[11px] text-muted-foreground leading-relaxed">
                By creating an account you agree to our{" "}
                <Link
                  to="/privacy-policy"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Privacy Policy
                </Link>{" "}
                and{" "}
                <Link
                  to="/terms-of-use"
                  className="underline underline-offset-2 hover:text-foreground"
                >
                  Terms of Use
                </Link>
                .
              </p>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {regLoading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
