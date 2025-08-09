from fastapi import APIRouter, Depends, File, UploadFile, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List
import shutil
import os
import uuid

from app.database import get_db
from app.schemas.drive import FileResponse, SearchRequest, SearchResult
from app.crud.drive import (
    create_file_record,
    get_user_files,
    search_files_and_web
)
from app.auth import get_current_user

router = APIRouter(
    prefix="/api/drive",
    tags=["drive"],
)

UPLOAD_DIR = "uploaded_files"  # À adapter selon ta config

if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

@router.post("/upload", response_model
