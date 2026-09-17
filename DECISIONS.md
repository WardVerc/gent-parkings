# Decisions

## Stack

Vite + React 19 + TypeScript + React Compiler, as scaffolded. Plain CSS with a single
`styles/tokens.css` for design tokens — no CSS-in-JS, no Tailwind, per the brief. Axios for
the one HTTP call. No router, no state library: one page, two hooks, `useState` is enough.

## Structure

```
src/
  data/        Facility, Reservation, storage, status, staleness — the data layer
  hooks/       useParkingFacilities, useReservations
  components/  generic pieces (Button, TextField, Tag, ProgressBar, StatusIcon/Chip/Label,
               FreeSpacesDisplay, ReserveAction) — none of them know about Facility/Reservation
  features/    FacilityCard, FacilityList, ReservationDialog — the pieces that do
  pages/       ParkingPage — wires the hooks to the features
```

Started from Atomic Design (atoms/molecules/organisms) and flattened it once it was clear a
3-way split didn't earn its keep for ~11 components: `components/` vs `features/` is the
distinction that actually matters here — generic and reusable vs. aware of the domain.

## Confirming the live feed before coding

Pulled a real response instead of assuming field names:

```
name, lastupdate, totalcapacity, availablecapacity, isopennow, temporaryclosed, id, ...
```

- `id` is a stable URL string, unique — used directly as the facility key.
- `isOpenNow = isopennow === 1 && temporaryclosed !== 1` — the city's feed has two separate
  closed signals; both mean "don't send a driver here."
- 13 facilities total, so `limit=100` on the request avoids building pagination for a list
  this small.
- Fields not needed for US1/US2a (`occupancytrend`, `categorie`, `location`, …) are dropped
  at the mapping boundary (`toFacility` in `useParkingFacilities.ts`) rather than carried
  through as dead weight in the `Facility` type.

## Staleness — and a real correction from testing against the live feed

Original plan: flag any facility whose own `lastupdate` is >3 minutes old as "delayed" and
disable its Reserve button. Running the app against the actual feed showed this was wrong —
Ghent's feed updates in batches roughly once a minute *on average*, but individual polls can
land anywhere in that cycle, and one live sample was genuinely ~4.3 minutes old on a healthy,
successful fetch. At a 3-minute threshold, most facilities showed as "delayed" most of the
time, which defeats the entire point of a status badge — if it's always on, it's not a signal.

Fixed two ways:
1. Raised the per-facility threshold to 5 minutes (`data/facility.ts`), with the reasoning
   left in a comment so it doesn't get "corrected" back to something stricter later.
