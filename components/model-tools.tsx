"use client";
import { useEffect } from "react";
import { models, weightGB } from "@/lib/models";
type Context = {
  registerTool: (
    tool: {
      name: string;
      description: string;
      inputSchema: object;
      annotations: { readOnlyHint: boolean };
      execute: (input: unknown) => unknown;
    },
    options: { signal: AbortSignal },
  ) => void | Promise<void>;
};
export function ModelTools() {
  useEffect(() => {
    const context = (document as Document & { modelContext?: Context })
      .modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    try {
      void Promise.resolve(
        context.registerTool(
          {
            name: "read_model_comparison",
            description:
              "Read BenchGrid model specifications and calculated weight memory for selected models. Does not provide measured performance. Omit slugs to read the directory.",
            inputSchema: {
              type: "object",
              properties: {
                slugs: {
                  type: "array",
                  items: { type: "string", enum: models.map((m) => m.slug) },
                  maxItems: models.length,
                },
                bits: { type: "integer", enum: [4, 8, 16] },
              },
              additionalProperties: false,
            },
            annotations: { readOnlyHint: true },
            execute(input: unknown) {
              if (!input || typeof input !== "object" || Array.isArray(input))
                throw new Error("Expected an object.");
              const args = input as { slugs?: unknown; bits?: unknown };
              if (Object.keys(args).some((k) => !["slugs", "bits"].includes(k)))
                throw new Error("Unknown argument.");
              const bits = args.bits ?? 16;
              if (typeof bits !== "number" || ![4, 8, 16].includes(bits))
                throw new Error("bits must be 4, 8, or 16.");
              const slugs = args.slugs ?? models.map((m) => m.slug);
              if (
                !Array.isArray(slugs) ||
                slugs.length > models.length ||
                slugs.some(
                  (s) =>
                    typeof s !== "string" || !models.some((m) => m.slug === s),
                )
              )
                throw new Error(
                  "Use model slugs from the directory without exceeding its size.",
                );
              return {
                evidence:
                  "Publisher specifications and calculated estimates; no measured performance.",
                bits,
                units: "decimal GB",
                excludes: [
                  "KV cache",
                  "runtime overhead",
                  "quantization metadata",
                ],
                models: [...new Set(slugs)].map((slug) => {
                  const m = models.find((m) => m.slug === slug)!;
                  return {
                    slug: m.slug,
                    name: m.name,
                    parameters: m.size,
                    activeParameters: m.active ?? (m.architecture.includes("MoE") ? "See model card" : m.size),
                    context: m.context,
                    architecture: m.architecture,
                    license: m.license,
                    weightGB: m.params === null ? null : weightGB(m.params, bits),
                    memoryStatus: m.params === null ? "pending review" : "calculated estimate",
                    source: m.source,
                  };
                }),
              };
            },
          },
          { signal: lifecycle.signal },
        ),
      ).catch(() => {});
    } catch {
      /* Optional browser capability; the normal interface remains available. */
    }
    return () => lifecycle.abort();
  }, []);
  return null;
}
