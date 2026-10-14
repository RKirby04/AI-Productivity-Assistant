import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const PROMPTS: Record<string, string> = {
  email: `Write a customer message for a bakery. Output exactly:
**Subject:** <subject line>

<message body ready to paste into email or WhatsApp>
Match the requested tone. Keep it under 180 words. Use placeholders like [Customer name] only when details are missing.`,
  orders: `Turn the customer conversation / order notes into baking instructions. Output these markdown sections:
## Order summary (table: Item, Flavour, Size, Quantity, Decoration)
## Dates & deadlines
## Missing information (questions to ask the customer)
## Possible conflicts or risks
## Baker's checklist (- [ ] items)`,
  planner: `Create a realistic daily baking production plan. Output:
## Priorities (custom/urgent orders first)
## Schedule (table: Time, Task, Oven/Station, Staff)
## Quantities to bake (table with reasoning)
## Warnings (unrealistic timing, oven capacity, overproduction risk)
State assumptions about prep and bake times.`,
  research: `Act as an ingredient & business analyst for a bakery. Output:
## Cost breakdown (table: Ingredient, Qty, Unit price, Cost) using only owner-supplied prices
## Cost per unit & suggested price / margin
## Waste-reduction ideas
## Product / promotion ideas
## Assumptions & missing cost information`,
};

export const runBakeryTool = createServerFn({ method: "POST" })
  .inputValidator(z.object({ tool: z.enum(["email", "orders", "planner", "research"]), input: z.string().min(1).max(8000) }))
  .handler(async ({ data }) => {
    const { streamBakery, BAKERY_SYSTEM } = await import("./ai.server");
    try {
      const { result } = streamBakery({
        instructions: `${BAKERY_SYSTEM}\n\n${PROMPTS[data.tool]}`,
        messages: [{ role: "user", content: data.input }],
      });
      const text = await result.text;
      if (!text.trim()) return { ok: false as const, error: "The AI returned no answer. Please try again." };
      return { ok: true as const, text };
    } catch (e: unknown) {
      const status = (e as { statusCode?: number })?.statusCode;
      if (status === 429) return { ok: false as const, error: "Too many requests — please wait a moment and try again." };
      if (status === 402) return { ok: false as const, error: "AI credits are used up. Add credits in your workspace billing settings." };
      return { ok: false as const, error: e instanceof Error ? e.message : "Something went wrong." };
    }
  });
