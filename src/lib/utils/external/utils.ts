// Copyright 2022 Favware


// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at


//     http://www.apache.org/licenses/LICENSE-2.0


// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Modified from original slightly: (https://github.com/favware/dragonite/blob/489afb1decfad9564e2cfe282baa3002447e95c7/src/interaction-handlers/modals/evalModal.ts)

import { container, Events, from, InteractionHandler, isErr, UserError } from '@sapphire/framework';
import { deserialize, serialize } from 'binarytf';
import type { Interaction } from 'discord.js';
import { brotliCompressSync, brotliDecompressSync } from 'node:zlib';

/**
 * Compresses customId metadata using a combination of {@link serialize}
 * from `binarytf` and then compressing it with {@link brotliCompressSync} from `node:zlib`.
 * @param __namedParameter The data to serialize and compress
 * @returns A stringified version of the data using `binary` encoding
 */

export function compressCustomIdMetadata<T>(params: T, customMessagePart?: string): string {
    const serializedId = brotliCompressSync(serialize<T>(params)).toString('binary');
    if (serializedId.length > 80) {
    const resolvedCustomMessagePart = customMessagePart ?? '';
    throw new UserError({
        identifier: 'QueryCausedTooLongCustomId',
        message: `Due to Discord API limitations I was unable to resolve that request. ${resolvedCustomMessagePart}This issue will be fixed in the future.`
    });
    }

    return serializedId;
}

export function decompressCustomIdMetadata<T>(
  content: string,
  { handler, interaction }: { interaction: Interaction; handler: InteractionHandler }
): T {
  const result = from(() =>
    //
    deserialize<T>(brotliDecompressSync(Buffer.from(content, 'binary')))
  );

  if (isErr(result)) {
    // Emit the error
    container.client.emit(Events.InteractionHandlerParseError, result.error as Error, { interaction, handler });

    throw new UserError({
      identifier: 'CustomIdFailedToDeserialize',
      message:
        'I am sorry, but that query failed. Please try again. If the problem persists, then please join the support server (use the /info command)'
    });
  }

  return result.value;
}

export type KeysContaining<O, Str extends string, Keys extends keyof O = keyof O> = Keys extends string
  ? Lowercase<Keys> extends `${string}${Lowercase<Str>}${string}`
    ? Keys
    : never
  : never;