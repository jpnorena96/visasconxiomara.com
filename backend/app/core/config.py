from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Xiomara Upload API"
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 120
    CORS_ORIGINS: str = "*"

    DB_HOST: str
    DB_PORT: int = 3306
    DB_USER: str
    DB_PASSWORD: str
    DB_NAME: str

    UPLOAD_DIR: str = "/data/uploads"

    @property
    def DB_URI(self) -> str:
        return f"mysql+mysqldb://{self.DB_USER}:{self.DB_PASSWORD}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    class Config:
        env_file = ".env"

settings = Settings()
