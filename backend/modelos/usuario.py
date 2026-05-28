from extensao import bd


class Usuario(bd.Model):
    __tablename__ = "usuarios"

    id = bd.Column(bd.Integer, primary_key=True)
    nome = bd.Column(bd.String(120), nullable=False)
    email = bd.Column(bd.String(120), unique=True, nullable=False)
    senha_hash = bd.Column(bd.String(256), nullable=False)

    contas = bd.relationship("Conta", backref="usuario", lazy=True)
    assinaturas = bd.relationship("Assinatura", backref="usuario", lazy=True)
    metas = bd.relationship("Meta", backref="usuario", lazy=True)
