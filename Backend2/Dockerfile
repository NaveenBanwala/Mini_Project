FROM postgres:15

# Set environment variables
ENV POSTGRES_DB=attendance_portal
ENV POSTGRES_USER=admin
ENV POSTGRES_PASSWORD=password123

# Any .sql files in this directory are executed on container startup
# You can put your INSERT/CREATE TABLE scripts here
COPY ./init.sql /docker-entrypoint-initdb.d/