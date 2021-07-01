import { Container } from "../components/Container";
import { NavBar } from "../components/NavBar";
import { ReportCategoryManager } from "../components/CampaignCategoryManager";

export function AdministratorPage() {
  return (
    <>
      <NavBar />
      <Container>
        <h1>Administrator</h1>
        <ReportCategoryManager/>
      </Container>
    </>
  )
}