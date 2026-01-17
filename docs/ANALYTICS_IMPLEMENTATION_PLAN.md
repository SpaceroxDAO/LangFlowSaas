# Analytics Dashboard Implementation Plan

## Executive Summary

Based on research into the current implementation and SaaS best practices, this plan addresses:
1. **Bug Fix**: Time frame selector not updating data correctly
2. **Feature Gaps**: Missing SaaS-essential analytics features
3. **Production Readiness**: Scale, reliability, and user experience improvements

---

## Part 1: Root Cause Analysis - Time Frame Bug

### What's Happening

The API **IS** returning correct data (verified via curl):
```json
{
  "period": {"start": "2026-01-09", "end": "2026-01-15", "days": 7},
  "daily": [
    {"date": "2026-01-14", "conversations": 11, "messages": 15, "tokens": 1500}
  ]
}
```

### Likely Issues

1. **SQLite `func.date()` Inconsistency**: The dictionary keys from SQLAlchemy may be strings vs Python `date` objects
2. **Frontend Caching**: React Query may be serving stale cached data
3. **Timezone Mismatch**: `date.today()` (local) vs `datetime.utcnow()` (UTC)

### Immediate Fix Required

```python
# analytics_service.py - Line 99-100
# CURRENT (may fail with SQLite):
func.date(Message.created_at) >= start_date

# FIX: Use string comparison for SQLite compatibility
func.strftime('%Y-%m-%d', Message.created_at) >= start_date.isoformat()
```

---

## Part 2: SaaS Analytics Feature Requirements

### Essential Features (MVP)

| Feature | Current State | Priority |
|---------|--------------|----------|
| Time frame filtering | Broken | P0 - Critical |
| Daily usage chart | Implemented | OK |
| Total metrics cards | Implemented | OK |
| Period comparison | Missing | P1 - High |
| CSV export | Missing | P1 - High |
| Usage by workflow | Implemented | OK |
| Recent activity feed | Implemented | OK |

### Advanced Features (Growth)

| Feature | Description | Priority |
|---------|-------------|----------|
| Cohort analysis | Track user retention over time | P2 |
| Real-time updates | WebSocket-based live metrics | P2 |
| Custom date ranges | Date picker for arbitrary ranges | P2 |
| Alerts/Notifications | Usage threshold warnings | P3 |
| API usage tracking | Per-endpoint call counts | P3 |
| PDF reports | Scheduled email reports | P3 |

---

## Part 3: Implementation Plan

### Phase 1: Bug Fixes (1-2 days)

#### 1.1 Fix SQLite Date Filtering

**File**: `src/backend/app/services/analytics_service.py`

```python
async def _get_daily_stats(self, user_id: str, start_date: date, end_date: date):
    # Convert dates to ISO strings for SQLite compatibility
    start_str = start_date.isoformat()
    end_str = end_date.isoformat()

    msg_stmt = (
        select(
            func.substr(Message.created_at, 1, 10).label("msg_date"),  # Extract YYYY-MM-DD
            func.count(Message.id).label("count"),
        )
        .join(Conversation, Conversation.id == Message.conversation_id)
        .where(
            Conversation.user_id == user_id,
            func.substr(Message.created_at, 1, 10) >= start_str,
            func.substr(Message.created_at, 1, 10) <= end_str,
        )
        .group_by(func.substr(Message.created_at, 1, 10))
    )
```

#### 1.2 Fix Frontend Cache Invalidation

**File**: `src/frontend/src/pages/AnalyticsDashboardPage.tsx`

```tsx
const { data: stats, isLoading, refetch } = useQuery({
  queryKey: ['dashboard-stats', days],
  queryFn: () => api.getDashboardStats(days),
  staleTime: 0,  // Always refetch on query key change
  refetchOnWindowFocus: true,
})

// Add manual refresh button
<button onClick={() => refetch()} className="...">
  <RefreshIcon /> Refresh
</button>
```

#### 1.3 Timezone Consistency

```python
# Use UTC consistently
from datetime import datetime, timezone

def get_today_utc():
    return datetime.now(timezone.utc).date()

end_date = get_today_utc()
start_date = end_date - timedelta(days=days - 1)
```

---

### Phase 2: Period Comparison (2-3 days)

