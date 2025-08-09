from pydantic import BaseModel

class LegalDocumentBase(BaseModel):
    title: str
    content: str

class LegalDocumentCreate(LegalDocumentBase):
    pass

class LegalDocumentUpdate(LegalDocumentBase):
    pass

class LegalDocumentResponse(LegalDocumentBase):
    id: int

    class Config:
        from_attributes = True
