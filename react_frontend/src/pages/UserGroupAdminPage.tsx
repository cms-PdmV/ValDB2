import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Box, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { Container } from "../components/Container";
import { Spacer } from "../components/Spacer";
import { UserGroupList } from "../components/UserGroupList";
import { categoryService } from "../services";
import { Category } from "../types";

export function UserGroupAdminPage(): ReactElement {

  const [categories, setCategories] = useState<Category[]>()

  useEffect(() => {
    categoryService.getAll().then((data) => {
      setCategories(data)
    })
  }, [])
  return (
    <Container>
      <Box display="flex">
        <h1>Add/Remove Permission</h1>
      </Box>
      <Spacer />
      { categories && <>
        <UserGroupList group="Administrator"/>
        { categories.map((category, index) =>
          <Accordion key={`accordion-${index}`}>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
              <strong>{category.name}</strong>
            </AccordionSummary>
            <AccordionDetails style={{display: "block"}}>
              { category.subcategories.map((subcategory, subindex) =>
                <Accordion key={`${category.name}-accordion-${subindex}`}>
                  <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
                  <strong>{subcategory.name}</strong>
                  </AccordionSummary>
                  <AccordionDetails style={{display: "block"}}>
                    { subcategory.groups.map((group, groupindex) =>
                      <Box key={`${subcategory.name}-accordion-${groupindex}`}>
                        <UserGroupList group={group.path} />
                      </Box>
                    )}
                  </AccordionDetails>
                </Accordion>
              )}
            </AccordionDetails>
          </Accordion>
        )}
      </>}
    </Container>
  )
}