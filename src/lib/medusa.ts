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
  (import.meta.env["VITE_MEDUSA_BACKEND_URL"] as string | undefined) ??
  "https://vedaarna-studio-production.up.railway.app";

const PK = (import.meta.env["VITE_MEDUSA_PUBLISHABLE_KEY"] as string | undefined) ?? "";

// ---------------------------------------------------------------------------
// Minimal Medusa Store API response shapes (only the fields we actually use)
// ---------------------------------------------------------------------------

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
    fields: "id,handle,title,thumbnail,images,variants,collection,tags,metadata",
    limit: "100",
  };
  const data = await storeGet<{ products: MedusaProduct[] }>("/products", params);
  if (!data?.products) return [];
  if (!collectionHandle) return data.products;
  return data.products.filter((p) => p.collection?.handle === collectionHandle);
}

export async function fetchMedusaCollections(): Promise<MedusaCollection[]> {
  const data = await storeGet<{ collections: MedusaCollection[] }>("/collections");
  return data?.collections ?? [];
}
