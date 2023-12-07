# <img src="https://camo.githubusercontent.com/167ab640dc8baf89d5e743fc9c3e6857da0a8d905a1915bd9415665b633cf2f2/68747470733a2f2f6d656469612e74656e6f722e636f6d2f696d616765732f66303032656537643235373266303837383431623534373836306363373333392f74656e6f722e676966" width="40px"> BACKEND: User Authentication Module 



![Nodejs](https://img.shields.io/badge/-Nodejs-black?style=flat-square&logo=Node.js)
![Expressjs](https://img.shields.io/badge/-Expressjs-black?style=flat-square&logo=express)
![Redis](https://img.shields.io/badge/-Redis-black?style=flat-square&logo=redis)
![MySQL](https://img.shields.io/badge/-MySQL-black?style=flat-square&logo=mysql)
![Docker](https://img.shields.io/badge/-Docker-black?style=flat-square&logo=docker)
![Git](https://img.shields.io/badge/-Git-black?style=flat-square&logo=git)

## ⚡ Main Developer
- [Nur Hajjariah Binti Khusaini](https://gitlab.sains.com.my/hajjariah)

## ⚡ Description
Beyond the essentials of user login and logout, this module offers seamless session management powered by `express-session` and `redis`. By knitting together these technologies, we ensure airtight security and uninterrupted user experiences, all while placing precise control over access permissions in the hands of administrators. This holistic approach enhances both the robustness of your security infrastructure and the overall engagement of your users.


#### 🌟 Key Features
- **Session Handling**: The module seamlessly manages user sessions, providing a reliable foundation for your application's user experience.
- **CICD Pipeline**: We've integrated a robust Continuous Integration and Continuous Deployment (CICD) pipeline, streamlining your development process.
- **Testing Framework**: Rigorous testing is at the core of our module, ensuring stability, reliability, and a confident deployment.
- **Nodemailer Ready**: Email feature ready, user just have to setup their own email server and account to send it from.
- **Scheduler Embedded**: Prepped with scheduler for log files housekeeping that will remove log files over 1 month old (node-cron).
- **Access Control**: Empower administrators with precise control over user access, differentiating between user, admin, and superadmin roles.
- **CORS Settings**: Configure Cross-Origin Resource Sharing (CORS) to facilitate secure communication between your frontend and backend, enhancing overall security and data protection.
- **Linting Support**: Our module includes linting tools to maintain code quality, enforce consistency, and catch potential issues during development.
- **Swagger UI Enabled**: Utilize the power of Swagger UI to effortlessly document and visualize your API endpoints, promoting seamless interaction and collaboration.

Discover a comprehensive solution that embodies security, convenience, and precision - all designed to empower your application's journey. Welcome to the future of user authentication.


## ⚡ Bookmarks
- [Session Handling With Redis](https://www.youtube.com/watch?v=AlE021bw3Fc&list=PL1Nml43UBm6fPP7cW9pAFTdZ_9QX2mBn2&index=4) 
- [NodeJS Redis Session Store](https://github.com/chamithrepo/nodejs-redis-session-store/tree/main)

## ⚡ Local Development

### Requirements
- NodeJS v18.16.0
- Node Package Manager v9.8.1
- MySQL
- Redis v6

### Getting Started
- Clone this repository 
- Checkout to working branch
- Change directory ```cd server```
- Install all required packages with ```npm install```
- Run the program ```npm run go```
    - When the terminal displays the log below, the compilation is successful
    <br>
    <a href="https://imgbb.com/"><img src="https://i.ibb.co/k9zVtZm/Screenshot-2023-08-01-111510.png" alt="Screenshot-2023-08-01-111510" border="0"></a><br /><a target='_blank' href='https://imgbb.com/'></a><br />
- Open browser and go to [http://127.0.0.1:3000/docs](http://127.0.0.1:3000/docs) to view the API documentation and test them

