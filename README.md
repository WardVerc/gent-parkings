## Functional Design Specification: Parking Availability and Booking

Technical exercise for the Software Engineer role at Factry.

### Context

We operate public parking facilities across the city. Today, drivers circle around looking for a free spot, and our own operators often hear about problems too late.

We want one product that shows every facility's live availability, lets drivers reserve ahead of arrival, and lets our operators take a facility or part of it out of service for maintenance. It has to always be current, and it has to be readable at a glance by people who are not technical.

### The live data

The city publishes real-time occupancy for its parking facilities as an open dataset (Stad Gent, "Real-time bezetting parkeergarages"). It refreshes roughly once a minute. For each facility you get at least a name, total capacity, the number of spaces currently free, and whether it is open. Confirm the exact fields yourself from the dataset and its API.

The API follows this pattern: `https://data.stad.gent/api/explore/v2.1/catalog/datasets/bezetting-parkeergarages-real-time/records`

If you would rather work with fewer facilities, you may use the park-and-ride set `real-time-bezetting-pr-gent` instead.

The feed reports a count of free spaces per facility. It does not expose individual numbered spaces.

### What we care about, beyond the features

We were explicit with our team about how this product should feel. **Always up to date**: a stale number is worse than no number. **Easily readable**: a driver or an operator should understand a facility's state in one glance. **Clean**: no clutter, show what matters. 

### User stories

**US1: See live availability** (must build)

> As a driver or an operator, I want to see all parking facilities and how many spaces are free right now, so that I know where I can park without driving around.
> 

Acceptance criteria:

- All facilities are listed with their current free spaces and their capacity.
- The view reflects the live feed and does not show stale data.
- A facility's state is understandable at a glance.
- The view still behaves sensibly when the feed is slow or unavailable.

**US2a: Reserve a spot**

> As a driver, I want to reserve a space at a facility and still see its real current availability, so that I am confident a spot will be there when I arrive.
> 

Acceptance criteria:

- A driver can reserve a space at a chosen facility.
- A reservation is stored and survives a page refresh.
- The driver can still see the facility's live availability next to their reservation.

**US2b: Log maintenance**

> As an operator, I want to take a facility, or part of it, out of service, so that drivers are not sent to spaces they cannot use.
> 

Acceptance criteria:

- An operator can mark a facility, or a number of spaces in it, as out of service.
- The change is stored and survives a page refresh.
- The screen reflects the reduced availability.

### Your task

Budget: 6 hours. This role is mostly frontend, so the screen is what we care about most here. Put your time into the experience, not into backend depth.

Build **US1**, plus **one** of US2a or US2b (your choice). Write up the one you do not build only as far as your design notes.

- Stack is your choice. Tell us why you chose it.
- Use your own backend and data store. The public feed is read-only, so anything you add (reservations, maintenance) lives in your own data.
- The UI has to cover its real states, not only the happy path: loading, empty, and error.
- The reserve or maintenance action must give the user clear feedback. Updating optimistically and then reconciling with the live feed is the interesting version.
- Use whatever tools you normally work with, AI included. But you have to understand what you hand in. In the walkthrough you will explain and defend every decision, and make one small change live without AI. Anything you cannot reason through on your own will not count in your favour.
- Six hours is the box. A working end-to-end slice beats one deep, polished layer. If you run short, cut on purpose and tell us what you cut and why.
- Do not gold-plate.

### Deliverables

- The running application.
- A short decision log: your key decisions, the assumptions you made, the tradeoffs, what you left out, and what you would do next.
- A walkthrough of about 30 minutes: you demo it, talk us through your choices, and make one small change live (no AI) so we can see the code is genuinely yours.

### How we evaluate
We care more about your thinking than about polish, and the frontend is the heart of this one. We are reading for how you design for the person using the screen, how you structure the frontend and the backend, how you keep the view current, how you handle the messy edges, and how easily someone else could pick up your work.

If anything in this spec is unclear, or seems wrong, we would rather you ask or flag it than quietly build around it.

We care more about your thinking than about polish, and the frontend is the heart of this one. We are reading for how you design for the person using the screen, how you structure the frontend and the backend, how you keep the view current, how you handle the messy edges, and how easily someone else could pick up your work.

If anything in this spec is unclear, or seems wrong, we would rather you ask or flag it than quietly build around it.