2. Split the concept in two. **Per-facility staleness** (`FacilityView.isDataStale`) is now
   purely informational — it shows the "Data delayed" badge but does *not* block reserving,
   because a few minutes' lag on one facility's timestamp is normal feed behavior, not a
   reason to stop someone parking. **Feed-level staleness** (`isStale` from
   `useParkingFacilities`, meaning our own GET failed and we're showing cached data) *does*
   block reserving everywhere, with its own reason ("Feed unavailable — try again shortly") —
   that's the case where we genuinely don't trust the numbers.

This is the kind of thing that only showed up by actually running the app against the real
feed rather than trusting the plan — worth calling out since it changed the behavior, not
just a number.

## Caching and polling

- Poll every 25s. The feed refreshes roughly once a minute; 25s gets a new value within about
  one cycle without hammering a public endpoint that isn't ours.
- On every successful GET, `{ facilities, fetchedAt }` is written to `parking:lastSuccess`.
- On a failed GET, we fall back to that cache and set `isStale: true` with the cache's
  `fetchedAt` so the UI can say "showing data as of HH:MM" — never a silently frozen or blank
  screen.
- No manual "Retry" button on the error state. The hook already retries automatically every
  25s, so a Retry button would just be a second way to trigger the thing that's already
  happening — extra chrome with no extra function.

## Reservations and the optimistic-update edge case

- `parking:reservations` is a flat array in localStorage. No separate "logged in" key — the
  name field prefills from the most recent reservation's `driverName` in that same array,
  per the brief.
- `effectiveFreeSpaces = availableCapacity - myReservationCount`, clamped at 0. This is the
  optimistic update: reserving updates local state immediately, and every subsequent poll
  recomputes this against the live number, so it reconciles for free — no separate
  "pending/confirmed" state machine needed.
- If the live `availableCapacity` drops below what our own reservations would predict
  (someone else plausibly took the spot), `hasFewerThanExpected` goes true and the card shows
  an inline warning. It is not hidden, and nothing tries to auto-correct or cancel the
  reservation — the tradeoff called out in the brief. A real system would need a way to tell
  the driver their specific reservation failed, but that requires the backend to actually
  hold a numbered space, which the city's feed doesn't expose (it's a free-space *count*, not
  individual bays) — out of scope for this exercise.
- One reservation tag per facility per browser: once you've reserved at a facility, the card
  shows "Reserved for X" instead of another Reserve button. Not explicitly required, but
  reserving twice at the same facility from the same browser isn't a case worth a UI for.

## Other simplifications

- No Google Fonts or other network font — the system font stack, so the app doesn't depend
  on a third-party host to render correctly.
- One responsive `FacilityCard` layout (icon + name + numbers on top, a full-width bar, status
  + action below) rather than separate desktop/mobile markups — it was designed mobile-first
  and just happens to also work at 900px, so maintaining two versions would have been pure
  duplication.
- No header "Live · updated Ns ago" ticking clock. Freshness is communicated by the *absence*
  of the stale banner (silence = fresh) plus each card's own "updated Xm ago" text, recomputed
  on every render — which happens every poll anyway. No interval timer needed just for display.

## What I'd do next

- Accessibility pass: `aria-live` on the stale banner and reservation feedback, focus trap in
  the dialog, keyboard-only walkthrough.
- A way to cancel/release a reservation (currently one-way).
- Basic automated tests around `toFacilityView` and the reconciliation math — that logic is
  small but is exactly the part worth pinning down with tests before anyone touches it again.
- Exponential backoff on repeated feed failures instead of a fixed 25s poll forever.

## US2b — maintenance (design notes only, not built)

**Why not this one:** the brief asked for US1 plus one of US2a/US2b. US2a exercises the
frontend problems the assignment is actually about — optimistic updates, reconciling against
a live external feed, honest staleness. US2b is much closer to a CRUD form over a single
number with no live-feed interaction to reconcile against. Given the 6-hour box, building
US2a properly (including its edge cases) was a better use of the time than doing both shallowly.

**How it would work:**
- A new localStorage key, e.g. `parking:outages`, one record per facility:
  `{ facilityId, spacesOutOfService, updatedAt }`.
- `toFacilityView` would take an additional `spacesOutOfService` argument and compute
  `effectiveCapacity = totalCapacity - spacesOutOfService`, feeding into the same
  `effectiveFreeSpaces` and `status` logic that already exists — no new view-model shape,
  just one more input to the function that already combines feed + local state.
- UI-wise: a separate, deliberately small "Operator" screen rather than folding controls into
  the driver list — the two audiences and mental models are different enough (confirmed while
  exploring layout directions before writing code) that mixing them adds chrome the driver
  never needs. A facility picker, a stepper capped at `totalCapacity`, and an Apply action
  with a plain-language confirmation ("Drivers will immediately see the reduced number") would
  reuse the existing `Button`/`TextField`-style components.
- It would not need polling or reconciliation logic of its own — the operator's number is
  authoritative, not competing with a live external value the way a reservation count is.

## Running it

`npm install && npm run dev`. Confirmed clean `tsc -b`, `npm run lint`, `npm run build`, and
a full manual pass (loading → live list → reserve → confirm → persists across reload) driven
against the real Stad Gent feed.
