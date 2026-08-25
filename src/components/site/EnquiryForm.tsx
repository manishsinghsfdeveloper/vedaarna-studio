import { useState } from "react";

export function EnquiryForm({
  fields,
  cta = "Submit enquiry",
  success = "Thank you — our team will be in touch within 2 working days.",
}: {
  fields: { id: string; label: string; type?: string; textarea?: boolean }[];
  cta?: string;
  success?: string;
}) {
  const [sent, setSent] = useState(false);

  return (
    <form
      className="max-w-xl space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
    >
      {fields.map((f) => (
        <div key={f.id}>
          <label htmlFor={f.id} className="text-[11px] tracking-[0.16em] uppercase">
            {f.label}
          </label>
          {f.textarea ? (
            <textarea
              id={f.id}
              rows={4}
              required
              className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
          ) : (
            <input
              id={f.id}
              type={f.type ?? "text"}
              required
              className="mt-2 w-full border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-foreground"
            />
          )}
        </div>
      ))}
      <button className="w-full bg-foreground py-3.5 text-[11px] tracking-[0.24em] text-background uppercase">
        {cta}
      </button>
      {sent && <p className="text-sm text-muted-foreground">{success}</p>}
    </form>
  );
}
