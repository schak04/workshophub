# WorkshopHub

<!-- markdownlint-disable MD033 -->
<p align="left">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  <img alt="Express.js" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white"/>
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white"/>
  <img alt="Bcrypt" src="https://img.shields.io/badge/Bcrypt-999999?style=for-the-badge&logo=appveyor&logoColor=white"/>
  <img alt="Postman" src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white"/>
  <img alt="React.js" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
</p>
<!-- markdownlint-enable MD033 -->

This project is a full-stack EdTech web application built with Node.js, Express.js, MongoDB, and React.js. It is designed to manage educational workshops.  
The system handles workshop creation, registrations, attendance tracking, feedback collection, material distribution, and certificate generation while strictly enforcing role-based access control (RBAC).  
It aims to streamline the entire workshop lifecycle for admins, instructors, and participants.

> [!IMPORTANT]  
> **Project Status: Complete**  
> WorkshopHub is a completed personal learning and portfolio project developed independently by [me](#author).  
> While the core features have been fully implemented, the project might still receive occasional refinements and bug fixes in the future by [me](#author). Feedback and discussions are always welcome, but the repository is not intended for external contributions.

![dashboard_preview_dark](public/dashboard_preview_dark.png)

<details>
<summary><b>Toggle light-theme admin dashboard preview</b></summary>

![dashboard_preview_light](public/dashboard_preview_light.png)
</details>

> [!NOTE]  
> These screenshots display placeholder data (names of legendary programmers as instructors and workshop names related to their projects/expertise) used to demonstrate the application's capabilities.

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB
- **ODM:** Mongoose  
- **Authentication:** JWT-based authentication  
- **Password Hashing:** Bcrypt (for secure password storage)  
- **Testing/Debugging Tools:** Postman, Browser DevTools 
- **Frontend:** React, Tailwind CSS, Vite
- **Certificate PDF Generation:** `pdfkit`
- **Toast Notifications:** `react-hot-toast`
- **Icons:** `lucide-react`

---

## Key Features

- Role-Based Access Control (RBAC) and JWT authentication
- Workshop creation and management
- Seamless participant registration and cancellation
- Attendance tracking with instructor-level restrictions
- Workshop material distribution
- Feedback and rating system
- PDF certificate generation for participants
- Clean and responsive user interface
- Robust RESTful API architecture

---

## System Design

### System Architecture
![System Architecture Diagram](docs/diagrams/system-architecture-diagram.png)

### UML Use Case Diagram
![UML Use Case Diagram](docs/diagrams/use-case-diagram.png)

### Entity Relationship (ER) Diagram
![ER Diagram](docs/diagrams/er-diagram.png)

---

## Author

&copy; 2025-2026 [Saptaparno Chakraborty](https://github.com/schak04).  
All rights reserved.

---
