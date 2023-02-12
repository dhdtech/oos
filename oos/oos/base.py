"""
Django settings for app project.

Generated by 'django-admin startproject' using Django 3.1.5.

For more information on this file, see
https://docs.djangoproject.com/en/3.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/3.1/ref/settings/
"""


import json
import os
from glob import glob
from pathlib import Path
from urllib import request

from celery.schedules import crontab

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "django.contrib.gis",
    "django_otp",
    "django_otp.plugins.otp_totp",
    "django_otp.plugins.otp_static",
    "rest_framework",
    "rest_framework.authtoken",
    "whitenoise.runserver_nostatic",
    "phonenumber_field",
    "storages",
    "core",
    "user",
    "mls",
    "jobs",
    "comms",
    "team",
    "newsfeed",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.auth.middleware.RemoteUserMiddleware",
    "django_otp.middleware.OTPMiddleware",
]

ROOT_URLCONF = "app.urls"

ALLOWED_HOSTS = ["apiserver", "localhost:8000", "localhost"]

# A list if trusted origins for unsafe requests -- django admin specifically
CSRF_TRUSTED_ORIGINS = ["https://*.courted.io", "https://localhost", "http://localhost"]

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "app.wsgi.application"


# Database
# https://docs.djangoproject.com/en/3.1/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.contrib.gis.db.backends.postgis",
        "HOST": os.environ.get("DB_HOST"),
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USER"),
        "PASSWORD": os.environ.get("DB_PASS"),
    },
}


# Password validation
# https://docs.djangoproject.com/en/3.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

# ENVIRONMENT
ENV = os.environ.get("ENV")

# Internationalization
# https://docs.djangoproject.com/en/3.1/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/3.1/howto/static-files/

STATIC_URL = "/static/"
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, "static"),
]
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


######################################
# NON-STANDARD ADDED BY COURTED TEAM #
######################################
AUTH_USER_MODEL = "core.User"
# https://docs.djangoproject.com/en/3.2/releases/3.2/#customizing-type-of-auto-created-primary-keys
DEFAULT_AUTO_FIELD = "django.db.models.AutoField"

OTP_TOTP_ISSUER = "Courted Admin"

# Celery config
CELERY_BROKER_URL = "pyamqp://rabbitmq:5672"
# CELERY_RESULT_BACKEND = 'django-db'
CELERY_IMPORTS = ("team", "user")


AUTHENTICATION_BACKENDS = [
    "core.backends.CognitoRemoteUserBackend",
    "django.contrib.auth.backends.ModelBackend",
]

REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ("core.permissions.DenyAny",),
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_jwt.authentication.JSONWebTokenAuthentication",
    ),
    "DEFAULT_RENDERER_CLASSES": ("rest_framework.renderers.JSONRenderer",),
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.LimitOffsetPagination",
    "PAGE_SIZE": 50,
}

COGNITO_AWS_REGION = os.environ.get("AWS_REGION")
COGNITO_USER_POOL = os.environ.get("COGNITO_USER_POOL")
# Provide this value if `id_token` is used for authentication (it contains 'aud' claim).
# `access_token` doesn't have it, in this case keep the COGNITO_AUDIENCE empty
COGNITO_AUDIENCE = None
COGNITO_POOL_URL = (
    None  # will be set few lines of code later, if configuration provided
)

rsa_keys = {}
# To avoid circular imports, we keep this logic here.
# On django init we download jwks public keys which are used to validate jwt tokens.
# For now there is no rotation of keys (seems like in Cognito decided not to implement it)
if COGNITO_AWS_REGION and COGNITO_USER_POOL:
    COGNITO_POOL_URL = (
        f"https://cognito-idp.{COGNITO_AWS_REGION}.amazonaws.com/{COGNITO_USER_POOL}"
    )
    pool_jwks_url = f"{COGNITO_POOL_URL}/.well-known/jwks.json"
    jwks = json.loads(request.urlopen(pool_jwks_url).read())
    rsa_keys = {key["kid"]: json.dumps(key) for key in jwks["keys"]}


JWT_AUTH = {
    "JWT_PAYLOAD_GET_USERNAME_HANDLER": "utils.jwt.get_username_from_payload_handler",
    "JWT_DECODE_HANDLER": "utils.jwt.cognito_jwt_decode_handler",
    "JWT_PUBLIC_KEY": rsa_keys,
    "JWT_ALGORITHM": "RS256",
    "JWT_AUDIENCE": COGNITO_AUDIENCE,
    "JWT_ISSUER": COGNITO_POOL_URL,
    "JWT_AUTH_HEADER_PREFIX": "Bearer",
}

# TEST SUITE FIXTURES
FIXTURE_DIRS = ["app/mls/fixtures"]

