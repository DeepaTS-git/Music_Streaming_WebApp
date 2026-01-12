from flask_restful import Api, Resource, reqparse
from models import *
from flask_security import auth_required, auth_token_required
from flask_security import SQLAlchemyUserDatastore
from datetime import datetime

from flask import Flask, jsonify



api = Api()

class UserResource(Resource):

    @auth_token_required
    def get(self, email):
        current_user = User.query.filter_by(email=email).first()
        role_id = RolesUsers.query.filter_by(user_id = current_user.id ).first()
        user_role = Role.query.filter_by(id=role_id.role_id).first()
        # print("from resource.py")
        if current_user and role_id and user_role:
            user = {
                'id': current_user.id,
                'name': current_user.name,
                'email': current_user.email,
                'access': user_role.name,
            }   
            
            current_user.last_login=datetime.now() #import datetime
            db.session.commit()
            return jsonify(user=user)
        else:

            return { 
                jsonify(error="User not authorised."), 404
            }

api.add_resource(UserResource, '/api/user/<string:email>')    










