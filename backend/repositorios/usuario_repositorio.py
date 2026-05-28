from extensao import bd
from modelos.usuario import Usuario


class UsuarioRepositorio:

    def buscar_por_email(self, email):
        return Usuario.query.filter_by(email=email).first()

    def buscar_por_id(self, usuario_id):
        return Usuario.query.get(usuario_id)

    def salvar(self, usuario):
        bd.session.add(usuario)
        bd.session.commit()
        return usuario
