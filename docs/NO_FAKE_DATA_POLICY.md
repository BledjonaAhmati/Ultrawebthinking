# NO FAKE DATA POLICY

## Qellimi
Ky dokument vendos rregull absolut ne platforme:

- No data = no data
- Never fake
- Never placeholder values ne runtime
- Never invented metrics
- Never fabricated success

Nese sistemi nuk ka te dhena reale, duhet te ktheje status korrekt dhe mesazh transparent.

## Parimet Kryesore

1. Integritet mbi komoditetin
- Me mire nje gabim i sakte se nje pergjigje e bukur por e rreme.

2. Transparence e plote
- Burimi i te dhenave duhet te jete i identifikueshem (DB, API, sensor, cache real).

3. Zero tolerim per data fake
- Nuk lejohet gjenerim artificial i values vetem per te mbushur UI/API.

4. Localhost per zhvillim
- Kur sherbimet reale nuk jane te disponueshme ne dev, perdor localhost endpoints reale, jo mocks te fshehura.

## Rregulla te Detyrueshme per API

1. Kur nuk ka te dhena
- Kthe 404 ose 204 sipas kontrates se endpoint-it.
- Shembull payload:
```json
{
  "error": "NOT_FOUND",
  "message": "No real data available for requested resource",
  "source": "database",
  "timestamp": "<iso-8601>"
}
```

2. Kur ka gabim serveri
- Kthe 500 me mesazh real dhe trace-id.
```json
{
  "error": "INTERNAL_SERVER_ERROR",
  "message": "Unexpected failure while reading real data source",
  "traceId": "<trace-id>",
  "timestamp": "<iso-8601>"
}
```

3. Kur varesia eshte offline (DB, Neo4j, Redis, service)
- Kthe 503 (ose 500 sipas kontrates ekzistuese), jo data fallback fake.

4. Nese endpoint kerkon metrika
- Kthe vetem vlera te matura realisht.
- Nese mungojne, kthe gabim te qarte ose array bosh, sipas kontrates.

## Rregulla te Detyrueshme per UI

1. Kur API kthen no data
- Shfaq "No real data available".
- Mos shfaq numra default si 99%, 1000 req/s, etj.

2. Kur API kthen error
- Shfaq status-in real (404, 500, 503).
- Mos e masko me "All good" ose fake green indicators.

3. Health/Status dashboards
- Green vetem kur healthcheck real kalon.
- Nese healthcheck deshton ose mungon, status = degraded/down.

## E NDALUAR

- Hardcoded fake KPIs ne production path
- Random values per "demo" pa etikete te qarte demo
- Success responses kur operacioni ka deshtuar
- Swallow exceptions dhe kthim i payload-it "normal"

## E LEJUAR VETEM NQS ESHTE EKSPLICITE

- Demo mode i ndare qarte me flag p.sh. `DEMO_MODE=true`
- Badge i dukshem ne UI: "DEMO DATA"
- Logs audit per cdo endpoint ne demo mode

## Error Handling Standard

- 400: input i pavlefshem
- 401/403: pa autorizim
- 404: resource ose data nuk ekziston
- 409: konflikt gjendjeje
- 422: payload semantikisht i gabuar
- 500: gabim i brendshem
- 503: varesi e jashtme jo e disponueshme

## Logging dhe Audit

1. Cdo error response duhet te logohet me:
- endpoint
- status code
- trace-id
- source (db/api/service)

2. Ndalohet logika qe ndryshon status code per te "dukur mire".

## Checklist Para Merge

- A jane te gjitha vlerat nga burime reale?
- A kthehet status korrekt kur mungon data?
- A ka ndonje default fake ne UI/API?
- A ka test per no-data dhe server-error paths?
- A jane mesazhet e gabimit transparente?

## Formula e Art

No data = no data.
No source = no value.
Error real = response real.
Never fake. Never hide.

## Enforcement (Git, CI/CD, CLI)

1. CLI gate (local)
- Run: `python scripts/no_fake_data_guard.py`
- Ose: `npm run guard:no-fake`
- Nese zbulohen fake/mock/placeholder runtime patterns, komanda deshton me exit code 1.

2. CI/CD gate
- Workflow: `.github/workflows/ci-cd.yml`
- Job: `no-fake-data-gate`
- Pipeline nuk vazhdon te lint/test/build/deploy nese ky gate deshton.

3. Platform checks
- `scripts/test-platform.ps1` ekzekuton no-fake guard ne fillim.
- Nese guard deshton, testi i platformes ndalet menjehere.
