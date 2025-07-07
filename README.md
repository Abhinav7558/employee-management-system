# Employee Management System (EMS)

A full-stack Employee Management System developed using **Django** and **React**, providing dynamic form creation, employee CRUD, and secure authentication with JWT. This project was built as part of a machine test challenge to demonstrate backend REST API implementation and a modern frontend UI.

---

## Features Overview

### Authentication & Profile

- **User Registration**
- **Login** with JWT (Access + Refresh tokens)
- **Change Password**
- **User Profile**

### Dynamic Form Builder

- Create and edit reusable employee form templates
- Support for field types: **Text**, **Number**, **Date**, **Password**, etc.
- Add/remove custom fields dynamically
- Drag and drop to reorder form fields

### Employee Management

- Create employee records using a selected form template
- Store dynamic field values per employee
- Update employee details via the same template
- Delete employee records
- List all employees with form-based field display
- Filter and search based on dynamic form fields

---

## 🔧 Technology Stack

### Backend

- **Python** 3.10+
- **Django** 4.2
- **Django REST Framework**
- **JWT (Simple JWT)**
- **PostgreSQL**

### Frontend

- **React** (with TypeScript)
- **Vite**
- **Tailwind CSS**
- **Axios**
- **Lucide Icons**

---

## API Documentation

API is fully documented using **Swagger** (DRF built-in).

📚 Visit at:  
http://localhost:8000/api/docs/ (Swagger UI)

---

## 📦 Project Structure

```
EMPLOYEE-MANAGEMENT/
│
├── ems_backend/ # Django backend
│ ├── auth_app/ # Authentication module
│ ├── employee_app/ # Employee creation and listing
│ ├── form_builder/ # Dynamic form template creation
│ ├── manage.py
│ └── ...
│
├── ems_frontend/ # React + Vite frontend
│ ├── src/
│ ├── .env # Contains VITE_API_URL
│ └── ...
│
├── requirements.txt
├── .gitignore
└── README.md

```

---

## Setup Instructions

## ⚙️ Environment Variables

Both frontend and backend use `.env` files to configure environment-specific settings.

### Setting up `.env` files:

1. **Copy the sample file**:

   ```bash
   cp sample.env .env
   Update variables with appropriate values (e.g. database credentials, API URLs).
   ```

### Backend

```bash
cd ems_backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

⚛️ Frontend
bash

```
cd ems_frontend
npm install
npm run dev
```

Postman collection available in the repo at:

```
https://.postman.co/workspace/My-Workspace~3fe2ebdb-7c17-453d-8c74-2e84c4f7bd72/collection/21425277-ea65745c-6b93-4f7c-84e6-7ededa63e6a0?action=share&creator=21425277
```
