from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    mongodb_uri: str = "mongodb://localhost:27017/vitalens"
    mongodb_db: str = "vitalens"
    collection_name: str = "medical_data_records"
    cors_origins: str = "http://localhost:3000,http://localhost:5173"


settings = Settings()
