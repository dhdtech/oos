from .base import *

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "2jts6f%ttv)k2byyjtr-@(@arf1kgdh3en18xd1ch3t_(sz1f%"

DEBUG = True

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
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "verbose",
        },
    },
    "root": {
        "handlers": ["console"],
        "level": "DEBUG",
    },
}

REST_FRAMEWORK["DEFAULT_RENDERER_CLASSES"] += (
    "rest_framework.renderers.BrowsableAPIRenderer",
)

if not os.environ.get("SKIP_DEV_TOOLS", False):
    # DJANGO SPAGHETTI
    INSTALLED_APPS += ["django_spaghetti"]

    SPAGHETTI_SAUCE = {
        "apps": ["core", "user", "mls", "jobs", "comms", "team"],
        "show_fields": False,
        "exclude": {"auth": ["user"]},
    }

    # DRF SPECTACULAR (SWAGGER CONFIG)
    INSTALLED_APPS += ["drf_spectacular"]

    REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"

    SPECTACULAR_SETTINGS = {
        "TITLE": "courted-core-app API",
        "DESCRIPTION": "Auto generated openApi 3.0 docs",
        "VERSION": "1.0.0",
        "SORT_OPERATION_PARAMETERS": False,
    }

    # NPLUSONE
    import nplusone

    nplusone.show_nplusones()

    # DJANGO DEBUG TOOLBAR
    INSTALLED_APPS += ["debug_toolbar"]

    # Hacky to get the debug toolbar to work with docker
    import socket

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + [
        "127.0.0.1",
        "10.0.2.2",
    ]

    # Django toolbar middleware must be before auth, messages, Whitenoise among others.
    MIDDLEWARE.insert(4, "debug_toolbar.middleware.DebugToolbarMiddleware")

    # DJANGO CORS HEADERS
    INSTALLED_APPS += ["corsheaders"]

    MIDDLEWARE.insert(2, "corsheaders.middleware.CorsMiddleware")

    # This hacky way of setting CORS_ORIGIN_WHITELIST is to create a dummy aditional
    # security layer to prevent CORS attacks. The CORS_ORIGIN_WHITELIST is set to accept
    # requests on dev environment, only if developer accessed the site from a browser
    # in the http://courted-from-local-to-dev URL.
    # CORS_ALLOWED_ORIGINS = ["http://courted-from-local-to-dev"]

    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_METHODS = [
        "DELETE",
        "GET",
        "OPTIONS",
        "PATCH",
        "POST",
        "PUT",
    ]

    CORS_ALLOW_HEADERS = [
        "accept",
        "accept-encoding",
        "authorization",
        "content-type",
        "dnt",
        "origin",
        "user-agent",
        "x-csrftoken",
        "x-requested-with",
    ]

    # JUPYTER NOTEBOOK CONFIG
    INSTALLED_APPS += ["django_extensions"]
    SHELL_PLUS = "ipython"
    NOTEBOOK_ARGUMENTS = [
        "--ip",
        "0.0.0.0",
        "--port",
        "8888",
        "--allow-root",
        "--no-browser",
        "--NotebookApp.token=",
    ]
    IPYTHON_ARGUMENTS = [
        "--ext",
        "django_extensions.management.notebook_extension",
        "--debug",
    ]
    IPYTHON_KERNEL_DISPLAY_NAME = "COURTED - Django Kernell"

    SHELL_PLUS_POST_IMPORTS = []  # extra things to import in notebook

    os.environ["DJANGO_ALLOW_ASYNC_UNSAFE"] = "true"  # only use in development
