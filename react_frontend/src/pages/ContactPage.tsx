import { ReactElement } from "react";
import { Container } from "../components/Container";
import { Spacer } from "../components/Spacer";


export function ContactPage(): ReactElement {
  return (
    <Container>
      <h1>Contact & Support</h1>
      <p>
        Dear colleague,
      </p>
      <p>
        If you require support for issues related to operations for validation report, please send an email to:
        &nbsp;<a href="mailto:cms-PPD-conveners-PdmV@cern.ch">PdmV L2 Conveners</a>
      </p>
      <p>
        If you would like to report a bug for this application or propose a feature/improvement.
        Please create an issue via <a href="https://github.com/cms-PdmV/ValDB2/issues" target="_blank">GitHub</a> and provide the following information.
        For reporting bugs, please include the following data:
      </p>
      <ol type="I">
        <li>Issue description</li>
        <li>Steps for reproducing the issue</li>
        <li>Description of expected output</li>
        <li>Description of output received</li>
      </ol>
      <p>
        For new feature proposals, open an issue in GitHub and label it with tag <strong>enhancement</strong> and please include:
      </p>
      <ol type="I">
        <li>Feature description</li>
        <li>Your reasons to support why it would be important to include the feature you are proposing</li>
        <li>Expected inputs and outputs for this new feature</li>
      </ol>
      <p>
        To conclude, for any kind of support/report,
        please include the all the information requested and feel free to include more details if you want.
        This is really useful for us to understand your request and propose you a solution as soon as possible
      </p>
      <p>Thanks</p>
      <p>Best regards</p>
      <p><strong>Physics Data and Monte Carlo Validation team (PdmV)</strong></p>
      <Spacer />
    </Container>
  )
}