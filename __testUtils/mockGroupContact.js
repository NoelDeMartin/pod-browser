/**
 * Copyright 2020 Inrupt Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
 * Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { mockSolidDatasetFrom, setThing, setUrl } from "@inrupt/solid-client";
import { chain } from "../src/solidClientHelpers/utils";
import { createGroupDatasetUrl } from "../src/models/contact/group";
import { vcardExtras } from "../src/addressBook";
import { mockGroupThing } from "./mockGroup";

export function mockIndexThing(addressBook, groupThingUrl) {
  return setUrl(addressBook.thing, vcardExtras("includesGroup"), groupThingUrl);
}

export function addGroupToMockedIndexDataset(
  dataset,
  addressBook,
  name,
  groupThingUrl
) {
  return chain(
    dataset,
    (d) => setThing(d, mockGroupThing(name, groupThingUrl)),
    (d) => setThing(d, mockIndexThing(addressBook, groupThingUrl))
  );
}

export default function mockGroupContact(addressBook, name, { url, id } = {}) {
  const groupDatasetUrl = url || createGroupDatasetUrl(addressBook, id);
  const groupThingUrl = `${groupDatasetUrl}#this`;
  const groupThing = mockGroupThing(name, groupThingUrl);
  return {
    dataset: chain(
      mockSolidDatasetFrom(groupDatasetUrl),
      (d) => setThing(d, groupThing),
      (d) => setThing(d, mockIndexThing(addressBook, groupThingUrl))
    ),
    thing: groupThing,
  };
}
