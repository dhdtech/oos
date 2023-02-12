# .SILENT:
ifeq ($(OS),Windows_NT)
	OPEN := start
else
	UNAME := $(shell uname -s)
	ifeq ($(UNAME),Linux)
		OPEN := xdg-open
	endif
	ifeq ($(UNAME),Darwin)
		OPEN := open
	endif
endif

.PHONY: help

help: ## Show this help message
	@echo "dhdtech.io command help.\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

codegen: ## Gera o código base flask para o projeto
	mv README.md BCK.README.md > /dev/null 2>&1 || true
	docker run --rm -v $(PWD)/:/local openapitools/openapi-generator-cli generate -i /local/openapi/oos.yaml -g python-flask -o /local/  --minimal-update --model-package objects --package-name api 
	rm requirements.txt setup.py test-requirements.txt tox.ini git_push.sh Dockerfile .travis.yml	
	mv BCK.README.md README.md 

build: ## Create docker image 
	docker-compose build;

up: ## Runs the image
	docker-compose up;

configure_devel: ## Delete/create virtual environment and install all requirements
	if [ -d "venv" ]; then \
		rm -rf venv; \
    fi;
	python3 -m venv venv;
	bash -c "source venv/bin/activate && pip install -r requirements/base.txt && pip install -r requirements/develop.txt";
	bash -c "source venv/bin/activate && pre-commit install";

init_test_with_coverage: ## Runs all project test suite, recording all test converage data
	if [ -d "coverage-reports" ]; then \
		rm -rf coverage-reports; \
    fi;
	if [ -d "htmlcov" ]; then \
		rm -rf htmlcov; \
    fi;	
	if [ -a "coverage.xml" ]; then \
		rm coverage.xml; \
    fi;	
	
	-pytest --cov; 
	-coverage xml;
	-coverage report;
	-coverage3 html;

ci_coverage:
	-pytest --cov; 
	-coverage xml;	

run_test: ## Runs all project test suite, without coverage data	
	docker exec -w /app -it oos-api sh -c 'pytest --cov' || (echo "${RED}🐛 Error trying to execute test. Check log.\n${RESET}$$?"; exit -1);
	docker exec -w /app -it oos-api sh -c 'coverage xml';
	docker exec -w /app -it oos-api sh -c 'coverage html';

run_test_with_coverage: # Run unit tests and generate code coverage reports
	docker exec -w /app -i oos-api sh -c 'python -m coverage run -m pytest' || (echo "${RED}🐛 Error trying to execute test. Check log.\n${RESET}$$?"; exit -1); \
	docker exec -i oos-api python -m coverage combine; \
	docker exec -i oos-api python -m coverage report 2>/dev/null; \
	docker exec -i oos-api python -m coverage html 2>/dev/null; \
	docker exec -i oos-api python -m coverage xml 2>/dev/null;

reset: configure_devel  ## Wipe local database, docker images an volumes, reset local dev environment and then rebuild docker images from scratch. (loose your local data)
	docker-compose down; \
	docker system prune -a -f --filter "label=oos-container"; \
	if [ -d "data/pg_data" ]; then \
		rm -rf data/pg_data/; \
    fi; \
	$(MAKE) build \
	$(MAKE) up 

