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

// Modified from original slightly: (https://github.com/favware/dragonite/blob/489afb1decfad9564e2cfe282baa3002447e95c7/src/lib/util/Sanitizer/initClean.ts)

import { initClean } from './clean';
import { isNullishOrEmpty } from '@sapphire/utilities';

const secrets = new Set<string>();
const suffixes = ['_KEY', '_TOKEN', '_SECRET', '_PASSWORD'];
for (const [key, value] of Object.entries(process.env)) {
  if (isNullishOrEmpty(value)) continue;
  if (suffixes.some((suffix) => key.endsWith(suffix))) secrets.add(value);
}

initClean([...secrets]);