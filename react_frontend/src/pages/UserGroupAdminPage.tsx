import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TextField, TableBody, Box, Accordion, AccordionSummary, AccordionDetails } from "@material-ui/core";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { Container } from "../components/Container";
import { Spacer } from "../components/Spacer";
import { UserGroupList } from "../components/UserGroupList";
import { categoryService, userService } from "../services";
import { Category, User, UserRole } from "../types";
import { userRoleLabel } from "../utils/label";

export function UserGroupAdminPage() {
  
  const [categories, setCategories] = useState<Category[]>()
  const history = useHistory()

  useEffect(() => {
    categoryService.getAll().then((data) => {
      setCategories(data)
    })
  }, [])
  return (
    <Container>
      <Box display="flex">
        <h1>User Groups</h1>
      </Box>
      <Spacer />
      { categories && <>
        <UserGroupList group="Administrator"/>
        { categories.map((category, index) => 
          <Accordion>
            <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
              <strong>{category.name}</strong>
            </AccordionSummary>
            <AccordionDetails style={{display: "block"}}>
              { category.subcategories.map((subcategory, subindex) => 
                <Accordion>
                  <AccordionSummary expandIcon={<FontAwesomeIcon icon={faCaretDown}/>}>
                  <strong>{subcategory.name}</strong>
                  </AccordionSummary>
                  <AccordionDetails style={{display: "block"}}>
                    { subcategory.groups.map((group, groupindex) => 
                      <UserGroupList group={group.path}/>
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