'use client';

import { useEffect, useState } from 'react';
import type { BookingMessageRole } from '@prisma/client';

type Message = {
  id: string;
  senderRole: BookingMessageRole;
  body: string;
  createdAt: string;
};

type BookingMessageThreadProps = {
  messages: Message[];
  viewerRole: BookingMessageRole;
  onSend: (body: string) => Promise<void>;
  disabled?: boolean;
};

export function BookingMessageThread({ messages, viewerRole, onSend, disabled }: BookingMessageThreadProps) {
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || disabled) return;

    setSending(true);
    setError('');

    try {
      await onSend(body.trim());
      setBody('');
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to send message.');
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    // no-op placeholder if we add scroll-into-view later
  }, [messages.length]);

  return (
    <div className="rounded-2xl border border-white/10 bg-forest-900/60 p-5">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-amber-glow">Conversation</h3>

      <div className="mt-4 max-h-96 space-y-3 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-sand-200/60">No messages yet. Start the conversation below.</p>
        ) : (
          messages.map((message) => {
            const isSelf = message.senderRole === viewerRole;
            return (
              <div
                key={message.id}
                className={`rounded-2xl px-4 py-3 text-sm ${
                  isSelf
                    ? 'ml-8 border border-amber-glow/20 bg-amber-glow/10 text-sand-50'
                    : 'mr-8 border border-white/10 bg-white/5 text-sand-200/80'
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-sand-200/50">
                  {message.senderRole === 'OWNER' ? 'Owner' : 'You'}
                </p>
                <p className="mt-2 whitespace-pre-wrap">{message.body}</p>
              </div>
            );
          })
        )}
      </div>

      {!disabled && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-white/15 bg-forest-950/80 px-4 py-3 text-sm text-sand-50"
            placeholder="Write a message…"
          />
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="inline-flex rounded-full bg-gradient-to-r from-amber-glow to-amber-deep px-5 py-2.5 text-sm font-semibold text-forest-950 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? 'Sending…' : 'Send message'}
          </button>
        </form>
      )}
    </div>
  );
}
