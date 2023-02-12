from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY")
DEBUG = False

LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "verbose": {
            "format": "{levelname} {asctime} {module} {message}",
            "style": "{",
        },
    },
    "handlers": {
        "console": {"class": "logging.StreamHandler", "formatter": "verbose"},
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
}

# only in the dev environment
if os.environ.get("ENV") == "dev":
    INSTALLED_APPS += ["drf_spectacular"]

    REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"

    SPECTACULAR_SETTINGS = {
        "TITLE": "courted-core-app API",
        "DESCRIPTION": "Auto generated openApi 3.0 docs",
        "VERSION": "1.0.0",
        "SERVE_PERMISSIONS": ["rest_framework.permissions.IsAuthenticated"],
    }
