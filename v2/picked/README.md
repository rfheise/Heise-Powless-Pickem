# 2020 Heise Powless Pickem

Allows Users To Play Pickem To Winem For the current NFL Season. 

This project uses twilio for automated text messages.
This project uses mailgun to send and recieve emails.
This project is built using django.
This project used webflow as a GUI to create some of the html and css.


You can view all the rules to the game here https://heisepowlesspickem.com/darules

In order to run install all dependencies with pip.
Create a database with "python manage.py makemigrations" then "python manage.py migrate".
Then add all of the NFL teams to your database. 
You'll then have to edit pickem/settings.py to include your own mailing host.
You'll also have to edit winem/tasks.py with your own twilio api_keys if you want custom texts.
Then run "python manage.py runserver" and start your celery workers and you should be good to go.


# Credit Where Credit Is Due
- This project uses twilio for automated text messages.
- This project uses mailgun to send and recieve emails.
- This project is built using django.
- This project used webflow as a GUI to create some of the html and css.
