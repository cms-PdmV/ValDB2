import { Container } from "../components/Container";
import { Paper, Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Box, Chip } from "@material-ui/core";
import { ReactElement, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { reportService } from "../services";
import { Report } from "../types";
import { PageLimit } from "../utils/constant";
import { useContext } from "react";
import { UserContext } from "../context/user";
import { useCallback } from "react";
import { DatetimeSpan } from "../components/DatetimeSpan";
import { ReportStatusLabel } from "../components/ReportStatusLabel";

export function MyReportPage(): ReactElement {
  const [reports, setReports] = useState<Report[]>([])
  const [skip, setSkip] = useState<number>(0)
  const [isMaxPage, setIsMaxPage] = useState<boolean>(false)

  const user = useContext(UserContext)
  const history = useHistory()

  useEffect(() => {
    handleLoadReport()
  }, [user])

  const handleLoadReport =  useCallback(() => {
    if (user) {
      reportService.getByUser(skip, PageLimit, user.id).then(fetchedReports => {
        const loadedReports = reports.concat(fetchedReports)
        setReports(loadedReports)
        if (fetchedReports.length < PageLimit) {
          setSkip(skip + PageLimit)
          setIsMaxPage(true)
        } else {
          setSkip(skip + PageLimit)
        }
      }).catch(error => alert(error))
    }
  }, [reports, skip, isMaxPage, user])

  return (
    <Container>
      <h1>My Reports</h1>
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
                <TableCell align="left"><DatetimeSpan datetime={report.created_at} /></TableCell>
              </TableRow>
            ))}
            { !isMaxPage && <a onClick={handleLoadReport} style={{cursor: 'pointer'}}>
              <Box padding="1rem">
                Load More
              </Box>
            </a>}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  )
}