# IMAGE AND FILE STORAGE
DEFAULT_FILE_STORAGE = "storages.backends.s3boto3.S3Boto3Storage"
AWS_S3_REGION_NAME = os.environ.get("AWS_REGION")
AWS_STORAGE_BUCKET_NAME = f"courted-app-object-store-{ENV}"
AWS_QUERYSTRING_AUTH = False
# 2.0MB
IMAGE_MAX_FILE_SIZE_MB = 2

# MAILCHIMP API
MAILCHIMP_API_TOKEN = os.environ.get("MAILCHIMP_API_TOKEN")

# HEAP API
HEAP_APP_ID = os.environ.get("HEAP_APP_ID", "")


SLACK_ALERT_CHANNEL = os.environ.get("SLACK_ALERT_CHANNEL")

# CELERY APP FLAGS
ENABLE_GENERATE_AWARD_NOTIFICATIONS_CELERY_TASK = os.environ.get(
    "ENABLE_GENERATE_AWARD_NOTIFICATIONS_CELERY_TASK"
)
ENABLE_TRANSACTION_CLAIM_CSV_DUMP_CELERY_TASK = os.environ.get(
    "ENABLE_TRANSACTION_CLAIM_CSV_DUMP_CELERY_TASK"
)
ENABLE_GENERATE_NOTIF_TO_USERS_WITH_X_USER_POST_LAST_2D_CELERY_TASK = os.environ.get(
    "ENABLE_GENERATE_NOTIF_TO_USERS_WITH_X_USER_POST_LAST_2D_CELERY_TASK"
)

ENABLE_ACTIVITY_CREATION = os.environ.get("ENABLE_ACTIVITY_CREATION")


ENABLE_BROKER_NOTIFICATION_TASKS = os.environ.get("ENABLE_BROKER_NOTIFICATION_TASKS")

ENABLE_PERSIST_BROKER_CONN_STATS_WITH_BAS = os.environ.get(
    "ENABLE_PERSIST_BROKER_CONN_STATS_WITH_BAS"
)

ENABLE_GENERATE_AGENT_SWITCHED_BROKERAGE_NOTI_TASK = os.environ.get(
    "ENABLE_GENERATE_AGENT_SWITCHED_BROKERAGE_NOTI_TASK"
)

# Since we have clashing URLS form mls endpoint (to keep backward compatibility
# with old mls endpoints) we need to disable this warning to be sent to the
# console because it is leading to errors during multiprocessing in the
# load_mls_data.
# TODO: This should be removed as soon as we migrate UI and Mobile to consume
# new endpoints.
SILENCED_SYSTEM_CHECKS = ["urls.W005"]

# ONESIGNAL API CONFIGURATIONS
ONESIGNAL_APP_ID = os.environ.get("ONESIGNAL_APP_ID", "")
ONESIGNAL_API_TOKEN = os.environ.get("ONESIGNAL_API_TOKEN", "")
ONESIGNAL_API_HOST = os.environ.get("ONESIGNAL_API_HOST", "")
ENABLE_ONESIGNAL_PUSHES = os.environ.get("ENABLE_ONESIGNAL_PUSHES", 0)

TWILIO_ACCOUNT_SID = os.environ.get("TWILIO_ACCOUNT_SID", "")
TWILIO_API_KEY = os.environ.get("TWILIO_API_KEY", "")
TWILIO_API_KEY_SECRET = os.environ.get("TWILIO_API_KEY_SECRET", "")
TWILIO_CHAT_SERVICE_SID = os.environ.get("TWILIO_CHAT_SERVICE_SID", "")
TWILIO_AUTH_TOKEN = os.environ.get("TWILIO_AUTH_TOKEN", "")

# MLS DATA INGESTION
MLS_DATA_VERSION = os.environ.get("MLS_DATA_VERSION")
MLS_S3_BUCKET = os.environ.get("MLS_S3_BUCKET")
DELTA_BCM_CHUNK_SIZE = os.environ.get("DELTA_BCM_CHUNK_SIZE", None)
DELTA_PYARROW_CHUNK_SIZE = os.environ.get("DELTA_PYARROW_CHUNK_SIZE", None)

# HUBSPOT INTEGRATION
HUBSPOT_API_TOKEN = os.environ.get("HUBSPOT_API_TOKEN")
HUBSPOT_LIST_ID = os.environ.get("HUBSPOT_LIST_ID")


# For submitting databricks jobs. Currently, only for spark_load_deltas.py
DATABRICKS_HOST = os.environ.get("DATABRICKS_HOST")
DATABRICKS_TOKEN = os.environ.get("DATABRICKS_TOKEN")
