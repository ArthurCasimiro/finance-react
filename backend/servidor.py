from flask import Flask
from flask_cors import CORS
from extensao import bd

from modelos import usuario, financeiro

from blueprints.bp_auth import bp_auth
from blueprints.bp_contas import bp_contas
from blueprints.bp_assinaturas import bp_assinaturas
from blueprints.bp_metas import bp_metas


def criar_app():
    app = Flask(__name__)
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fintrack.db"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    CORS(app, resources={r"/api/*": {"origins": "*"}})

    bd.init_app(app)

    app.register_blueprint(bp_auth)
    app.register_blueprint(bp_contas)
    app.register_blueprint(bp_assinaturas)
    app.register_blueprint(bp_metas)

    with app.app_context():
        bd.create_all()

    return app


if __name__ == "__main__":
    app = criar_app()
    app.run(debug=True, port=5000)
