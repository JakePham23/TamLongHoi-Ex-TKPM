<div align="center">
   <h1 align="center">
      🏫Student Management Web🏫
   <h4 align="center">
      <h4>✨SERN PROJECT✨</h4>
               <p>
                    <a href="https://react.dev/">
                        <img src="https://img.shields.io/badge/Reactjs-%3E%3D19.0.0-blue" alt="ReactJS">
                    </a>
                    <a href="https://vitejs.dev/">
                        <img src="https://img.shields.io/badge/Vite-%3E%3D6.2.0-orange" alt="Vite">
                    </a>
                    <a href="https://nodejs.org/en">
                        <img src="https://img.shields.io/badge/NodeJS-%3E%3D23.7.0-green" alt="nodejs">
                    </a>
                </p>
         <p>
            <a href="#Overview">Overview</a>
            •
            <a href="#GetStarted">Get Started</a>
            •
            <a href="#Features">Features</a>
            •
            <a href="#Usage">Usage</a>
            •
            <a href="#Contributors">Contributors</a>
         </p>
      </h4>
   </h3>
   <br>
</div>

<div align="left">
   <h1 align="left" id="Overview">Overview👋</h1>
   
   >The Student Management System project is a web-based application built using `Reactjs` for the front-end and `Nodejs` for the back-end. This system aims to provide a `comprehensive` solution for managing student information in schools, including personal records, academic performance, and extracurricular activities
   
   **`Video`**
   
   <h1 id="GetStarted">Get Started⚙️</h1>
   
   >Follow these steps to get the Student Management System project up and running on your device:
   **1. Clone the repository:**
      `Full source`
      
           git clone https://github.com/JakePham23/TamLongHoi-Ex-TKPM.git
      
   **2. Run the project with docker**
      
   `Terminal` (macos)
         
         docker compose up -d --build
       
      
   `Terminal` (Windows)

         docker-compose up -d --build

   `Access`

         http://localhost:8080/

   **3. Run the project with terminal or cmd**
      
   `Start backend`

         cd backend
         npm i
         npm start

   `Start frontend`
      
         cd ..
         cd frontend
         npm i
         npm run build

   `Access`

         http://localhost:5173/
   **4. Run the project with detailed API documentation**

   `Terminal`

         cd backend
         npm i
         npm run api

   `Access API documentation`

          http://localhost:4000/api-docs

# Features 🤖

   **1. Giao diện Sinh viên (Student view):**

- Giao diện bảng danh sách sinh viên
  ![Giao diện bảng sinh viên](./images/student/student_table.png)
- Thông tin chi tiết sinh viên
  ![Thông tin chi tiết sinh viên](./images/student/student_information.png)
- Xem chi tiết một sinh viên
  ![Xem chi tiết một sinh viên](./images/student/student_view_detail.png)
- Tạo mới sinh viên
  ![Tạo mới sinh viên](./images/student/student_create.png)

**2. Giao diện Khoa (Department view):**

- Tạo mới khoa
  ![Tạo mới khoa](./images/department/department_create.png)
- Giao diện bảng danh sách khoa
  ![Giao diện bảng danh sách khoa](./images/department/department_table.png)
- Cập nhật thông tin khoa
  ![Cập nhật thông tin khoa](./images/department/department_update.png)

**3. Giao diện Môn học (Course view):**

- Giao diện bảng danh sách môn học
  ![Giao diện bảng danh sách môn học](./images/course/course_table.png)
- Cập nhật thông tin môn học
  ![Cập nhật thông tin môn học](./images/course/course_update.png)
- Tạo mới môn học
  ![Tạo mới môn học](./images/course/course_create.png)

**4. Giao diện Đăng ký môn học (Registration view):**

- Giao diện bảng danh sách đăng ký
  ![Giao diện bảng danh sách đăng ký](./images/registration/registration_table.png)
- Cập nhật đăng ký
  ![Cập nhật đăng ký](./images/registration/registration_update.png)
- Xem chi tiết đăng ký
  ![Xem chi tiết đăng ký](./images/registration/registration_view_detail.png)
- Tạo mới lượt đăng ký
  ![Tạo mới lượt đăng ký](./images/registration/registration_create.png)
- Sinh viên đăng ký môn học
  ![Sinh viên đăng ký môn học](./images/registration/registration_register.png)

   <p align="center">
   <br></br>

   <h1 id="Contributors">Contributors🤝</h1>
<div style="display: flex; flex-direction: row; justify-content: space-between; gap: 20px; padding: 20px;">
  <a href="https://github.com/nasm1023" target="_blank" title="nasm1023">
    <img 
      src="https://avatars.githubusercontent.com/u/127742124?v=4" 
      alt="nasm1023"
      style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" 
    />
  </a>

  <a href="https://github.com/phu-nguyen-dinh" target="_blank" title="phu-nguyen-dinh">
    <img 
      src="https://avatars.githubusercontent.com/u/174979815?v=4" 
      alt="phu-nguyen-dinh"
      style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" 
    />
  </a>

  <a href="https://github.com/JakePham23" target="_blank" title="JakePham23">
    <img 
      src="https://avatars.githubusercontent.com/u/139458255?s=400&u=9d70803854e2cf01c3441cd30eeb92d0c6545578&v=4" 
      alt="JakePham23"
      style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; box-shadow: 0 4px 8px rgba(0,0,0,0.1);" 
    />
  </a>
</div>


   
   ## 1. License
   This project is licensed under the MIT License.
</div>