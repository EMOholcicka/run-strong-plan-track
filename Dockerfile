
FROM python:3.11-slim

WORKDIR /

COPY ../requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# No Copy, we mirror code to container for live reload
#COPY . /backend

EXPOSE 8090

CMD ["uvicorn", "backend.main:app",  "--host", "0.0.0.0" ,"--port", "8090", "--reload"]
