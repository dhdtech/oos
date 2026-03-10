.PHONY: up down build logs test ui-test test-all

# --------------- Docker ---------------

up: ## Start all containers
	docker compose up --build -d

down: ## Stop all containers
	docker compose down

build: ## Rebuild all containers
	docker compose build

logs: ## Tail container logs
	docker compose logs -f

# --------------- API Tests ---------------

test: ## Run API tests with coverage
	cd api && python3 -m pytest test_app.py -v --cov=app --cov-report=term-missing

# --------------- UI Tests ---------------

ui-test: ## Run UI tests with coverage
	cd ui && npx vitest run --coverage

# --------------- All Tests ---------------

test-all: test ui-test ## Run all tests

# --------------- Help ---------------

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
