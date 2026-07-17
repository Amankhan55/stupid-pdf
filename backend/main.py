from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.pdf_routes import router as pdf_router

app = FastAPI(
    title="Stupid PDF API",
    description="A powerful PDF processing API supporting 11 operations.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pdf_router)


@app.get("/")
def root():
    return {"message": "Stupid PDF API is running 🚀", "docs": "/docs"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
