import { createFileRoute } from "@tanstack/react-router";
import { ToolPage, Field, fieldClass } from "@/components/ToolPage";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Ingredient & Cost Assistant — Sweet Treats" },
      { name: "description", content: "Estimate recipe costs and margins, reduce waste and compare product ideas." },
      { property: "og:title", content: "Ingredient & Cost Assistant — Sweet Treats" },
      { property: "og:description", content: "AI recipe costing, margins and waste-reduction ideas for bakeries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <ToolPage
      tool="research"
      submitLabel="Calculate costs & margins"
      emptyTitle="Your cost breakdown will appear here"
      emptyHint="Ingredient costs, cost per batch and per item, margin at your selling price, waste tips and product ideas."
      tips={["Use your own supplier prices — Sweet Treats never invents prices.", "Anything missing is listed as an assumption, not a verified cost."]}
      badge="AI insights"
      title="Ingredients & business research"
      description="Add your recipe, ingredient prices and question. The AI estimates costs and margins and flags anything missing."
      buildInput={(f) => `Product: ${f.get("product")}\nBatch yield: ${f.get("yield")}\nIngredients & prices:\n${f.get("ingredients")}\nCurrent selling price: ${f.get("price") || "not given"}\nQuestion: ${f.get("question") || "Cost and margin analysis"}`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Product"><input name="product" required className={fieldClass} placeholder="Blueberry muffins" /></Field>
        <Field label="Batch yield"><input name="yield" className={fieldClass} placeholder="24 muffins" /></Field>
      </div>
      <Field label="Ingredients and prices">
        <textarea name="ingredients" required rows={6} className={fieldClass} placeholder={"Flour 500g — R18/kg\nSugar 250g — R22/kg\nBlueberries 300g — R60/250g"} />
      </Field>
      <Field label="Current selling price (per unit)"><input name="price" className={fieldClass} placeholder="R25" /></Field>
      <Field label="Question or idea to explore">
        <textarea name="question" rows={2} className={fieldClass} placeholder="Is a winter spiced-pear muffin worth adding?" />
      </Field>
    </ToolPage>
  ),
});
