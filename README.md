# Get Started
You will need to generate `CRYPT_IV` in **hex format** with a length of **16** and `CRYPT_KEY` in **hex format** with a length of **32**  
You will need to create a **login** and **password** for the database. 
  
And after that rename **.env.example** to **.env**  
  
**Command to build from root directory:**  
`docker-compose down; docker volume rm olymprun_frontend_build; docker-compose up --build`  
