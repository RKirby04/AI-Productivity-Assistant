import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, Field, fieldClass } from "@/components/ToolPage";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "Production Planner — Sweet Treats" },
      { name: "description", content: "Plan daily baking schedules around orders, oven capacity and staff." },
      { property: "og:title", content: "Production Planner — Sweet Treats" },
      { property: "og:description", content: "AI daily baking schedules that prioritise urgent orders and reduce waste." },
    ],
  }),
  component: () => (
    <ToolPage
      tool="planner"
      badge="AI planning"
      title="Production planner"
      description="Tell us your orders, expected demand and resources. Get a prioritised schedule with warnings for unrealistic timing or overproduction."
      buildInput={(f) => `Date: ${f.get("date")}\nOrders:\n${f.get("orders")}\nExpected walk-in demand / past sales:\n${f.get("demand")}\nOvens: ${f.get("ovens")}\nStaff: ${f.get("staff")}\nOpening hours: ${f.get("hours")}`}
    >
      <Field label="Day to plan"><input name="date" type="date" className={fieldClass} /></Field>
      <Field label="Orders">
        <textarea name="orders" required rows={5} className={fieldClass} placeholder={"Wedding cake 3-tier, collect 2pm\n24 cupcakes, collect 11am"} />
      </Field>
      <Field label="Expected demand or past sales">
        <textarea name="demand" rows={3} className={fieldClass} placeholder="Usually sell ~60 croissants, 40 muffins, 15 loaves on Saturdays" />
      </Field>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Ovens"><input name="ovens" className={fieldClass} defaultValue="2 deck ovens" /></Field>
        <Field label="Staff"><input name="staff" className={fieldClass} defaultValue="3 bakers" /></Field>
        <Field label="Hours"><input name="hours" className={fieldClass} defaultValue="5am–3pm" /></Field>
      </div>
    </ToolPage>
  ),
});
