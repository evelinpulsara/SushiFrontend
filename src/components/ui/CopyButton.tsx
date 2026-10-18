'use client';

import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/lib/i18n/LanguageProvider';

export function CopyButton({ value }: { value: string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-3 py-1 text-xs text-mist transition hover:border-gold/50 hover:text-gold"
    >
      {copied ? <Check className="size-3.5 text-matcha" /> : <Copy className="size-3.5" />}
      {copied ? t.common.copied : t.common.copy}
    </button>
  );
}
