# README #


Softwares/ stack requirements
1. Nodejs - development version v4.2.6
2. npm  - development version 3.5.2
3. mongo - development version 3.2.9


### How do I get set up? ###

-> clone repo / extract code
-> go to core code direction
-> run command "npm install"
-> run command "npm install bower -g"
-> run command "cd public/"
-> run command "bower install"
-> run command "cd .."
-> npm start

### Testing URL
http://localhost:5000/


#### Workflow of app
First page :Login page

There are 2 type of users
1. admin
2. General User

 > for admin login enter "admin" in "email" of login page and password "73069878bb6d14660a5988cfc9a6521d".
 > for general put your email and password in respective fields.

 ADMIN: 
 There is only one feature for admin. He/she can add new user with email and password

 GENERAL USER:
 For general user, there are 3 features:
 1) My List:
 	This features contain list of todos created for him by his buddies. Upon selecting one
 	list user can mark todos done. After marking done, todos will not come in his/her list

 2) Add new Buddy List
 	It has simple form in which user is supposed to put buddy's email and name of the list. If that email is not present in database, users will be notified, else new list will be created with buddy's email

 3) My Buddies
 	It contains list of your buddies and their todo lists. Upon selecting one list, one can see the status of task "done" or "new". User can also add new todo in particular list.