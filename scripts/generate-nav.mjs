import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

const docsDir = join(rootDir, "src/routes/docs");
const componentsDir = join(docsDir, "components");
const examplesDir = join(docsDir, "examples");
const outputPath = join(rootDir, "src/lib/generated-nav.json");

// Scan a directory for MDX files and extract frontmatter
function scanDirectory(dir, baseHref) {
  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const items = [];

  for (const file of files) {
    const filePath = join(dir, file);
    const content = readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    const slug = file.replace(".mdx", "");

    // Skip index files - they're handled separately
    if (slug === "index") continue;

    items.push({
      title: data.title || slug.replace(/-/g, " "),
      href: `${baseHref}/${slug}`,
      category: data.category,
      order: data.order ?? 999,
    });
  }

  // Sort by order, then alphabetically by title
  return items.sort((a, b) => {
    if (a.order !== b.order) return a.order - b.order;
    return a.title.localeCompare(b.title);
  });
}

// Generate navigation structure
function generateNav() {
  const components = scanDirectory(componentsDir, "/docs/components");
  const examples = scanDirectory(examplesDir, "/docs/examples");

  // Group components by category
  const chatbotComponents = components.filter(
    (c) => c.category === "chatbot" || !c.category
  );
  const vibeComponents = components.filter((c) => c.category === "vibe");
  const utilityComponents = components.filter((c) => c.category === "utility");
  const docComponents = components.filter((c) => c.category === "docs");

  const navigation = {
    components: {
      chatbot: chatbotComponents,
      vibe: vibeComponents,
      utility: utilityComponents,
      docs: docComponents,
      all: components,
    },
    examples,
    generated: new Date().toISOString(),
  };

  writeFileSync(outputPath, JSON.stringify(navigation, null, 2));
  console.log(`Generated navigation: ${components.length} components, ${examples.length} examples`);
}

generateNav();
