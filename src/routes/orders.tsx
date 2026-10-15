import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, Field, fieldClass } from "@/components/ToolPage";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order Notes Summarizer — Sweet Treats" },
      { name: "description", content: "Turn messy customer chats into clear baking instructions and checklists." },
      { property: "og:title", content: "Order Notes Summarizer — Sweet Treats" },
      { property: "og:description", content: "Extract flavours, sizes, dates and missing details from order notes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <ToolPage
      tool="orders"
      submitLabel="Summarise this order"
      emptyTitle="Your order summary will appear here"
      emptyHint="Sections for the order, deadlines, missing details, possible problems and a baker's checklist."
      tips={["Paste the whole conversation — WhatsApp, email or your own notes.", "Missing details and risks are highlighted so you can ask the customer early."]}
      badge="AI analysis"
      title="Order notes summarizer"
      description="Paste a customer conversation or rough notes. Get flavour, size, quantity, decoration, deadlines, missing info and a baker's checklist."
      buildInput={(f) => `Today's date: ${new Date().toDateString()}\nOrder notes:\n${f.get("notes")}`}
    >
      <Field label="Customer conversation or notes">
        <textarea name="notes" required rows={12} className={fieldClass} placeholder={"Hi! Can I get a chocolate cake for my son's 7th birthday next Friday? Dinosaur theme, green icing. Maybe 20 people? Also 12 cupcakes..."} />
      </Field>
    </ToolPage>
  ),
});
