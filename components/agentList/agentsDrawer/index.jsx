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

import React from "react";
import Link from "next/link";
import T from "prop-types";
import { schema } from "rdf-namespaces";
import {
  ActionMenu,
  ActionMenuItem,
  Drawer,
} from "@inrupt/prism-react-components";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import DeleteContactButton from "../../deleteContactButton";
import { buildProfileLink } from "../../profileLink";

export default function AgentsDrawer({
  open,
  onClose,
  onDelete,
  selectedContactName,
  profileIri,
  agentType,
}) {
  const actionMenuBem = ActionMenu.useBem();

  const path = agentType === schema.Person ? "person" : "app";
  return (
    <Drawer open={open} close={onClose}>
      <Accordion defaultExpanded square>
        <AccordionSummary expandIcon={<ExpandMore />}>Actions</AccordionSummary>
        <AccordionDetails>
          <ActionMenu>
            <ActionMenuItem>
              <Link href={buildProfileLink(profileIri, "/privacy", path)}>
                <a className={actionMenuBem("action-menu__trigger")}>
                  View Profile
                </a>
              </Link>
            </ActionMenuItem>
            <ActionMenuItem>
              <DeleteContactButton
                className={actionMenuBem("action-menu__trigger", "danger")}
                onDelete={onDelete}
                name={selectedContactName}
                webId={profileIri}
              />
            </ActionMenuItem>
          </ActionMenu>
        </AccordionDetails>
      </Accordion>
    </Drawer>
  );
}

AgentsDrawer.propTypes = {
  open: T.bool.isRequired,
  onClose: T.func.isRequired,
  onDelete: T.func.isRequired,
  selectedContactName: T.string.isRequired,
  profileIri: T.string.isRequired,
  agentType: T.string.isRequired,
};
