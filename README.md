# School Management System - نظام إدارة المدرسة

A comprehensive school management system built with ASP.NET Core Web API (Clean Architecture) and Angular with full Arabic support and RTL layout.

## 🏗️ Architecture

### Backend (ASP.NET Core Web API)
- **Clean Architecture** with separation of concerns
- **Entity Framework Core** with Code First approach
- **JWT Authentication** with role-based authorization
- **AutoMapper** for object mapping
- **FluentValidation** for input validation
- **SQL Server** database

### Frontend (Angular)
- **Angular 17+** with TypeScript
- **Bootstrap 5** for responsive UI
- **Full Arabic localization** with RTL support
- **Lazy-loaded modules** for better performance
- **JWT interceptors** and route guards
- **Reactive forms** with validation

## 🚀 Features

### 👨‍💼 Admin Features
- Dashboard with statistics and analytics
- User management (Students, Teachers, Admins)
- Class and subject management
- Exam and grade management
- Attendance tracking and reports
- Salary management for teachers
- PDF/Excel report generation

### 👨‍🏫 Teacher Features
- Personal dashboard with assigned classes
- Schedule management
- Grade entry and management
- Attendance marking
- Salary information
- Exam creation and management

### 👩‍🎓 Student Features
- Personal profile management
- Class enrollment
- Schedule viewing
- Grade and exam results
- Attendance records
- Academic progress tracking

## 🛠️ Technology Stack

### Backend
- ASP.NET Core 8.0 Web API
- Entity Framework Core 8.0
- SQL Server
- JWT Bearer Authentication
- AutoMapper
- FluentValidation
- BCrypt for password hashing

### Frontend
- Angular 17+
- TypeScript
- Bootstrap 5
- Font Awesome icons
- RxJS for reactive programming
- Angular HTTP Client
- Angular Router with guards

## 📁 Project Structure

```
Backend/
├── SchoolManagement.API/          # Web API layer
├── SchoolManagement.Application/  # Application layer
├── SchoolManagement.Domain/       # Domain layer
├── SchoolManagement.Infrastructure/ # Infrastructure layer
└── SchoolManagement.Shared/       # Shared DTOs

Frontend/
├── src/
│   ├── app/
│   │   ├── core/                  # Core services and models
│   │   ├── features/              # Feature modules
│   │   │   ├── admin/
│   │   │   ├── teacher/
│   │   │   └── student/
│   │   └── shared/                # Shared components
│   ├── assets/                    # Static assets
│   └── environments/              # Environment configs
```

## 🚀 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or full version)
- Angular CLI

### Backend Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd Backend
```

2. **Update connection string**
```json
// appsettings.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SchoolManagementDB;Trusted_Connection=true;MultipleActiveResultSets=true"
  }
}
```

3. **Run database migrations**
```bash
cd SchoolManagement.API
dotnet ef database update
```

4. **Run the API**
```bash
dotnet run
```

The API will be available at `https://localhost:7001`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd Frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Update API URL**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'https://localhost:7001/api/v1'
};
```

4. **Run the application**
```bash
ng serve
```

The application will be available at `http://localhost:4200`

## 🔐 Default Users

The system comes with default demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.com | 123456 |
| Teacher | teacher@school.com | 123456 |
| Student | student@school.com | 123456 |

## 🌍 Arabic Support

The frontend is fully localized in Arabic with:
- RTL (Right-to-Left) layout
- Arabic fonts (Cairo font family)
- Arabic date formatting
- Arabic number formatting
- Responsive design for Arabic text

## 📊 Database Schema

The system uses the following main entities:
- **Users** (Admin, Teacher, Student)
- **Students** with guardian information
- **Teachers** with salary information
- **Classes** and **Subjects**
- **Exams** and **Grades**
- **Attendance** records
- **Salaries** for teachers

## 🔒 Security Features

- JWT-based authentication
- Role-based authorization
- Password hashing with BCrypt
- HTTP-only cookies for refresh tokens
- CORS configuration
- Input validation and sanitization

## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers with RTL support

## 🚀 Deployment

### Backend Deployment
1. Publish the API project
2. Configure production database
3. Update JWT settings
4. Deploy to IIS or cloud service

### Frontend Deployment
1. Build for production: `ng build --prod`
2. Deploy dist folder to web server
3. Configure routing for SPA
4. Update API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.

---

**نظام إدارة المدرسة - School Management System**
Built with ❤️ using ASP.NET Core and Angular