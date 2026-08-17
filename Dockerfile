FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=3005
EXPOSE 3005

CMD ["python3", "server_with_api.py"]