Add "vs previous period" comparison to all metrics.

#### 2.1 Backend Changes

**New method in `analytics_service.py`**:

```python
async def get_dashboard_stats_with_comparison(
    self, user_id: str, days: int = 30
) -> Dict[str, Any]:
    # Current period
    current = await self.get_dashboard_stats(user_id, days)

    # Previous period (same length, immediately before)
    prev_end = date.today() - timedelta(days=days)
    prev_start = prev_end - timedelta(days=days - 1)
    prev = await self._get_daily_stats(user_id, prev_start, prev_end)

    # Calculate changes
    current_messages = sum(d['messages'] for d in current['daily'])
    prev_messages = sum(d['messages'] for d in prev)

    current['comparison'] = {
        'messages_change': calculate_percent_change(prev_messages, current_messages),
        'conversations_change': calculate_percent_change(...),
    }
    return current
```

#### 2.2 Frontend Changes

```tsx
// Stats card with comparison indicator
<div className="bg-white rounded-xl p-4">
  <p className="text-sm text-gray-500">Messages This Period</p>
  <div className="flex items-baseline gap-2">
    <p className="text-2xl font-bold">{formatNumber(stats.totals.messages)}</p>
    <span className={`text-sm ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
      {change > 0 ? '+' : ''}{change}%
    </span>
  </div>
</div>
```

---

### Phase 3: CSV Export (1-2 days)

#### 3.1 Backend Endpoint

**New file**: `src/backend/app/api/exports.py`

```python
@router.get("/analytics/export")
async def export_analytics(
    days: int = 30,
    format: str = "csv",  # csv, json
    session: AsyncSessionDep,
    clerk_user: CurrentUser,
):
    user = await get_user_from_clerk(clerk_user, session)
    analytics_service = AnalyticsService(session)

    stats = await analytics_service.get_dashboard_stats(str(user.id), days)

    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Date", "Conversations", "Messages", "Tokens"])
        for day in stats['daily']:
            writer.writerow([day['date'], day['conversations'], day['messages'], day['tokens']])

        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename=analytics_{days}d.csv"}
        )

    return stats
```

#### 3.2 Frontend Button

```tsx
<button
  onClick={() => window.open(`/api/v1/analytics/export?days=${days}&format=csv`)}
  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
>
  <DownloadIcon className="w-4 h-4 mr-1" />
  Export CSV
</button>
```

---

### Phase 4: Enhanced Metrics (3-4 days)

#### 4.1 New Metrics to Track

| Metric | Source | Calculation |
|--------|--------|-------------|
| Active Users (DAU/WAU/MAU) | conversations.user_id | Unique users with activity |
| Avg Response Time | messages.created_at | Time between user→assistant messages |
| Error Rate | messages with error flag | Errors / Total messages |
| Feature Adoption | workflow usage | % users using each feature |
| Session Duration | conversation timestamps | Last - First message time |

#### 4.2 Database Changes

**Add to Message model**:
```python
# Track actual token usage (from Langflow response)
input_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
output_tokens: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
response_time_ms: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
error: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
```

**Migration**:
```python
def upgrade():
    op.add_column('messages', sa.Column('input_tokens', sa.Integer(), nullable=True))
    op.add_column('messages', sa.Column('output_tokens', sa.Integer(), nullable=True))
    op.add_column('messages', sa.Column('response_time_ms', sa.Integer(), nullable=True))
    op.add_column('messages', sa.Column('error', sa.String(255), nullable=True))
```

#### 4.3 Dashboard Enhancements

```
┌─────────────────────────────────────────────────────────────────────┐
│ Analytics Dashboard                            [Last 7 days ▼] [⟳] │
├─────────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│ │ Messages │ │ Tokens   │ │ Agents   │ │ Avg Resp │ │ Error    │   │
│ │ 1,234    │ │ 123.4K   │ │ 57       │ │ 1.2s     │ │ 0.5%     │   │
│ │ +12% ↑   │ │ +8% ↑    │ │ +3       │ │ -0.3s ↓  │ │ -0.2% ↓  │   │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                                     │
│ ┌─────────────────────────────────────────────────────────────────┐│
│ │ Usage Over Time                          [Messages ▼] [Export] ││
│ │  ▂▅█▇▃▅▆▂▄▅▇█▅▃▂▄▅▆▇▅▄▃▂▅▆▇█▆                                  ││
│ │ Jan 9                                                   Jan 15 ││
│ └─────────────────────────────────────────────────────────────────┘│
│                                                                     │
│ ┌─────────────────────────┐ ┌───────────────────────────────────┐  │
│ │ Top Workflows           │ │ Recent Activity                   │  │
│ │ 1. Support Bot    45%   │ │ • User asked about pricing (2m)   │  │
│ │ 2. Sales Agent    30%   │ │ • New workflow created (15m)      │  │
│ │ 3. FAQ Handler    25%   │ │ • Conversation completed (1h)     │  │
│ └─────────────────────────┘ └───────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Phase 5: Custom Date Range (2 days)

