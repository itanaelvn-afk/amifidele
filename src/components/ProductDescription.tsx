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

export function ProductDescription({ text }: { text: string }) {
  const blocks = parseProductDescription(text);
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
