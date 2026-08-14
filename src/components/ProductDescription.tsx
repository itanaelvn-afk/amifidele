import {
  parseProductDescription,
  type DescriptionBlock,
} from "@/lib/format-description";

function BlockView({ block }: { block: DescriptionBlock }) {
  if (block.type === "heading") {
    return (
      <h3 className="text-base font-semibold text-foreground mt-6 mb-2 first:mt-0">
        {block.text}
      </h3>
    );
  }
  if (block.type === "list") {
    return (
      <ul className="list-disc pl-5 space-y-1.5 my-3">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  return <p className="my-3 first:mt-0">{block.text}</p>;
}

const HTML_DESCRIPTION_CLASS =
  "text-muted-foreground leading-relaxed [&_h2]:mt-6 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold [&_h3]:text-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:my-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:my-3 [&_p]:my-3 [&_p]:first:mt-0";

export function ProductDescription({
  text,
  blocks: precomputed,
  html,
}: {
  text?: string;
  blocks?: DescriptionBlock[];
  html?: string;
}) {
  if (html) {
    return (
      <div
        className={HTML_DESCRIPTION_CLASS}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  const blocks =
    precomputed ?? (text ? parseProductDescription(text) : []);
  if (blocks.length === 0) return null;

  return (
    <div className="text-muted-foreground leading-relaxed space-y-0">
      {blocks.map((block, index) => (
        <BlockView
          key={`${block.type}-${index}-${
            block.type === "list" ? block.items[0] : block.text.slice(0, 40)
          }`}
          block={block}
        />
      ))}
    </div>
  );
}
