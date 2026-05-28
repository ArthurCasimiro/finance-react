from extensao import bd
from modelos.financeiro import Assinatura


class AssinaturaRepositorio:

    def listar_por_usuario(self, usuario_id):
        return Assinatura.query.filter_by(usuario_id=usuario_id).order_by(Assinatura.nome).all()

    def buscar_por_id(self, assinatura_id, usuario_id):
        return Assinatura.query.filter_by(id=assinatura_id, usuario_id=usuario_id).first()

    def salvar(self, assinatura):
        bd.session.add(assinatura)
        bd.session.commit()
        return assinatura

    def excluir(self, assinatura):
        bd.session.delete(assinatura)
        bd.session.commit()
