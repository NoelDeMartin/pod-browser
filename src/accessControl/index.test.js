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

import * as solidClientFns from "@inrupt/solid-client";
import {
  addMockResourceAclTo,
  mockSolidDatasetFrom,
} from "@inrupt/solid-client";
import AcpAccessControlStrategy from "./acp";
import WacAccessControlStrategy from "./wac";
import {
  getAccessControl,
  hasAccess,
  isAcp,
  isWac,
  noAccessPolicyError,
} from "./index";

const acp = solidClientFns.acp_v1;
const acp3 = solidClientFns.acp_v3;

jest.mock("./acp");
jest.mock("./wac");

const resourceIri = "http://example.com";
const resource = mockSolidDatasetFrom(resourceIri);

describe("hasAccess", () => {
  it("checks whether resource is accessible either through ACP or WAC", () => {
    const resourceWithWac = addMockResourceAclTo(resource);
    const resourceWithAcp = acp.addMockAcrTo(resource);
    jest
      .spyOn(acp, "hasLinkedAcr")
      .mockImplementation((r) => r === resourceWithAcp);

    expect(hasAccess(resource)).toBeFalsy();
    expect(hasAccess(resourceWithWac)).toBeTruthy();
    expect(hasAccess(resourceWithAcp)).toBeTruthy();
  });
});

describe("isAcp", () => {
  it("returns true if type is ACP given an access control type", () => {
    const accessControlType = "acp";
    expect(isAcp(accessControlType)).toBeTruthy();
  });
  it("returns false if type is not ACP given an access control type", () => {
    const accessControlType = "wac";
    expect(isAcp(accessControlType)).toBeFalsy();
  });
});
describe("isWac", () => {
  it("returns true if type is WAC given an access control type", () => {
    const accessControlType = "wac";
    expect(isWac(accessControlType)).toBeTruthy();
  });
  it("returns false if type is not WAC given an access control type", () => {
    const accessControlType = "acp";
    expect(isWac(accessControlType)).toBeFalsy();
  });
});

describe("getAccessControl", () => {
  let result;
  const policiesContainerUrl = "policiesContainer";
  const fetch = "fetch";
  const acpStrategy = "acpStrategy";
  const wacStrategy = "wacStrategy";

  beforeEach(() => {
    jest.spyOn(WacAccessControlStrategy, "init").mockReturnValue(wacStrategy);
    jest.spyOn(AcpAccessControlStrategy, "init").mockReturnValue(acpStrategy);
  });

  it("throws error if no ACL is found", async () => {
    await expect(
      getAccessControl(resource, policiesContainerUrl, fetch)
    ).rejects.toEqual(new Error(noAccessPolicyError));
  });
  describe("ACP is supported", () => {
    beforeEach(async () => {
      jest.spyOn(acp, "hasLinkedAcr").mockReturnValue(true);
      jest.spyOn(acp3, "isAcpControlled").mockReturnValue(true);

      result = await getAccessControl(
        resource,
        policiesContainerUrl,
        fetch,
        false,
        "acp"
      );
    });

    it("calls AcpAccessControlStrategy.init, defaulting to the latest ACP systems", () =>
      expect(AcpAccessControlStrategy.init).toHaveBeenCalledWith(
        resource,
        policiesContainerUrl,
        fetch,
        false
      ));

    it("returns the result from WacAccessControlStrategy.init", () =>
      expect(result).toBe(acpStrategy));
  });

  describe("WAC is supported", () => {
    beforeEach(async () => {
      jest.spyOn(acp3, "isAcpControlled").mockReturnValue(false);
      jest.spyOn(solidClientFns, "hasAccessibleAcl").mockReturnValueOnce(true);
      result = await getAccessControl(
        resource,
        policiesContainerUrl,
        fetch,
        false,
        "wac"
      );
    });

    it("calls WacAccessControlStrategy.init", () =>
      expect(WacAccessControlStrategy.init).toHaveBeenCalledWith(
        resource,
        fetch
      ));

    it("returns the result from WacAccessControlStrategy.init", () =>
      expect(result).toBe(wacStrategy));
  });
});
