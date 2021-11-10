FROM nginx

# Copy our static file.
RUN mkdir -p /usr/share/nginx/html/
COPY build/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
