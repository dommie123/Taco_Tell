# Taco Tell
A schedule change notification app designed to store employee information (i.e. phone numbers) in a local, isolated database, and use said information to send out SMS updates to every employee regarding changes in their work schedule. Restaurant owners may opt their employees into the program, edit their information, or remove them from the database, effectively opting them out of the program.

# Technologies Used
* React.js - UI
* HTML - UI
* CSS - UI styling
* Python - server code
* Flask - API and server code
* SQLAlchemy - database
* Twilio - SMS service
* Dotenv - hidden variables
* JSON - API requests, app configuration, and hidden variables

# Features
Restaurant owners can: 
* Add employees to the database
* Remove employees from the database
* Send out SMS updates to all employees at once
* View a list of currently enrolled employees

Employees can:
* Receive SMS notifications informing them of changes to the schedule.
* <b>Note*</b> In order to opt out of the program, the restaurant owner MUST perform this operation in the app themselves. The same applies when opting in to the program.

# Stretch Goals
## Version 1.1
* Restaurant owners may upload a spreadsheet of the employees' work schedules to the database, which will then notify every employee of schedule changes.
* When spreadsheet is uploaded, it will compare the spreadsheet info against a locally stored database containing schedule information and update the database according to the new or varying information in the spreadsheet.
* When employees are updated, their new schedule information will be included in the SMS update
* The "Update Employees" button will be on a separate Settings page in case restaurant owners need to send out SMS updates that way.
* Restaurnat owners may update employees individually, rather than all at once, if necessary.
* The app will check its database headers against the spreadsheet headers and ONLY update employees if all spreadsheet headers match with the database headers.

## Version 1.2
* Employees may opt out of the program themselves if they so choose, by sending an SMS to the app's dedicated phone number.
* The app will "blacklist" employees who choose to opt out of the program, rather than removing them entirely.
* Restaurant owners may also blacklist employees rather than removing them in case removal from the schedule is temporary.
* Restaurant owners may view a list of all of the employees who are blacklisted and opt them back in if they so choose.
* Employees will now be notified if they have been opted in, removed, or blacklisted from the database.

## Future Versions
* App will monitor the employee scheduling program for schedule changes in real time, making the SMS notification system completely automatic.
* The app may now send MMS or RCS updates to employees rather than SMS updates.

# Getting Started
## To run this app in your store, you will need: 
* A Raspberry Pi with a 32GB Micro SD Card (preferred), OR
* A computer, running 24/7
* Access to your store's administrator Wi-Fi (guest Wi-Fi will not be as effective due to the 30-minute timeout)
* A dedicated setup and start script, which can be found <a href="https://1drv.ms/f/c/9a71a5bdf0c963dc/IgB9tCizpUDmQbQLmCw4ZPh9AWmc5yspWv6lSGEB9uNLUl4?e=vPWzQM">here</a>.

## Directions
1) Follow the setup process for your Raspberry Pi at <a href="https://www.raspberrypi.com/documentation/computers/getting-started.html">this website</a>. If you don't have one, you may skip to Step 3.
2) Connect a mouse, keyboard, and monitor to the Pi. This will significantly streamline the setup process.
3) Download both the setup and start scripts for your machine.
4) Find your machine's IP address within the network. If you have a Pi, you can do this by typing <code>ifconfig</code> in the terminal.
5) Send an email to <a>beegyoshi9817@gmail.com</a>, and I will give you a file with the variables needed to ensure the app runs properly.
6) Create another file and name it configs.json.
7) Type the following into the configs file: 

<code>
{
    "CLIENT_IP": "[your machine's IP address]",
    "SERVER_IP": "[your machine's IP address]"
}
</code>

8) Click the green "Code" button above this project's code file list in GitHub.
9) Copy the website under the "Clone" section.
10) Follow this guide for cloning GitHub repositories to your machine <a href="https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository">here</a>.
11) Run the setup script somewhere outside of the project's directory. 
12) If successful, run the start script outside of the project. Otherwise, email me at <a>beegyoshi9817@gmail.com</a>.
13) Disconnect all peripherals from your Pi, if desired. Ensure it is constantly powered on for best results. If switched off, simply plug it in and run the start script.
14) The app should now be fully functional and running in your store!

# Terms and Conditions/Privacy Policy
By using this app in your store, you agree to Taco Tell's <a href="legal/Taco Tell TOS and Privacy Policy Draft 2.pdf">Terms and Conditions</a> policy. By enrolling into the program, employees agree to our <a href="legal/Taco Tell TOS and Privacy Policy Draft 2.pdf">Terms and Conditions</a> and <a href="legal/Taco Tell TOS and Privacy Policy Draft 2.pdf">Privacy Policy</a>. Failure to comply with these terms while operating this app may result in removal or deactivation of the service and/or legal action as fully permissible by Utah state law and United States federal law as possible.