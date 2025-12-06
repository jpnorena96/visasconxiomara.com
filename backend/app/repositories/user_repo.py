from sqlalchemy.orm import Session
from app.models.user import User
from typing import Optional

class UserRepo:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> Optional[User]:
        """Obtener usuario por ID"""
        return self.db.query(User).filter(User.id == user_id).first()

    def get_by_email(self, email: str) -> Optional[User]:
        """Obtener usuario por email"""
        return self.db.query(User).filter(User.email == email).first()

    def create(self, *, email: str, hashed_password: str, role: str = "customer") -> User:
        """Crear un nuevo usuario"""
        u = User(email=email, hashed_password=hashed_password, role=role)
        self.db.add(u)
        self.db.commit()
        self.db.refresh(u)
        return u

    def list_all(self, skip: int = 0, limit: int = 100) -> list[User]:
        """Listar todos los usuarios con paginación"""
        return self.db.query(User).order_by(User.id.desc()).offset(skip).limit(limit).all()

    def list_customers(self) -> list[User]:
        """Listar solo clientes"""
        return self.db.query(User).filter(User.role == "customer").order_by(User.id.desc()).all()

    def list_admins(self) -> list[User]:
        """Listar solo administradores"""
        return self.db.query(User).filter(User.role == "admin").order_by(User.id.desc()).all()

    def update(self, user: User, **kwargs) -> User:
        """Actualizar campos de un usuario"""
        for key, value in kwargs.items():
            if value is not None and hasattr(user, key):
                setattr(user, key, value)
        self.db.commit()
        self.db.refresh(user)
        return user

    def update_password(self, user: User, hashed_password: str) -> User:
        """Actualizar contraseña de un usuario"""
        user.hashed_password = hashed_password
        self.db.commit()
        self.db.refresh(user)
        return user

    def toggle_active(self, user: User) -> User:
        """Activar/desactivar un usuario"""
        user.is_active = not user.is_active
        self.db.commit()
        self.db.refresh(user)
        return user

    def delete(self, user: User) -> None:
        """Eliminar un usuario (hard delete)"""
        self.db.delete(user)
        self.db.commit()

    def count_by_role(self, role: str) -> int:
        """Contar usuarios por rol"""
        return self.db.query(User).filter(User.role == role).count()

    def count_all(self) -> int:
        """Contar todos los usuarios"""
        return self.db.query(User).count()
