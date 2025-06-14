# About
**Olymp.run** is a fullstack web application for organizing competitive programming olympiads. The application can be deployed in a container or on a hosting platform.  
  
# Features
The application supports: administrator registration (via Postman), tasks and olympiads creation (via the admin panel), and management of problems, users, and contests (via Postman).  
  
# Get Started
You will need to generate `CRYPT_IV` in **hex format** with a length of **16** and `CRYPT_KEY` in **hex format** with a length of **32**.  
You will need to create a **login** and **password** for the database. 
  
And after that rename **.env.example** to **.env**  
  
**Command to rebuild from root directory:**  
`docker-compose down; docker volume rm olymprun_frontend_build; docker-compose up --build`  
