# Backend is not the focus right now. The frontend runs on sample data (see frontend/src/mock.js).
# When you are ready, return that same JSON shape from POST /api/report,
# then set VITE_USE_MOCK=false in frontend/.env.
from fastapi import FastAPI

app = FastAPI()


@app.post("/api/report")
def make_report():
    raise NotImplementedError("Return the report shape defined in frontend/src/mock.js")