#### 5.1 Date Picker Component

```tsx
import { DateRange } from 'react-day-picker'

const [dateRange, setDateRange] = useState<DateRange | undefined>()
const [preset, setPreset] = useState<string>('7d')

<div className="flex gap-2">
  <select value={preset} onChange={handlePresetChange}>
    <option value="7d">Last 7 days</option>
    <option value="14d">Last 14 days</option>
    <option value="30d">Last 30 days</option>
    <option value="90d">Last 90 days</option>
    <option value="custom">Custom range</option>
  </select>

  {preset === 'custom' && (
    <DateRangePicker
      selected={dateRange}
      onSelect={setDateRange}
      numberOfMonths={2}
    />
  )}
</div>
```

#### 5.2 Backend Support

```python
@router.get("/dashboard/stats")
async def get_dashboard_stats(
    days: int = Query(default=30, ge=1, le=365),
    start_date: Optional[date] = Query(default=None),
    end_date: Optional[date] = Query(default=None),
    ...
):
    if start_date and end_date:
        # Use custom range
        calculated_days = (end_date - start_date).days + 1
    else:
        # Use preset
        end_date = date.today()
        start_date = end_date - timedelta(days=days - 1)
```

---

## Part 4: File Changes Summary

### Backend Files

| File | Changes |
|------|---------|
| `app/services/analytics_service.py` | Fix date filtering, add comparison, add token tracking |
| `app/api/dashboard.py` | Add start_date/end_date params |
| `app/api/exports.py` | NEW - CSV/JSON export endpoint |
| `app/models/message.py` | Add token tracking columns |
| `alembic/versions/xxx_add_token_tracking.py` | NEW - Migration |

### Frontend Files

| File | Changes |
|------|---------|
| `src/pages/AnalyticsDashboardPage.tsx` | Fix caching, add comparison UI, add export button |
| `src/components/DateRangePicker.tsx` | NEW - Custom date range component |
| `src/lib/api.ts` | Add export endpoint, update stats params |
| `src/types/index.ts` | Add comparison types |

---

## Part 5: Implementation Order

```
Week 1:
├── Day 1: Fix time frame bug (SQLite date + cache)
├── Day 2: Add refresh button + verify fix
└── Day 3: Add period comparison backend

Week 2:
├── Day 4: Add period comparison frontend
├── Day 5: Add CSV export
└── Day 6: Add custom date range

Week 3 (optional):
├── Day 7: Token tracking migration + capture
├── Day 8: Enhanced metrics (response time, errors)
└── Day 9: Polish UI + testing
```

---

## Part 6: Success Metrics

After implementation, verify:

1. **Time frame works**: Selecting "Last 7 days" shows different data than "Last 30 days"
2. **Comparison shows**: Each metric shows +/-% vs previous period
3. **Export works**: CSV download includes all daily data
4. **Custom range works**: Can select arbitrary date ranges
5. **Performance**: Dashboard loads in < 2 seconds

---

## Sources

- [SaaS Dashboard Best Practices - Klipfolio](https://www.klipfolio.com/resources/dashboard-examples/saas)
- [SaaS Metrics to Track - ThoughtSpot](https://www.thoughtspot.com/data-trends/dashboard/saas-metrics-kpis)
- [Analytics Dashboard Examples - Userpilot](https://userpilot.com/blog/saas-dashboard-examples/)
- [SaaS Analytics Guide - HubiFi](https://www.hubifi.com/blog/saas-analytics-dashboard-guide)
