
# Only Once Share

## Project Overview
Only Once Share is a simple web application that enables users to share sensitive small text messages as securely as possible. The project allows users to paste their message on the home page and click on the "share it" button. The message is then encrypted with a randomly generated key and only the encrypted text is stored in an in-memory database. The key used to encrypt the message is returned to the user as a unique link, which can be shared with anyone, but only once. 

When a user clicks on the unique link, the encrypted message is decrypted and displayed to the user. Before returning the decrypted message, the encrypted message is completely removed from the memory database, making it inaccessible to anyone.

## Technologies Used
The Secure Text Sharing project was built using the following technologies:
* Python
* Flask web framework
* SQLAlchemy (for in-memory database)
* PyCryptodome (for encryption and decryption)

## Getting Started
To get started with this project, clone the repository and ensure that you have the following dependencies installed on your local machine:
* Python 3.x
* Flask
* SQLAlchemy
* PyCryptodome

To run the application, navigate to the root directory of the project and run the following command:
