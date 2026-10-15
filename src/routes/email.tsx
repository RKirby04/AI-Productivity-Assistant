import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, Field, fieldClass } from "@/components/ToolPage";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Customer Message Generator — Sweet Treats" },
      { name: "description", content: "Write order confirmations, quotes, reminders and promotions for your bakery customers." },
      { property: "og:title", content: "Customer Message Generator — Sweet Treats" },
      { property: "og:description", content: "AI-written bakery customer emails and WhatsApp messages." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="email"
      badge="AI writing"
      title="Smart customer messages"
      description="Generate a subject line and editable message, then copy it to email or WhatsApp."
      buildInput={(f) => `Message type: ${f.get("type")}\nTone: ${f.get("tone")}\nCustomer: ${f.get("customer") || "unknown"}\nDetails: ${f.get("details")}`}
    >
      <Field label="Message type">
        <select name="type" className={fieldClass}>
          {["Cake order reply", "Quotation", "Order confirmation", "Collection reminder", "Promotion", "Complaint response"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Tone">
        <select name="tone" className={fieldClass}>
          {["Friendly", "Professional", "Apologetic", "Persuasive"].map((o) => <option key={o}>{o}</option>)}
        </select>
      </Field>
      <Field label="Customer name"><input name="customer" className={fieldClass} placeholder="e.g. Thandi" /></Field>
      <Field label="Details">
        <textarea name="details" required rows={6} className={fieldClass} placeholder="2-tier vanilla wedding cake, collection Saturday 10am, R1,800 total, 50% deposit paid" />
      </Field>
    </ToolPage>
  ),
});
