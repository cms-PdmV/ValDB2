'''
Group data util
'''

import numpy

from data.group import group
from models.report import REPORT_STATUS_LABEL, ReportStatus
from utils.logger import api_logger as _logger


def get_subcategory_from_group(group_path):
    '''
    Get subcategory string from group path string
    '''
    return '.'.join(group_path.split('.')[:2])


def get_progress_matrix(*args) -> dict:
    """
    Compute a matrix to display the report's progress for all the
    campaigns included into a subcategories.
    Moreover, include some metadata with statistics of interest.

    Args:
        category (str): Comparison category
        subcategory (str): Comparison subcategory
        subcategory_reports (dict): The information for the
            subcategory, the campaigns included for the comparison
            and the campaign status per each group.
    Returns:
        dict: The campaign progress per each group included in the
            subcategory and some statistics about this content.
    """
    category, subcategory, subcategory_reports = args
    campaigns_raw: dict = subcategory_reports.pop("campaigns_subcategory")
    campaigns: list[str] = list(campaigns_raw.keys())
    subcategory_groups: list[str] = group[category][subcategory]
    total_reports: int = len(subcategory_groups) * len(campaigns)

    # Count by report's status
    by_status: dict[int, int] = dict(
        zip(REPORT_STATUS_LABEL.keys(), [0] * len(REPORT_STATUS_LABEL))
    )
    by_status[ReportStatus.NOT_YET_DONE] = total_reports

    # Some statistics
    metadata: dict = {
        "total_reports": total_reports,
        "total_filled": 0,
        "per_status": by_status,
    }

    # Create a default matrix: Groups X Campaigns
    progress_matrix = numpy.full(
        shape=(len(campaigns), len(subcategory_groups)),
        fill_value=ReportStatus.NOT_YET_DONE.value,
        dtype=int,
    )

    # Fill the matrix
    for group_name, statuses in subcategory_reports.items():
        try:
            group_idx = subcategory_groups.index(group_name)
        except ValueError:
            continue

        for report_status in statuses:
            campaign_name = report_status["campaign"]
            status = report_status["status"]
            campaign_idx = campaigns.index(campaign_name)

            if status != ReportStatus.NOT_YET_DONE.value:
                # Update the matrix
                progress_matrix[campaign_idx][group_idx] = status

                # Update the metadata
                metadata["total_filled"] += 1
                by_status[ReportStatus.NOT_YET_DONE] -= 1
                as_report_status = ReportStatus(status)
                by_status[as_report_status] += 1

    # Parse the report's category index
    by_status_parsed = {}
    for key, value in by_status.items():
        by_status_parsed[key.value] = value
    metadata["per_status"] = by_status_parsed

    # Parse as a standard list
    progress_matrix = progress_matrix.tolist()

    progress_result: dict = {
        "progress": progress_matrix,
        "metadata": metadata,
        "campaigns": campaigns,
        "groups": subcategory_groups,
        "category": category,
        "subcategory": subcategory,
    }
    return progress_result


def compute_progress_category(*args) -> tuple[str, dict]:
    """Computes the progress for a given category."""
    subcategories_data = {}
    category, subcategories = args
    for subcategory, status in subcategories.items():
        # Check the category and subcategory matches
        if group.get(category, {}).get(subcategory) is None:
            _logger.warning(
                "Category (%s) or subcategory (%s) not available in default groups",
                category,
                subcategory,
            )
            continue

        progress = get_progress_matrix(category, subcategory, status)
        subcategories_data[subcategory] = progress

    return category, subcategories_data
