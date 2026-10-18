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
