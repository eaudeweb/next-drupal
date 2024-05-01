#!/bin/bash

# Accept an environment variable as the first argument
NEXT_IMAGE_DOMAIN=$1

# Check if NEXT_IMAGE_DOMAIN is empty and set a default value if necessary
if [ -z "$NEXT_IMAGE_DOMAIN" ]; then
    NEXT_IMAGE_DOMAIN="test.admin.multilateralfund.edw.ro"
fi

# Build Docker Image
echo "Building Docker Image with NEXT_IMAGE_DOMAIN=$NEXT_IMAGE_DOMAIN..."
DOCKER_BUILDKIT=1 docker build -t next-drupal-frontend . --file .docker/Dockerfile --build-arg NEXT_IMAGE_DOMAIN="$NEXT_IMAGE_DOMAIN" --build-arg NEXT_PUBLIC_DRUPAL_BASE_URL="https://test.admin.multilateralfund.edw.ro/" --build-arg APP_NAME="mlf-frontend" --build-arg NEXTAUTH_URL='http://localhost:3000/' --build-arg NEXTAUTH_SECRET='0Ela3Ae6kQQywNQk05/ePs09KpsoQi2HLelH/MRYGXk='

# Run Docker Container with all environment variables
echo "Starting Docker Container with NEXT_IMAGE_DOMAIN=$NEXT_IMAGE_DOMAIN..."
docker run -e NEXT_IMAGE_DOMAIN="$NEXT_IMAGE_DOMAIN" \
    -e DRUPAL_REVALIDATE_SECRET='secret' \
    -e DRUPAL_CLIENT_ID='-Fa3_d7TI5AapumYqZi3mwZOgK53q5UzpA99UzTwewM' \
    -e DRUPAL_CLIENT_SECRET='au0aiC6phixeiroo' \
    -e NEXTAUTH_URL='http://localhost:3000/' \
    -e NEXTAUTH_SECRET='0Ela3Ae6kQQywNQk05/ePs09KpsoQi2HLelH/MRYGXk=' \
    -p 3000:3000 next-drupal-frontend
