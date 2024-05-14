# Share-a-Review

Share-a-Review is a platform where users can share and discover reviews for various categories such as restaurants, books, movies, and more. This repository contains the source code for the Share-a-Review web application built using Next.js.

## Features

- **User Authentication:** Users can sign up, log in, and manage their profiles.
- **Review Creation:** Users can create reviews for different categories and share their opinions.
- **Search and Discovery:** Users can search for reviews based on categories and keywords.
- **Responsive Design:** The application is optimized for various screen sizes.

## Technologies Used

- **Next.js:** Next.js is a React framework for building server-side rendered (SSR) and statically generated web applications.
- **SonarCloud:** SonarCloud is used for continuous code quality inspection and reporting.
- **Vercel:** Vercel provides seamless integration for deploying Next.js applications with automatic deployment.

## Installation

To run this project locally, follow these steps:

1. Clone this repository: `git clone https://github.com/username/share-a-review.git`
2. Navigate to the project directory: `cd share-a-review`
3. Install dependencies: `npm install`
4. Set up environment variables (if required).
5. Start the development server: `npm run dev`

## Docker Compose Setup Documentation

### Setting up PostgreSQL and pgAdmin4 Containers with Docker Compose

This documentation provides step-by-step instructions for setting up two Docker containers using Docker Compose: one for PostgreSQL and the other for pgAdmin4. Both containers will be configured with necessary environment variables and mount volumes for optimal functionality.

```
Prerequisites:
- Docker installed on your system.
- Basic understanding of Docker Compose.
```

#### Create a Docker Compose File:

The provided `docker-compose.yml` in the `docker` directory provdides an out-of-the-box configuration:

```yaml
services:
  postgres:
    image: postgres:latest
    ports:
      # Host:Container
      # 5432 is the default port for PostgreSQL
      # Left side is the host machine port, right side is the container port
      - 5432:5432
    volumes:
      - ~/DockerData/pg:/var/lib/postgresql/data
    environment:
      # Syntax for environment variables: VARIABLE_NAME=VALUE
      # ${VARIABLE_NAME:-DEFAULT_VALUE} is used to set a default value
      # if the environment variable is not set
      # POSTGRES_DB: Database name
      - POSTGRES_DB=${POSTGRES_DB:-postgres}
      # POSTGRES_PASSWORD: Database password
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres}
      # POSTGRES_USER: Database user
      - POSTGRES_USER=${POSTGRES_USER:-postgres}
      # PGDATA: Database data directory
      - PGDATA=/var/lib/postgresql/data
    networks:
      - postgres-db-network

  pgadmin4:
    image: dpage/pgadmin4
    restart: always
    # Override the default entrypoint to copy the pgpass file
    entrypoint: >
      /bin/sh -c "
      cp -f /pgadmin4/pgpass /var/lib/pgadmin/;
      chmod 600 /var/lib/pgadmin/pgpass;
      chown pgadmin:pgadmin /var/lib/pgadmin/pgpass;
      /entrypoint.sh
      "
    environment:
      # Syntax for environment variables: VARIABLE_NAME=VALUE
      # ${VARIABLE_NAME:-DEFAULT_VALUE} is used to set a default value
      # if the environment variable is not set
      # PGADMIN_DEFAULT_EMAIL: Default email for pgAdmin4
      - PGADMIN_DEFAULT_EMAIL=${PGADMIN_DEFAULT_EMAIL:-admin@admin.com}
      # PGADMIN_DEFAULT_PASSWORD: Default password for pgAdmin4
      - PGADMIN_DEFAULT_PASSWORD=${PGADMIN_DEFAULT_PASSWORD:-admin}
      # PGADMIN_LISTEN_PORT: Port on which pgAdmin4 will listen
      - PGADMIN_LISTEN_PORT=8080
      # PGPASSFILE: Path to the pgpass file
      - PGPASSFILE=/var/lib/pgadmin/pgpass
    ports:
      # Host:Container
      # 8080 is the default port for pgAdmin4
      # Left side is the host machine port, right side is the container port
      - 8080:8080
    volumes:
      # Mount the servers.json file to the container
      # This file contains the list of servers that pgAdmin4 will connect to
      - ./pgpass:/pgadmin4/pgpass
      # Mount the pgpass file to the container
      # This file contains the password for the PostgreSQL server
      - ./servers.json:/pgadmin4/servers.json
    networks:
        - postgres-db-network

networks:
    postgres-db-network:
        driver: bridge
```

Export the following environment variables:
```
POSTGRES_DB=
POSTGRES_PASSWORD=
POSTGRES_USER=
PGADMIN_DEFAULT_EMAIL=
PGADMIN_DEFAULT_PASSWORD=
```

You can also use the default values provided in the file above.

### Create Required Files:

#### Create `pgpass` File:

Create a `pgpass` file with PostgreSQL credentials. You should use the same PostgreSQL values from above:

```
<hostname>:<port>:<database>:<username>:<password>
```

#### Create `servers.json` File:

Create a `servers.json` file with PostgreSQL server configurations. You should use the same PostgreSQL values from above:

```json
{
  "Servers": {
    "1": {
      "Name": "PostgreSQL",
      "Host": "postgres_container",
      "Port": 5432,
      "MaintenanceDB": "postgres",
      "Username": "<username>",
      "Password": "<password>",
      "SSLMode": "prefer"
    }
  }
}
```

### Run Docker Compose:

In your terminal, navigate to the directory containing the `docker-compose.yml` file and execute the following command:

```
docker-compose up -d
```

This command will start the PostgreSQL and pgAdmin4 containers defined in the `docker-compose.yml` file in detached mode.

Conclusion:

You have now successfully set up Docker containers for PostgreSQL and pgAdmin4 using Docker Compose with necessary configurations. You can access pgAdmin4 at `http://localhost:8080` and manage your PostgreSQL database seamlessly.


## Deployment

This project is set up for automatic deployment using Vercel. Upon pushing changes to the main branch, Vercel automatically builds and deploys the application.

## Code Quality

Code quality is monitored using SonarCloud. Any issues detected in the codebase are reported, helping maintain clean and efficient code.

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

Please make sure to follow the [code of conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [SonarCloud Documentation](https://sonarcloud.io/documentation)
- [Vercel Documentation](https://vercel.com/docs)
