"use client";

import { useState, useEffect } from "react";
import { Copy, Check, Edit, Share, ThumbsUp, ThumbsDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import DocVersionDiff from "@/components/DocVersionDiff";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

interface DocContentProps {
  docId: string;
  title: string;
  /** HTML produced by remark-html */
  content: string;
  lastUpdated: string;
  version: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                 */
/* -------------------------------------------------------------------------- */

export function DocContent({
  docId,
  title,
  content,
  lastUpdated,
  version,
}: DocContentProps) {
  /* ---------------------------------------------------------------------- */
  /*  Copy-to-clipboard for code fences                                     */
  /* ---------------------------------------------------------------------- */
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Attach a delegated listener once after mount
  useEffect(() => {
    const handler = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLButtonElement>(
        "[data-code-id]",
      );
      if (!target) return;

      const codeId = target.dataset.codeId!;
      const codeEl = document.querySelector<HTMLElement>(`#${codeId}`);
      if (codeEl) {
        navigator.clipboard.writeText(codeEl.innerText);
        setCopiedId(codeId);
        setTimeout(() => setCopiedId(null), 2000);
      }
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, []);

  // Remove the first <h1>...</h1> from the markdown content to avoid duplicate titles
  const contentWithoutFirstH1 = content.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "");

  /* ---------------------------------------------------------------------- */
  /*  State                                                                 */
  /* ---------------------------------------------------------------------- */
  const [versions, setVersions] = useState<string[]>([])
  useEffect(() => {
    fetch("/api/versions")
      .then(res => res.json())
      .then(setVersions)
      .catch(() => setVersions([]))
  }, [])

  /* ---------------------------------------------------------------------- */
  /*  Render                                                                */
  /* ---------------------------------------------------------------------- */
  return (
    <article className="prose dark:prose-invert max-w-none">
      {/* -------- Header -------- */}
      <div className="not-prose mb-8">
        <header className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {title}
          </h1>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" size="sm">
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </header>

        <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400">
          <span>
            Last updated: {new Date(lastUpdated).toLocaleDateString()}
          </span>
          <Badge variant="secondary">{version}</Badge>
        </div>

        <DocVersionDiff
          docId={docId}
          currentVersion={version}
          versions={versions}
          currentContent={content}
        />

        <Separator className="mt-6" />
      </div>

      {/* -------- Markdown body -------- */}
      <MarkdownBody html={contentWithoutFirstH1} copiedId={copiedId} />

      {/* -------- Footer -------- */}
      <footer className="not-prose mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
        <p className="mb-2 text-sm text-slate-600 dark:text-slate-400">
          Was this page helpful?
        </p>
        <div className="flex space-x-2 mb-6">
          <FeedbackButton
            icon={ThumbsUp}
            label="Yes"
            name="helpful"
            defaultChecked
          />
          <FeedbackButton
            icon={ThumbsDown}
            label="No"
            name="helpful"
            value="no"
          />
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-400">
          Found an issue?
          <Button variant="link" className="p-0 ml-1 h-auto">
            Edit this page
          </Button>
        </p>
      </footer>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

function MarkdownBody({
  html,
  copiedId,
}: {
  html: string;
  copiedId: string | null;
}) {
  /* Inject a copy button after every fenced code block */
  const withButtons = html.replace(
    /<pre><code class="language-([^"]*)"[^>]*>([\s\S]*?)<\/code><\/pre>/g,
    (match, lang, code, idx) => {
      const id = `code-${idx}`;
      return `
        <div class="relative group">
          <pre id="${id}">${match.slice(5, -6)}</pre>
          <button
            data-code-id="${id}"
            class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition"
          >
            ${
              copiedId === id
                ? '<span class="inline-flex items-center text-xs"><svg class="h-4 w-4"><use href="#check" /></svg> Copied</span>'
                : '<svg class="h-4 w-4"><use href="#copy" /></svg>'
            }
          </button>
        </div>
      `;
    },
  );

  return (
    <div
      dangerouslySetInnerHTML={{ __html: withButtons }}
      // `prose` is on the <article>; no extra class needed here
    />
  );
}

function FeedbackButton({
  icon: Icon,
  label,
  ...props
}: {
  icon: typeof ThumbsUp;
  label: string;
} & React.ComponentProps<"input">) {
  return (
    <label className="inline-flex items-center space-x-1 cursor-pointer">
      <input type="radio" className="hidden peer" {...props} />
      <span className="px-3 py-1 rounded border border-slate-200 dark:border-slate-700 peer-checked:bg-slate-900 peer-checked:text-white">
        <Icon className="inline-block w-4 h-4 mr-1 -mt-0.5" />
        {label}
      </span>
    </label>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

interface DocPageProps {
  params: {
    docId: string;
  };
}

export default function DocPage({ params }: DocPageProps) {
  const { docId } = params;

  /* ---------------------------------------------------------------------- */
  /*  State                                                                 */
  /* ---------------------------------------------------------------------- */
  const [doc, setDoc] = useState<DocContentProps | null>(null);
  const [selectedVersion, setSelectedVersion] = useState<string>("");

  /* ---------------------------------------------------------------------- */
  /*  Effects                                                               */
  /* ---------------------------------------------------------------------- */
  useEffect(() => {
    // TODO: Replace with real data fetching
    setDoc({
      docId,
      title: "Document Title",
      content: "<p>Document content goes here.</p>",
      lastUpdated: new Date().toISOString(),
      version: "1.0.0",
    });
  }, [docId]);

  if (!doc) return null;

  return (
    <DocContent
      docId={doc.docId}
      title={doc.title}
      content={doc.content}
      lastUpdated={doc.lastUpdated}
      version={selectedVersion}
    />
  );
}
