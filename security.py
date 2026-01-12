from flask_security import Security, SQLAlchemyUserDatastore
from models import *

user_datastore = SQLAlchemyUserDatastore(db, User, Role)
sec = Security()


