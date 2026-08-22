type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
};

/** Injecte du JSON-LD dans le HTML (SEO / rich results). */
export function JsonLd({ data }: JsonLdProps) {
  const graphs = Array.isArray(data) ? data : [data];

  return (
    <>
      {graphs.map((graph, index) => (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
          key={index}
          type="application/ld+json"
        />
      ))}
    </>
  );
}
