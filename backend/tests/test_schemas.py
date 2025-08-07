import pytest
from pydantic import ValidationError
from app.schemas.user import UserCreate, UserResponse
from app.schemas.legal_document import LegalDocumentCreate, LegalDocumentResponse
