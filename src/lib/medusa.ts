/**
 * Medusa Store API client.
 *
 * VITE_MEDUSA_PUBLISHABLE_KEY must be set in the deployment environment.
 * VITE_MEDUSA_BACKEND_URL defaults to the Railway backend if unset.
 *
 * All functions return null on any network/API error so callers can fall back
 * to static data gracefully.
 */

const BACKEND_URL =
  (import.meta.env.VITE_MEDUSA_BACKEND_URL as string | undefined) ??
  "https://vedaarna-studio-production.up.railway.app";

const PK = (import.meta.env.VITE_MEDUSA_PUBLISHABLE_KEY as string | undefined) ?? "";

// ---------------------------------------------------------------------------
// Minimal Medusa Store API response shapes (only the fields we actually use)
// ---------------------------------------------------------------------------

// Auth / Customer shapes
export interface MedusaCustomer {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
}

export interface AuthResult {
  token: string;
  customer: MedusaCustomer;
}

export interface AuthError {
  message: string;
}

export interface MedusaImage {
  url: string;
}

export interface MedusaVariant {
  id: string;
  title: string; // size label, e.g. "S", "M"
}

export interface MedusaProduct {
  id: string;
  handle: string;
  title: string;
  thumbnail: string | null;
  images: MedusaImage[];
  variants: MedusaVariant[];
  /** Medusa stores the collection relation here */
  collection?: { handle: string } | null;
  tags?: { value: string }[];
  metadata?: Record<string, unknown>;
}

export interface MedusaCollection {
  id: string;
  handle: string;
  title: string;
  metadata?: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Auth token storage (client-side only — guards typeof window)
// ---------------------------------------------------------------------------

const TOKEN_KEY = "vs_auth_token";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

// ---------------------------------------------------------------------------
// Fetch helpers
// ---------------------------------------------------------------------------

async function storeGet<T>(path: string, params?: Record<string, string>): Promise<T | null> {
  try {
    const url = new URL(`${BACKEND_URL}/store${path}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString(), {
      headers: {
        "x-publishable-api-key": PK,
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function fetchMedusaProducts(collectionHandle?: string): Promise<MedusaProduct[]> {
  const params: Record<string, string> = {
    // * prefix expands relations in Medusa Store API v2
    fields: "*images,*variants,*collection,*tags,handle,title,thumbnail,metadata",
    limit: "100",
  };
  const data = await storeGet<{ products: MedusaProduct[] }>("/products", params);
  if (!data?.products) return [];
  if (!collectionHandle) return data.products;
  // "new-arrivals" is stored as a tag, not a collection handle
  if (collectionHandle === "new-arrivals") {
    return data.products.filter((p) => p.tags?.some((t) => t.value === "new-arrivals"));
  }
  return data.products.filter((p) => p.collection?.handle === collectionHandle);
}

export async function fetchMedusaCollections(): Promise<MedusaCollection[]> {
  const data = await storeGet<{ collections: MedusaCollection[] }>("/collections");
  return data?.collections ?? [];
}

// ---------------------------------------------------------------------------
// Auth API — Register, Login, Get current customer, Logout
// ---------------------------------------------------------------------------

/**
 * Register a new customer.
 * Medusa v2 flow: POST /store/customers (create) → POST /auth/customer/emailpass (get token).
 */
export async function registerCustomer(params: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
}): Promise<AuthResult | AuthError> {
  try {
    // Step 1 — create the customer record
    const createRes = await fetch(`${BACKEND_URL}/store/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PK,
      },
      body: JSON.stringify({
        email: params.email,
        password: params.password,
        first_name: params.first_name,
        last_name: params.last_name,
        ...(params.phone ? { phone: params.phone } : {}),
      }),
    });

    if (!createRes.ok) {
      const err = await createRes.json().catch(() => ({}));
      const msg = (err as { message?: string }).message ?? "Registration failed. Please try again.";
      return { message: msg };
    }

    // Step 2 — exchange credentials for a JWT token
    return loginCustomer({ email: params.email, password: params.password });
  } catch {
    return { message: "Network error. Please check your connection and try again." };
  }
}

/**
 * Login an existing customer.
 * Returns AuthResult with token on success, AuthError on failure.
 */
export async function loginCustomer(params: {
  email: string;
  password: string;
}): Promise<AuthResult | AuthError> {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/customer/emailpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PK,
      },
      body: JSON.stringify({ email: params.email, password: params.password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg = (err as { message?: string }).message ?? "Incorrect email or password.";
      return { message: msg };
    }

    const data = (await res.json()) as { token: string };
    const token = data.token;

    // Fetch customer profile with the new token
    const customer = await fetchCurrentCustomer(token);
    if (!customer) return { message: "Login succeeded but could not load your profile." };

    return { token, customer };
  } catch {
    return { message: "Network error. Please check your connection and try again." };
  }
}

/**
 * Fetch the currently authenticated customer using a bearer token.
 */
export async function fetchCurrentCustomer(token: string): Promise<MedusaCustomer | null> {
  try {
    const res = await fetch(`${BACKEND_URL}/store/customers/me`, {
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": PK,
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { customer: MedusaCustomer };
    return data.customer ?? null;
  } catch {
    return null;
  }
}
