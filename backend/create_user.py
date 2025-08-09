from app.database import SessionLocal
from app.models.user import User
from app.auth import get_password_hash
from sqlalchemy.exc import IntegrityError

def create_test_user():
    db = SessionLocal()
    try:
        email = "alice@example.com"
        existing_user = db.query(User).filter(User.email == email).first()
        if existing_user:
            print(f"⚠️ L'utilisateur avec l'email {email} existe déjà.")
            return

        user = User(
            email=email,
            hashed_password=get_password_hash("1234secure"),
            role="user"  # ou "admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        print("✅ Utilisateur créé :", user.email)
    except IntegrityError as e:
        db.rollback()
        print(f"Erreur d'intégrité en base : {e}")
    except Exception as e:
        db.rollback()
        print(f"Erreur lors de la création de l'utilisateur : {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()
