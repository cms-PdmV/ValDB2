import { Container } from "../components/Container";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Chip } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { reportService } from "../services";
import { Report } from "../types";
import { DatetimeSpan } from "../components/DatetimeSpan";
import { ReportStatusLabel } from "../components/ReportStatusLabel";

export function AssignedReportPage(): ReactElement {
  const [reports, setReports] = useState<Report[]>([])

  const history = useHistory()

  useEffect(() => {
    reportService.getAssigned().then(fetchedReports => {
      setReports(fetchedReports)
    })
  }, [])

  return (
    <Container>
      <h1>Assigned Reports</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead style={{fontWeight: 'bold'}}>
            <TableRow>
              <TableCell>Campaign Name</TableCell>
              <TableCell align="left">Group</TableCell>
              <TableCell align="left">Status</TableCell>
              <TableCell align="left">Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id} onClick={() => { history.push(`/campaigns/${report.campaign_name}/report/${report.group}`) }} style={{cursor: 'pointer'}}>
                <TableCell align="left"><strong>{report.campaign_name}</strong></TableCell>
                <TableCell align="left"><Chip label={report.group.replaceAll('.', ' / ')}/></TableCell>
                <TableCell align="left"><ReportStatusLabel status={report.status} /></TableCell>
                <TableCell align="left">{report.created_at ? <DatetimeSpan datetime={report.created_at} updateDatetime={report.updated_at} /> : 'Not Created Yet'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}