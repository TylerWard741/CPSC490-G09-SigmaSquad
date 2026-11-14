"""Tests for the status-label rule (task #72), named by requirement.

FR-1, FR-3, FR-4 and FR-5 are in docs/specs/recommendations-and-alerts.md;
FR-11 (single mileage as a window) is the case #72 hands to #73, tested here
because the rule must already accept it. The window used throughout is
5,000-6,000 miles, so the boundaries are 4,499 / 4,500 / 5,000 / 6,000 / 6,001.
"""
import pytest

from label_rule import (
    DUE_NOW,
    DUE_SOON,
    DUE_SOON_THRESHOLD_MILES,
    OVERDUE,
    WHEN_CONVENIENT,
    label,
)

START = 5000
END = 6000


def test_threshold_is_500_miles():
    assert DUE_SOON_THRESHOLD_MILES == 500


def test_fr1_more_than_500_miles_before_start_is_when_convenient():
    assert label(START - 501, START, END) == WHEN_CONVENIENT
    assert label(0, START, END) == WHEN_CONVENIENT


def test_fr3_exactly_500_miles_before_start_is_due_soon():
    assert label(START - 500, START, END) == DUE_SOON


def test_fr3_1_mile_before_start_is_due_soon():
    assert label(START - 1, START, END) == DUE_SOON


def test_fr4_exactly_at_start_is_due_now():
    assert label(START, START, END) == DUE_NOW


def test_fr4_inside_window_is_due_now():
    assert label(5500, START, END) == DUE_NOW


def test_fr4_exactly_at_end_is_due_now():
    assert label(END, START, END) == DUE_NOW


def test_fr5_1_mile_past_end_is_overdue():
    assert label(END + 1, START, END) == OVERDUE


def test_fr5_far_past_end_is_overdue():
    assert label(END + 10000, START, END) == OVERDUE


@pytest.mark.parametrize(
    ("current", "expected"),
    [
        (4499, WHEN_CONVENIENT),
        (4500, DUE_SOON),
        (5000, DUE_NOW),
        (5001, OVERDUE),
    ],
)
def test_fr11_single_mileage_is_a_window_with_equal_start_and_end(current, expected):
    assert label(current, 5000, 5000) == expected


def test_window_end_before_start_is_rejected():
    with pytest.raises(ValueError):
        label(5000, 6000, 5000)
