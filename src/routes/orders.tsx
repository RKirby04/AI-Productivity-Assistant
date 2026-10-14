import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, Field, fieldClass } from "@/components/ToolPage";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Order Notes Summarizer — BakeWise AI" },
      { name: "description", content: "Turn messy customer chats into clear baking instructions and checklists." },
      { property: "og:title", content: "Order Notes Summarizer — BakeWise AI" },
      { property: "og:description", content: "Extract flavours, sizes, dates and missing details from order notes." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="orders"
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
