# Étape de build
FROM python:3.9-slim-buster AS builder
WORKDIR /app
COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt
COPY . .

# Étape de runtime
FROM python:3.9-slim-buster
WORKDIR /app
COPY --from=builder /usr/local/lib/python3.9/site-packages /usr/local/lib/python3.9/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app
EXPOSE 8080
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:$PORT main:app"]
