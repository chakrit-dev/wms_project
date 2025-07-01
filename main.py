from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
import app.models  # SQLAlchemy scan model

# Router Imports
from app.routers import (
    auth_router, user_router, product_router, category_router,
    dashboard_router, warehouse_router, inventories_router,
    receiving_router, shipping_router,
)

import logging

# Logging Middleware
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# ✅ CORS config (แบบกำหนดตรง ๆ)
origins = [
    "http://localhost:5173",
    "https://ashy-grass-0d8e88500.1.azurestaticapps.net",  # Azure Static Web App URL
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
print("✅ Loaded CORS_ORIGINS =", origins)

# Middleware log requests
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger.info(f"➡️ {request.method} {request.url}")
    try:
        response = await call_next(request)
    except Exception as e:
        logger.exception(f"🔥 Error: {e}")
        raise
    logger.info(f"⬅️ {response.status_code} {request.url}")
    return response

# สร้างตารางทั้งหมด
Base.metadata.create_all(bind=engine)

# ✅ Include API Routers
api_prefix = "/api"
app.include_router(auth_router, prefix=api_prefix)
app.include_router(user_router, prefix=api_prefix)
app.include_router(product_router, prefix=api_prefix)
app.include_router(category_router, prefix=api_prefix)
app.include_router(dashboard_router, prefix=api_prefix)
app.include_router(warehouse_router, prefix=api_prefix)
app.include_router(inventories_router, prefix=api_prefix)
app.include_router(receiving_router, prefix=api_prefix)
app.include_router(shipping_router, prefix=api_prefix)

# Root route
@app.get("/")
def root():
    return {"message": "FastAPI is running!"}
