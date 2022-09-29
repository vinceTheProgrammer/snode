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

// Original: (https://github.com/favware/dragonite/blob/489afb1decfad9564e2cfe282baa3002447e95c7/src/lib/util/functions/time.ts)

import { Time } from '@sapphire/time-utilities';
import { roundNumber } from '@sapphire/utilities';

/**
 * Converts a number of seconds to milliseconds.
 * @param seconds The amount of seconds
 * @returns The amount of milliseconds `seconds` equals to.
 */
export function seconds(seconds: number): number {
  return seconds * Time.Second;
}

/**
 * Converts a number of milliseconds to seconds.
 * @param milliseconds The amount of milliseconds
 * @returns The amount of seconds `milliseconds` equals to.
 */
seconds.fromMilliseconds = (milliseconds: number): number => {
  return roundNumber(milliseconds / Time.Second);
};

/**
 * Converts a number of minutes to milliseconds.
 * @param minutes The amount of minutes
 * @returns The amount of milliseconds `minutes` equals to.
 */
export function minutes(minutes: number): number {
  return minutes * Time.Minute;
}

/**
 * Converts a number of minutes to seconds.
 * @param value The amount of minutes
 * @returns The amount of seconds `value` equals to.
 */
minutes.toSeconds = (value: number): number => {
  return roundNumber(minutes(value) / Time.Second);
};

/**
 * Converts a number of hours to milliseconds.
 * @param hours The amount of hours
 * @returns The amount of milliseconds `hours` equals to.
 */
export function hours(hours: number): number {
  return hours * Time.Hour;
}

/**
 * Converts a number of days to milliseconds.
 * @param days The amount of days
 * @returns The amount of milliseconds `days` equals to.
 */
export function days(days: number): number {
  return days * Time.Day;
}

/**
 * Converts a number of months to milliseconds.
 * @param months The amount of months
 * @returns The amount of milliseconds `months` equals to.
 */
export function months(months: number): number {
  return months * Time.Month;
}

/**
 * Converts a number of years to milliseconds.
 * @param years The amount of years
 * @returns The amount of milliseconds `years` equals to.
 */
export function years(years: number): number {
  return years * Time.Year;
}