from sqlalchemy import Column, Integer, Unicode, DateTime
from app.database import Base
from datetime import datetime,timezone

class Customer(Base):
    __tablename__ = "Customers"

    cus_id = Column(Integer, primary_key=True)
    cus_firstname = Column(Unicode(30), nullable=False)
    cus_lastname = Column(Unicode(30), nullable=False)
    cus_email = Column(Unicode(30))
    cus_phone = Column(Unicode(30))
    cus_addr = Column(Unicode(255))
    cus_created_by = Column(Unicode(30))
    cus_created_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
    cus_updated_at = Column(DateTime, default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
