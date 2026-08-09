/**
 * Fallback OpenAI model for every assistant-backed surface (chat in
 * assistant.ts, structured extraction in navigator.ts) when the deployment
 * does not set OPENAI_MODEL. One constant so a model rotation cannot drift
 * between the two call sites. gpt-5-nano is the cheapest current tier; the
 * transport pins reasoning_effort/verbosity to the floor for it (see
 * convex/lib/openaiChat.ts).
 */
export const DEFAULT_ASSISTANT_MODEL = 'gpt-5-nano'
