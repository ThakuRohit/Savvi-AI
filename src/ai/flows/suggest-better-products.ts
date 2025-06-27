// src/ai/flows/suggest-better-products.ts
'use server';

/**
 * @fileOverview An AI agent that suggests better products based on user input, filters, and external data.
 *
 * - suggestBetterProducts - A function that handles the product suggestion process.
 * - SuggestBetterProductsInput - The input type for the suggestBetterProducts function.
 * - SuggestBetterProductsOutput - The return type for the suggestBetterProducts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBetterProductsInputSchema = z.object({
  searchQuery: z.string().describe('The user provided search query.'),
  filters: z
    .object({
      rating: z.number().optional().describe('The rating filter for the products.'),
      price: z.object({min: z.number().optional(), max: z.number().optional()}).optional().describe('The price filter for the products.'),
      country: z.string().optional().describe('The country for product search (e.g., "US", "IN").'),
      language: z.string().optional().describe('The language for the response (e.g., "en", "hi", "es").'),
    })
    .optional()
    .describe('The filters applied to the product search.'),
  externalProductData: z.string().optional().describe('External product data from APIs.'),
});

export type SuggestBetterProductsInput = z.infer<typeof SuggestBetterProductsInputSchema>;

const SuggestBetterProductsOutputSchema = z.object({
  suggestedProducts: z
    .array(
      z.object({
        name: z.string().describe('The name of the suggested product.'),
        url: z.string().describe('The URL link to the suggested product. Must be a valid URL.'),
      })
    )
    .describe('A list of suggested products that are better alternatives, including their names and URLs.'),
  reasoning: z.string().describe('The reasoning behind the product suggestions.'),
});

export type SuggestBetterProductsOutput = z.infer<typeof SuggestBetterProductsOutputSchema>;

export async function suggestBetterProducts(
  input: SuggestBetterProductsInput
): Promise<SuggestBetterProductsOutput> {
  return suggestBetterProductsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestBetterProductsPrompt',
  input: {schema: SuggestBetterProductsInputSchema},
  output: {schema: SuggestBetterProductsOutputSchema},
  prompt: `You are an AI expert in product suggestions, localized for different regions and languages.

Based on the user's initial search query, filters, and external product data, suggest alternative or superior products.
For each suggested product, you MUST provide a name and a valid URL.
Explain the reasoning behind each suggestion. If a language is specified, you MUST respond in that language.

Search Query: {{{searchQuery}}}
{{#if filters}}
Filters:
{{#if filters.country}}  - Country: {{filters.country}}{{/if}}
{{#if filters.language}}  - Language for response: {{filters.language}}{{/if}}
{{#if filters.price}}  - Price Range: {{#if filters.price.min}} {{{filters.price.min}}}{{else}}any{{/if}} to {{#if filters.price.max}} {{{filters.price.max}}}{{else}}any{{/if}}{{/if}}
{{#if filters.rating}}  - Minimum Rating: {{filters.rating}}+ stars{{/if}}
{{/if}}
External Product Data: {{{externalProductData}}}

Suggest alternative or superior products the user might not have found on their own, and explain why they are better options.
Format your response as a list of suggested products (each with a name and a URL) and a detailed reasoning.
  `,
});

const suggestBetterProductsFlow = ai.defineFlow(
  {
    name: 'suggestBetterProductsFlow',
    inputSchema: SuggestBetterProductsInputSchema,
    outputSchema: SuggestBetterProductsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
