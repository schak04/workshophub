# Workshop Management System

<!-- markdownlint-disable MD033 -->
<p align="left">
  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img alt="Express.js" src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img alt="Mongoose" src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" />
  <img alt="JWT" src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img alt="Bcrypt" src="https://img.shields.io/badge/Bcrypt-999999?style=for-the-badge&logo=appveyor&logoColor=white" />
  <img alt="Postman" src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
  <img alt="React.js" src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>
<!-- markdownlint-enable MD033 -->

This project is a full-stack web application designed to manage learning/educational workshops.  
The system handles workshop creation, registrations, attendance tracking, feedback collection, and certificate generation while enforcing strict role-based access control.  
It aims to streamline the entire workshop lifecycle for both organizers and participants.

---

## Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** MongoDB
- **ODM:** Mongoose  
- **Authentication:** JWT-based authentication  
- **Password Hashing:** Bcrypt (for secure password storage)  
- **Testing Tools:** Postman  
- **Frontend:** React, Tailwind CSS, Vite

---

## Key Features

- Role-based authentication and authorization
- Workshop creation and management
- Secure workshop registration and unregistration
- Attendance tracking with instructor-level restrictions
- Feedback system with access control
- Certificate generation for completed workshops
- Clean and responsive user interface
- RESTful API architecture

---

## User Roles & Permissions (current; may be updated in future versions)

### Admin

- Create, update, delete, and view workshops
- Assign instructors to workshops (during workshop creation)
- Manage attendance across all workshops
- View feedback submitted for all workshops

### Instructor

- View workshops
- Manage attendance only for their own workshops
- View feedback only for their own workshops

### Participant

- View workshops
- Register for workshops
- View their registrations
- Unregister from workshops
- Submit feedback for workshops

---

## Author

Copyright (c) 2025 [Saptaparno Chakraborty](https://github.com/schak04).  
All rights reserved.

---
