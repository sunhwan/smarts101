start: ## Start the docker containers
	@echo "Starting the docker containers"
	@docker-compose up
	@echo "Containers started - http://localhost:8000"

stop: ## Stop Containers
	@docker-compose down

restart: stop start ## Restart Containers

start-bg:  ## Run containers in the background
	@docker-compose up -d

build: ## Build Containers
	@docker-compose build

ssh: ## SSH into running web container
	docker-compose exec web bash

migrations: ## Create DB migrations in the container
	@docker-compose exec web python manage.py makemigrations

migrate: ## Run DB migrations in the container
	@docker-compose exec web python manage.py migrate

translations:
	@docker-compose exec web python manage.py makemessages --all --ignore node_modules --ignore venv
	@docker-compose exec web python manage.py makemessages -d djangojs --all --ignore node_modules --ignore venv
	@docker-compose exec web python manage.py compilemessages

shell: ## Get a Django shell
	@docker-compose exec web python manage.py shell

dbshell: ## Get a Database shell
	@docker-compose exec db psql -U postgres smarts101

test: ## Run Django tests
	@docker-compose exec web python manage.py test

init: start-bg migrations migrate  ## Quickly get up and running (start containers and migrate DB)

pip-compile: ## Compiles your requirements.in file to requirements.txt
	@docker-compose exec web pip-compile requirements/requirements.in
	@docker-compose exec web pip-compile requirements/prod-requirements.in

requirements: pip-compile build restart  ## Rebuild your requirements and restart your containers

npm-install: ## Runs npm install in the container
	@docker-compose exec web npm install

npm-build: ## Runs npm build in the container (for production assets)
	@docker-compose exec web npm run build

npm-watch: ## Runs npm watch in the container (recommended for dev)
	@docker-compose exec web npm run dev-watch

upgrade: build start-bg migrations migrate

.PHONY: help
.DEFAULT_GOAL := help

help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
