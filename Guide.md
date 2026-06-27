# 🚀 Event Management System - Complete Setup Guide

---

###### Step 01

use terminal - java -version

* check java version 17.0.19
* If you don't have go Software folder install jdk 17

###### How to install java. (If you have jdk 17 don't need to do this)

* Extract jdk 17 on your "C:\Program Files\Java\"
* use terminal - where java

---

###### Step 02

use terminal - node -v

* check Node.js version 16 or above.

###### How to install node. (If you have node 16 or above don't need to do this)

* Extract node 22 on your "C:\Program Files\nodejs\"
* use terminal - where node

---

###### Step 03

* Open frontend folder in VScode.
* Open new terminal and type "npm install"

---

###### Step 04

Download (Clone) the project from GitHub.

* Open Command Prompt.
* Navigate to where you want to save the project (e.g., your Desktop or Documents):
* example: cd D:\NIBM\BSc Hons Computer Science with Artificial Intelligence\Agile\
* Run this command to download the project:
git clone https://github.com/VikumPrabhath/Event-Management-System.git
* Move into the project folder: cd Event-Management-System

* (Keep this terminal open, we will use it later to run the frontend).

---

###### Step 05

Run the Backend (Spring Boot) using IntelliJ.

**Important:** The backend needs a special password to talk to the cloud database. We will set this up securely.

###### 5.1 Open the Backend in IntelliJ

* Open **IntelliJ IDEA**.
* Click **"Open"** (NOT "New Project").
* Navigate to where you cloned the project. Select the **`event-management-system`** folder inside `Event-Management-System` and click **OK**.
* Wait 2-3 minutes for IntelliJ to download all the Java dependencies (Maven will run automatically).

###### 5.2 Add the Secret Database Password (Environment Variable)

*(Your friend, Vikum, will send you the actual database password privately. You will put it here).*

* In IntelliJ, look at the top right. Click the **down arrow** next to the green play button (▶️) and select **"Edit Configurations..."**.
* In the window that pops up, look for the **"Modify options"** link and click it.
* Check the box that says **"Environment variables"**. A new field will appear.
* Click the **folder icon (📁)** at the end of the "Environment variables" field.
* Click the **"+" (plus)** button.
* In **Name**, type exactly: `MONGODB_URI`
* In **Value**, paste the string provided to you by Vikum.
*(It will look like: `mongodb+srv://vikumprabhath4_db_user:THE_PASSWORD@cluster0.b7a1gzg.mongodb.net/?retryWrites=true&w=majority`)*
* Click **OK**, then **Apply**, then **OK**.

###### 5.3 Start the Backend Server

* Click the **green play button (▶️)** at the top right.
* Look at the bottom logs. Wait for the magic line: Started EventManagementSystemApplication in X seconds

* **Leave this running.** The backend is now live on `http://localhost:8081`.

---

###### Step 06

Run the Frontend (React) using VS Code.

* Open a **NEW Command Prompt** (or use the terminal in VS Code).
* Navigate to the frontend folder: cd Event-Management-System\frontend
* Install the required libraries (this takes 2-3 minutes): npm install

* Create the `.env` file (This tells React to ignore a strict host check):
* In the `frontend` folder, create a new file named `.env`.
* Open it and paste exactly this line: DANGEROUSLY_DISABLE_HOST_CHECK=true

* Save the file.
* Start the React development server: npm start

* Your browser will automatically open `http://localhost:3000`.

---

###### Step 07

Confirm Everything Works.

* Look at your browser at `http://localhost:3000`.
* You should see: ✅ Backend is connected successfully!

* If you see this, **CONGRATULATIONS!** You have successfully set up the full application. Your frontend is talking to the backend, and the backend is connected to the cloud database.

---

###### 🛠️ Troubleshooting (Common Issues)

| Problem | Solution |
| :--- | :--- |
| **`java` is not recognized** | You didn't install Java properly, or you didn't restart the terminal after installing. Reboot your PC or reinstall Java. |
| **`node` is not recognized** | You didn't install Node properly. Restart your terminal. |
| **Backend crashes with "Database name must not be empty"** | You forgot to set the `MONGODB_URI` in IntelliJ. Go back to Step 5.2 and add it. |
| **Frontend shows `⚠️ Backend responded, but with an error`** | Your backend is not running. Go back to IntelliJ and click the green play button to start it. |
| **Port 8081 is already in use** | Close any other Java apps or restart your computer. |
| **Port 3000 is already in use** | Press `Ctrl + C` in the terminal, type `Y` and press Enter. Then run `npm start` again. |

---

###### 🔐 Security Note for Collaborators

* The database password is **NOT** stored in the code. 
* You must set the `MONGODB_URI` environment variable in IntelliJ every time you run the project (as shown in Step 5.2).
* Keep the password private and do not share it in public chats.

---

###### 🤝 How to Collaborate (Git Basics)

Since we are using Git and GitHub, here is the standard workflow to avoid overwriting each other's code.

* **Always pull the latest code before you start working:**

git pull origin main

* **After you make changes and save files, upload them:**
git add .
git commit -m "Describe what you changed here"
git push origin main

* **If you get a "Merge Conflict":** Don't panic. IntelliJ/VS Code will highlight the conflicting lines. Keep the correct code, delete the `<<<<<<< HEAD` and `>>>>>>>` markers, save, and push again.

---

**End of Guide** 🎉